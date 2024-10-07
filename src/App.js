import React, { useState, useEffect } from 'react';
import StoryText from './StoryText.js';

function App() {
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    fetchNode('start'); // Load the starting node
  }, []);

  const fetchNode = async (nodeId) => {
    try {
      const response = await fetch(`http://localhost:3001/story/${nodeId}`);
      const data = await response.json();
      setCurrentNode(data);
    } catch (error) {
      console.error('Error fetching node:', error);
    }
  };
  if (!currentNode) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1>Interactive Story</h1>
      <StoryText node={currentNode} onChoose={fetchNode} />
    </div>
  );
}

export default App;
