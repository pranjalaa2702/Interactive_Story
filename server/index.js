const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const StoryNode = require('./StoryNode');
const User = require('./User');
const nodemailer = require('nodemailer');

const app = express();
app.set('trust proxy', true);
const port = 3001; // This should match the client-side port

// JWT Secret and MongoDB URI (Hardcoded)
const JWT_SECRET = 'rosh is a dumbass'; // Replace with a strong secret key
const MONGODB_URI = 'mongodb+srv://roshr:VP6vOrMOZ5uKzMNw@project1.r2d67.mongodb.net/project1?retryWrites=true&w=majority&appName=project1';

app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another service
  auth: {
    user: 'metamorphosisrestaurant365@gmail.com', // Your email
    pass: 'cgka ugii xbwa hnjz', // Your email password or app password
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    addNode(); // Initialize story nodes
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Add Story Nodes Function
const addNode = async () => {
  const nodes = [
    {
      id: 'start',
      text: 'You are at a crossroads.',
      choices: [
        { text: 'Go left', nextNode: 'leftPath' },
        { text: 'Go right', nextNode: 'rightPath' }
      ]
    },
    {
      id: 'leftPath',
      text: 'You find yourself in a mysterious forest.',
      choices: [
        { text: 'Explore the forest', nextNode: 'forest' },
        { text: 'Go back to the crossroads', nextNode: 'start' }
      ]
    },
    {
      id: 'rightPath',
      text: 'You encounter a river.',
      choices: [
        { text: 'Swim across', nextNode: 'river' },
        { text: 'Return to the crossroads', nextNode: 'start' }
      ]
    },
    {
      id: 'forest',
      text: 'The forest is dark and full of secrets.',
      choices: [
        { text: 'Keep walking', nextNode: 'deepForest' },
        { text: 'Go back to the forest entrance', nextNode: 'leftPath' }
      ]
    },
  ];

  try {
    for (const node of nodes) {
      const existingNode = await StoryNode.findOne({ id: node.id });
      if (!existingNode) {
        await StoryNode.create(node);
        console.log(`Story node ${node.id} added to the database`);
      } else {
        console.log(`Story node ${node.id} already exists`);
      }
    }
  } catch (error) {
    console.error('Error adding story nodes:', error);
  }
};

// Registration Route
app.post('/api/auth/register', 
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, email, password: hashedPassword });
      await user.save();

      // Send verification email
      const verificationLink = `http://localhost:3001/api/auth/verify/${user._id}`;
      const mailOptions = {
        from: 'your_email@gmail.com', // Your email
        to: email,
        subject: 'Email Verification',
        text: `Hello ${username},\n\nPlease verify your email by clicking the link: ${verificationLink}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ success: true, message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
);

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login request body:', req.body);  // Add this to log the incoming request
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    console.error('Server Error during login:', error);  // Log the error
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Verification Route
app.get('/api/auth/verify/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verified = true; // Mark user as verified
    await user.save();
    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Error verifying email' });
  }
});

// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Protected Story Route
app.get('/story/:nodeId', authMiddleware, async (req, res) => {
  try {
    const nodeId = req.params.nodeId;
    const node = await StoryNode.findOne({ id: nodeId });

    if (!node) {
      return res.status(404).json({ success: false, error: 'Story node not found' });
    }
    res.json({ success: true, node });
  } catch (error) {
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
