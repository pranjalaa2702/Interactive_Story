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
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Login State
  const [token, setToken] = useState(null); //?
  const [isMuted, setIsMuted] = useState(false); //For audio, muted or not
  const navigate = useNavigate(); //Used to navigate between pages
  const audioRef = useRef(null); //Ref because we dont want it to re-render the component (like useState)

  //Gets the auth token that the browser stores, so that when a user has logged in in the previous session, they dont have to re-login
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); 
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  //Based on the isMuted state, it triggers the sound.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  //This is the reason we don't need to re-login. It stores if the user has logged in or not and skips that process for us
  const handleLoginSuccess = (authToken) => {
    localStorage.setItem('authToken', authToken);
    setIsLoggedIn(true);
    setToken(authToken);
  };

  //Clears login state when someone logs out and navigates them to the login page.
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setToken(null);
    navigate('/login');
  };

  //Toggling between unmute and mute. Remember that starting is unmuted.
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  //Navigating to the choice the user made
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

      {/* If user is logged in, they are taken to dashboard. Else, to login page. The star path is the default path incase a user enters an invalid path. */}
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
