import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom'; // Removed BrowserRouter import
import StoryText from './StoryText';
import Signup from './Signup';
import Login from './Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNode('start'); // Load the starting node when logged in
    }
  }, [isLoggedIn]);

  const fetchNode = async (nodeId) => {
    try {
      const response = await fetch(`http://localhost:3001/story/${nodeId}`);
      const data = await response.json();
      setCurrentNode(data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching node:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </>
      ) : (
        <>
          <h1>Interactive Story</h1>
          {currentNode ? (
            <StoryText node={currentNode} onChoose={fetchNode} />
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
