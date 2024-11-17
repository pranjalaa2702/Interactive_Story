// ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState(''); //Stores email
  const [message, setMessage] = useState(''); //Stores message (which gets generated later in the code)

  const handleForgotPassword = async (e) => {
    e.preventDefault(); //Prevents default behaviour

    //Sending a post request to verify if a user exists and send them the reset password link.
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      //Waiting for the response and giving appropriate response
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
    <div className="container-2" id='forgot-password'>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>} {/* Message indicating next steps */}
      <form onSubmit={handleForgotPassword}>
        
        {/* Email stored in email state when change is triggered */}
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
