import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const PremadeStory = ({ token, onChoose }) => {
  const { storyId } = useParams();
  const [currentScene, setCurrentScene] = useState(null); // State to store only the current scene
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const apiKey = '58feLhKI08jwC34BKB6wHFFKx4fMb2m6';

  const generateStorySegment = async (prompt) => {
    const apiUrl = 'https://api.ai21.com/studio/v1/chat/completions';

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": "jamba-1.5-large",
          "messages": [{ "role": "user", "content": prompt }],
          "documents": [],
          "tools": [],
          "n": 1,
          "max_tokens": 4096,
          "temperature": 0.7,
          "top_p": 1,
          "stop": [],
          "response_format": { "type": "text" }
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        console.error('Invalid response structure:', data);
        return '';
      }
    } catch (error) {
      console.error('AI21 API error:', error);
      return '';
    }
  };

  // Function to sanitize JSON text
  const sanitizeJson = (text) => {
    text = text.replace(/[^\x20-\x7E\n\t]/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');

    const choiceTextRegex = /("choices":\s*\[\s*{[^}]*?)"text":\s*".*?"/g;
    return text.replace(choiceTextRegex, '$1');
  };

  // Function to generate and parse a single story segment
  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
    const segment = await generateStorySegment(prompt);

    if (segment) {
      const sanitizedSegment = sanitizeJson(segment);
      try {
        const parsedSegment = JSON.parse(sanitizedSegment);
        setCurrentScene(parsedSegment); // Set the current scene
      } catch (error) {
        console.error('Failed to parse segment:', sanitizedSegment);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initial prompt to generate the first scene
    const initialPrompt = `Generate a scene in a romantic thriller story involving secrets and danger, formatted as a JSON object. Each scene should strictly follow this format:
    {
      "perspective": "<character perspective, e.g., 'Detective', 'Lover', or 'Villain'>",
      "text": "<descriptive text setting up the scene with tension, emotion, and vivid details>",
      "choices": [
        {"option": "<player choice, involving decisions that carry emotional or physical risk>"},
        {"option": "<another player choice, leading to different outcomes or secrets revealed>"}
      ]
    }
    Only provide the JSON object without any additional text or formatting.`;

    generateScene(initialPrompt); // Generate the first scene
  }, [generateScene]);

  const handleChoice = (choice) => {
    setLastChoice(choice.option); // Store the last choice made by the player

    // Prepare the prompt for the next scene based on the last scene and user's choice
    const nextPrompt = `The previous scene in a JSON format:
    ${JSON.stringify(currentScene)} 
    User's last choice: ${choice.option} 
    Based on the previous scene in a romantic thriller story filled with secrets and danger, generate the next scene strictly as a JSON object. Each scene should follow this format:
    {
      "perspective": "<character perspective, e.g., 'Lover', 'Detective', or 'Villain'>",
      "text": "<narrative that advances the plot based on the last scene, adding intrigue and developing the relationship between the characters>",
      "choices": [
        {"option": "<player choice that deepens the suspense or advances the romance>"},
        {"option": "<alternate choice, leading to a different outcome or secret>"}
      ]
    }
    Only provide the JSON object without any additional text or formatting.`;

    generateScene(nextPrompt); // Generate the next scene
  };

  return (
    <div>
      <h2>Generated Story:</h2>
      {isLoading ? (
        <p>Loading story...</p>
      ) : (
        currentScene && (
          <div>
            <h2>Story ID: {storyId}</h2>
            <p><strong>Perspective:</strong> {currentScene.perspective}</p>
            <p><strong>Scene:</strong> {currentScene.text}</p>
            <div>
              {currentScene.choices.map((choice, idx) => (
                <button key={idx} style={{ display: 'block', margin: '5px 0' }} onClick={() => handleChoice(choice)}>
                  {choice.option}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PremadeStory;
