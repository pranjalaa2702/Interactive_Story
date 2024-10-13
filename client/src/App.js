import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import StoryText from './StoryText';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchNode('1', token); // Fetch the starting story node when user logs in
    }
  }, [isLoggedIn, token]);

  const fetchNode = async (nodeId, authToken) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/story/${nodeId}`, {
        headers: {
          'x-access-token': authToken, // Ensure the token is passed in the request header
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch story node');
      }
      const data = await response.json();
      setCurrentNode(data.node);
    } catch (error) {
      console.error('Error fetching node:', error);
    } finally {
      setLoading(false); // Stop loading after fetching the node
    }
  };

  const handleLoginSuccess = (authToken) => {
    setIsLoggedIn(true);
    setToken(authToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setCurrentNode(null);
  };

  const handleChoiceClick = (nextNodeId) => {
    fetchNode(nextNodeId, token);
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
        <div className="story-container">
          <nav>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          {loading ? (
            <p>Loading story...</p>
          ) : currentNode ? (
            <StoryText
              node={currentNode}
              onChoose={handleChoiceClick} // Ensure you pass handleChoiceClick as onChoose
            />
          ) : (
            <p>No story node found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;