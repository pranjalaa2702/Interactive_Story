// ResetPassword.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ForgotPassword.css';

function ResetPassword() {
  const { token } = useParams(); // Extract token from URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }), // Send the new password
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully. You can now log in with your new password.');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-2" id='forgot-password'>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
