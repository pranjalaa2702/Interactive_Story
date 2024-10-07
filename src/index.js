// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
const express = require('express');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

// Create a model based on the schema
const User = mongoose.model('User', UserSchema);

// Create and save a new user
const addUser = async () => {
  try {
    const newUser = new User({
      name: 'Jacob M',
      email: 'jacob@gmail.com',
      age: 50
    });

    const savedUser = await newUser.save(); // Save the user to the database
    console.log('User added:', savedUser);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const app = express();
const port = 3000;

// MongoDB connection string (replace <username>, <password>, and <database>)
mongoose.connect('mongodb+srv://roshr:i0yzykZCS4iAsMxu@project1.r2d67.mongodb.net/project1?retryWrites=true&w=majority&appName=project1')
.then(() => {
  console.log('Connected to MongoDB Atlas');
  addUser();
})
.catch(err => console.error('MongoDB connection error:', err));

// A simple route to test if the server is running
app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
