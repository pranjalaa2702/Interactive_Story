import React, { useState } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginSuccess = (authToken) => {
    setIsLoggedIn(true);
    setToken(authToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
  };

  const handleChoose = (choice) => {
    console.log("User chose:", choice);
    navigate(`/story/${choice}`);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <>
          <nav>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </nav>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      ) : (
        <div className="app-container">
          <nav>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate-story" element={<StoryGenerator />} />
            <Route path="/story/:nodeId" element={<StoryText token={token} onChoose={handleChoose}/>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;