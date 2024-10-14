import React from 'react';
import { useParams } from 'react-router-dom';
import ChoiceButtons from './ChoiceButtons';

function StoryText({ onChoose }) {
  const { nodeId } = useParams();
  const node = {}; // Fetch or load the node data here based on nodeId

  // If node is not loaded yet, display loading message
  if (!node) {
    return <p>Loading...</p>;
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
