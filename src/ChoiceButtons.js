import React from 'react';

function ChoiceButtons({ choices, onChoose }) {
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
