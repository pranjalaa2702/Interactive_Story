import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import detectivePic from './detective_pic.jpg';
import './signup.css';

function Signup() {
  const [username, setUsername] = useState(''); //Stores username
  const [email, setEmail] = useState(''); //Stores email
  const [password, setPassword] = useState(''); //Stores password
  const [confirmPassword, setConfirmPassword] = useState(''); // Stores confirmed password
  const [message, setMessage] = useState(''); //Stores message (which gets generated later in the code)

  //Handling signup process after clicking signup button
  const handleSignup = async (event) => {
    event.preventDefault(); //Prevent default behaviour

    //Checking password and confirm password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    //Sending a post request to register a user
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }), // Include username in request
      });

      //Waiting for the response and validating it
      const data = await response.json();
      if (response.ok) {
        setMessage('Signup successful! Please check your email to verify your account.');
      } else if (data.errors) {
        setMessage(data.errors.map((error) => error.msg).join(', '));
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } 

    //Triggered when there is an error in posting
    catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-1">
      <div className="signup-box">
        <h2>TellMeWhy</h2>
        <p>Welcome to TellMeWhy where you can decide the destiny to your story</p>
        {message && <p style={{ color: 'red' }}>{message}</p>} {/* Message indicating next steps */}
        <form onSubmit={handleSignup}>

          {/* Every input field stores its data in its respective state when change is triggered */}
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(event) => setUsername(event.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(event) => setEmail(event.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(event) => setPassword(event.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(event) => setConfirmPassword(event.target.value)} 
            required 
          />
          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <div className="login-redirect">
          <p>Already have an account?</p>
          <Link to="/login" className="login-btn2">Login</Link>
        </div>
      </div>
      <div className="animation-box" id='signup-animation'>
        <img 
          src={detectivePic}
          alt="Detective Icon"
          className="detective-icon"
        />
      </div>
    </div>
  );
}

export default Signup;
