import React from 'react';
import ChoiceButtons from './ChoiceButtons';

function StoryText({ node, onChoose }) {
  // If node is not loaded yet, display loading message
  if (!node) {
    return <p>Loading...</p>;
  }

  return (
    <div className="story-text">
      <p>{node.text}</p>
      {/* Pass the choices to ChoiceButtons, and make sure to call onChoose with the next node id */}
      <ChoiceButtons choices={node.choices} onChoose={onChoose} />
    </div>
  );
}

export default StoryText;
