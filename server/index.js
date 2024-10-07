const express = require("express");
const mongoose = require('mongoose');
const StoryNode = require('./StoryNode'); // Import your model

const addNode = async () => {
  try {
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
    },];

    const savedNode = await StoryNode.insertMany(nodes);
    console.log('Node added:', savedNode);
  } catch (error) {
    console.error('Error adding node:', error);
  }
};


const app = express();
const port = 3001; // Make sure this matches what you're calling in App.js

const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb+srv://roshr:i0yzykZCS4iAsMxu@project1.r2d67.mongodb.net/project1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  addNode();
}
)
.catch(error => console.error('Error connecting to MongoDB:', error));

// API route to fetch story nodes by ID
app.get('/story/:nodeId', async (req, res) => {
  try {
    const nodeId = req.params.nodeId;
    const node = await StoryNode.findOne({ id: nodeId });

    if (!node) {
      return res.status(404).json({ error: 'Story node not found' });
    }
    res.json(node);
  } catch (error) {
    console.error('Error fetching node:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
