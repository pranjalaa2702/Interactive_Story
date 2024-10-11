// ChoiceButtons.js
import React from 'react';

function ChoiceButtons({ choices, onChoose }) {
  if (!choices || choices.length === 0) {
    return <p>No choices available</p>;
  }

  return (
    <div className="choice-buttons">
      {choices.map((choice, index) => (
        <button key={index} onClick={() => onChoose(choice.nextNode)}>
          {choice.text}
        </button>
      ))}
    </div>
  );
}

export default ChoiceButtons;
