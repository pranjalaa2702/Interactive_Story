const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,  // Minimum length for username
    maxlength: 30, // Maximum length for username
    match: /^[a-zA-Z0-9]+$/ // Allows only alphanumeric usernames
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Ensure email is stored in lowercase
    match: /.+\@.+\..+/ // Basic email validation regex
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 // Minimum length for password
  },
  verified: { 
    type: Boolean, 
    default: false // New field for verification status
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const User = mongoose.model('User', UserSchema);

module.exports = User;
