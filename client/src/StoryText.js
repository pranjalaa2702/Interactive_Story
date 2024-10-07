// StoryText.js
import React from 'react';
import ChoiceButtons from './ChoiceButtons';

function StoryText({ node, onChoose }) {
  if (!node) {
    return <p>Loading...</p>;
  }

  return (
    <div className="story-text">
      <p>{node.text}</p>
      <ChoiceButtons choices={node.choices} onChoose={onChoose} />
    </div>
  );
}

export default StoryText;
