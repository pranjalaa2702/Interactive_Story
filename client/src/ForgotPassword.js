// ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css'; // Assuming you save the CSS in a separate file

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset email sent. Please check your inbox.');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
