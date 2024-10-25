import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css'; // Import your CSS file here
import detectivePic from './detective_pic.jpg'; // Adjust the path as necessary based on your directory structure

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.token); // Call the onLogin function passed as prop
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-3" id='login-box'>
      <div className="login-box">
        <h2>Login</h2>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <form onSubmit={handleLogin}>
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
          
          {/* Forgot Password Link */}
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          
          {/* Login Button */}
          <button type="submit" className="login-btn">Login</button>
          
          {/* Signup Link with "Don't have an account?" text */}
          <div className="signup-section">
            <span>Don't have an account? </span>
            <Link to="/signup" className="signup-link">Signup</Link>
          </div>
        </form>
      </div>
      <div className="animation-box">
        <img
          src={detectivePic} // Replace with your icon's URL
          alt="Detective Icon"
          className="detective-icon"
        />
      </div>
    </div>
  );
}

export default Login;
