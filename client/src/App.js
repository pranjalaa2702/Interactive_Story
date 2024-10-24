import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'; 
import StoryText from './StoryText';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import StoryGenerator from './StoryGenerator';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Check if the user is already logged in by retrieving the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (authToken) => {
    // Store the token in localStorage for persistence
    localStorage.setItem('authToken', authToken);
    setIsLoggedIn(true);
    setToken(authToken);
  };

  const handleLogout = () => {
    // Clear the token from localStorage and update the state
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setToken(null);
    navigate('/login'); // Navigate to login after logging out
  };

  const handleChoose = (choice) => {
    console.log("User chose:", choice);
    navigate(`/story/${choice}`);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="app-container">
          <nav>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/generate-story" element={<StoryGenerator />} />
            <Route path="/story/:nodeId" element={<StoryText token={token} onChoose={handleChoose} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
