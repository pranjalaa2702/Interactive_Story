import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './signup.css'; // Assuming this is the path to your CSS file

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }), // Include username in request
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Signup successful! Please check your email to verify your account.');
      } else if (data.errors) {
        setMessage(data.errors.map((error) => error.msg).join(', '));
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-1">
      <div className="signup-box">
        <h2>TellMeWhy</h2>
        <p>Welcome to TellMeWhy where you can decide the destiny to your story</p>
        {message && <p style={{ color: 'red' }}>{message}</p>} {/* Error message */}
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <div className="login-redirect">
          <p>Already have an account?</p>
          <Link to="/login" className="login-btn2">Login</Link>
        </div>
      </div>
      <div className="animation-box">
        <img 
          src={require('./detective_pic.jpg')} // Replace with your actual image path
          alt="Detective Icon"
          className="detective-icon"
        />
      </div>
    </div>
  );
}

export default Signup;
