import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'; 
import PremadeStory from './StoryText';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import StoryGenerator from './StoryGenerator';
import backgroundMusic from './Kingdom_dance.mp3';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  // Check if the user is already logged in by retrieving the token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

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

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleChoose = (choice) => {
    console.log("User chose:", choice);
    navigate(`/story/${choice}`);
  };

  return (
    <div className="App">
      {isLoggedIn && (
        <>
          {/* Persistent Audio Element */}
          <audio ref={audioRef} autoPlay loop>
            <source src={backgroundMusic} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>

          {/* Mute/Unmute Button */}
          <button
            className="mute-btn"
            onClick={toggleMute}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              background: '#5d4037',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '10px 15px',
              cursor: 'pointer',
            }}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </>
      )}

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
          <Routes>
            <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/generate-story" element={<StoryGenerator onLogout={handleLogout}/>} />
            <Route path="/story/:storyId" element={<PremadeStory token={token} onChoose={handleChoose} onLogout={handleLogout}/>} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
