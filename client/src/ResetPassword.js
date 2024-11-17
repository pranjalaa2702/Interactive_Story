// ResetPassword.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ForgotPassword.css';

function ResetPassword() {
  const { token } = useParams(); //Get token from url
  const [newPassword, setNewPassword] = useState(''); //Store new password
  const [confirmPassword, setConfirmPassword] = useState(''); //Store confirmed new password
  const [message, setMessage] = useState(''); //Store message

  const handleReset = async (e) => {
    e.preventDefault(); //Prevent default behaviour

    //Check if new password and confirmed new password are equal
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    //Sending a post request to verify if the user comes from the right reset password link
    try {
      const response = await fetch(`http://localhost:3001/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      //Waiting for the response and giving appropriate response
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully. You can now log in with your new password.');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } 
    catch (error) {
      console.error('Error:', error);
      setMessage('Network error: Please check your connection.');
    }
  };

  return (
    <div className="container-2" id='forgot-password'>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>} {/* Message indicating next steps */}
      <form onSubmit={handleReset}>

        {/* Email stored in email state when change is triggered */}
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
