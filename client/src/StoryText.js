import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChoiceButtons from './ChoiceButtons';
import './StoryText.css'; 

function StoryText({ token, onChoose }) {
  const { nodeId } = useParams();
  const [node, setNode] = useState(null); // State to hold the story node data
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchStoryNode = async () => {
      try {
        const response = await axios.get(`/story/${nodeId}`, {
          headers: {
            'x-access-token': token, // Use the token here
          },
        });
        
        // Assuming the API returns the node data as 'node'
        if (response.data.success) {
          setNode(response.data.node); // Set the fetched node data
        } else {
          console.error('Error fetching node:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching story node:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchStoryNode();
  }, [nodeId, token]); // Include nodeId and token in the dependency array

  // If loading, display loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If node is not found, display an error message
  if (!node) {
    return <p>Error: Node not found</p>;
  }

  return (
    <div className="story-text">
      <p>{node.perspective}</p>
      <p style={{ whiteSpace: 'pre-line' }}>{node.text}</p>
      <ChoiceButtons choices={node.choices} onChoose={onChoose} />
    </div>
  );
}

export default StoryText;
