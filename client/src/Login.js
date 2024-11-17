import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import detectivePic from './detective_pic.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState(''); //Stores email
  const [password, setPassword] = useState(''); //Stores password
  const [message, setMessage] = useState(''); //Stores message (which gets generated later in the code)

  const handleLogin = async (e) => {
    e.preventDefault(); //Prevents default behaviour

    //Sending a post request to verify a user and log them in.
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      //Waiting for the response and validating it
      const data = await response.json();
      if (response.ok) {
        onLogin(data.token);
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } 

    //Triggered when there is an error in posting
    catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-3" id='login-box'>
      <div className="login-box">
        <h2>Login</h2>
        {message && <p style={{ color: 'red' }}>{message}</p>} {/* Error message */}
        <form onSubmit={handleLogin}>

          {/* Every input field stores its data in its respective state when change is triggered */}
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
          
          {/* Forgot password */}
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          
          <button type="submit" className="login-btn">Login</button>
          
          {/* Signup*/}
          <div className="signup-section">
            <span>Don't have an account? </span>
            <Link to="/signup" className="signup-link">Signup</Link>
          </div>
        </form>
      </div>
      <div className="animation-box">
        <img
          src={detectivePic}
          alt="Detective Icon"
          className="detective-icon"
        />
      </div>
    </div>
  );
}

export default Login;
