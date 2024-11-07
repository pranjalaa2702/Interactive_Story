import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./StoryText.css";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI library

const PremadeStory = ({ token, onChoose }) => {
  const { storyId } = useParams();
  const [currentScene, setCurrentScene] = useState(null); // State to store only the current scene
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);

  const genAI = new GoogleGenerativeAI("AIzaSyD2m-GosuMGH6-wYa7Vg5EBBtk_2_aXN08"); // Replace with your Gemini API key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return '';
    }
  };

  const sanitizeJson = (text) => {
    text = text.replace(/[^\x20-\x7E\n\t]/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
    const choiceTextRegex = /("choices":\s*\[\s*{[^}]*?)"text":\s*".*?"/g;
    return text.replace(choiceTextRegex, '$1');
  };

  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
    const segment = await generateStorySegment(prompt);

    if (segment) {
      const sanitizedSegment = sanitizeJson(segment);
      try {
        const parsedSegment = JSON.parse(sanitizedSegment);
        setCurrentScene(parsedSegment);
      } catch (error) {
        console.error('Failed to parse segment:', sanitizedSegment);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
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

    generateScene(initialPrompt);
  }, [generateScene]);

  const handleChoice = (choice) => {
    setLastChoice(choice.option);

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

    generateScene(nextPrompt);
  };

  return (
    <div>
      {isLoading ? <div>Loading...</div> : (
        currentScene && (
          <div className="story-text">
            <p><strong>Perspective:</strong> {currentScene.perspective}</p>
            <p><strong>Scene:</strong> {currentScene.text}</p>
            <div className="choices">
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
