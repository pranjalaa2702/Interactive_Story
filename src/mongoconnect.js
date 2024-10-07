const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://roshr:i0yzykZCS4iAsMxu@project1.r2d67.mongodb.net/?retryWrites=true&w=majority&appName=project1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB:', error));
