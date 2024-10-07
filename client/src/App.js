import React, { useState, useEffect } from 'react';
import StoryText from './StoryText';
import './App.css';

function App() {
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    fetchNode('start'); // Load the starting node when the component mounts
  }, []);

  const fetchNode = async (nodeId) => {
    try {
      const response = await fetch(`http://localhost:3001/story/${nodeId}`);
      const data = await response.json();
      console.log('Fetched data:', data); // Log the data fetched
      setCurrentNode(data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching node:', error);
    }
  };

  // Log currentNode to see if it's updating
  useEffect(() => {
    console.log('Current Node state:', currentNode);
  }, [currentNode]);

  if (!currentNode) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Interactive Story</h1>
      <StoryText node={currentNode} onChoose={fetchNode} />
    </div>
  );
}

export default App;
