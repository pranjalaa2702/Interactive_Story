import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./StoryText.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PremadeStory = ({ token, onChoose }) => {
  const { storyId } = useParams();
  const [currentScene, setCurrentScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const sceneLimit = 30;

  const genAI = new GoogleGenerativeAI("AIzaSyDFX-jeNr095kCQ_nqInr6mcxjLeePQZtI");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      const retryPrompt = `Please generate a scene in a romantic thriller with simpler language, formatted as JSON:
      {
        "perspective": "<character perspective>",
        "text": "<scene description>",
        "choices": [
          {"option": "<player choice>"},
          {"option": "<alternate choice>"}
        ]
      }`;
      try {
        const retryResponse = await model.generateContent(retryPrompt);
        return retryResponse.response.text();
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return '';
      }
    }
  };

  const sanitizeJson = (text) => {
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) {
      return '{}';
    }

    let sanitizedText = jsonMatch[0]
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"choices":\s*\[\s*{[^}]*?"text":\s*".*?"/g, '');

    return sanitizedText;
  };

  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
    const segment = await generateStorySegment(prompt);

    if (segment) {
      const sanitizedSegment = sanitizeJson(segment);
      try {
        const parsedSegment = JSON.parse(sanitizedSegment);
        setCurrentScene(parsedSegment);
        setStoryProgress((prev) => {
          const updatedProgress = [...prev, parsedSegment];
          localStorage.setItem(`storyProgress_${storyId}`, JSON.stringify(updatedProgress));
          return updatedProgress;
        });
      } catch (error) {
        console.error('Failed to parse segment:', sanitizedSegment);
      }
    } else {
      setCurrentScene({
        perspective: "Narrator",
        text: "An error occurred in the story progression. Please try again.",
        choices: []
      });
    }
    setIsLoading(false);
  }, [storyId]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`storyProgress_${storyId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setStoryProgress(parsedProgress);
      setCurrentScene(parsedProgress[parsedProgress.length - 1]);
    } else {
      const initialPrompt = `Generate the opening scene in a romantic thriller with a JSON format:
      {
        "perspective": "<character perspective, e.g., 'Detective', 'Lover', or 'Villain'>",
        "text": "<detailed scene description>",
        "choices": [
          {"option": "<player choice>"},
          {"option": "<another player choice>"}
        ]
      }`;

      generateScene(initialPrompt);
    }
  }, [generateScene, storyId]);

  const handleChoice = (choice) => {
    setLastChoice(choice.option);

    if (storyProgress.length >= sceneLimit) {
      setCurrentScene({
        perspective: "Narrator",
        text: "The story has reached its thrilling conclusion. Thank you for playing!",
        choices: []
      });
      return;
    }

    const previousScenes = storyProgress.map(scene => scene.text).join(' ');
    const nextPrompt = `Based on previous scenes: "${previousScenes}" and user's choice "${choice.option}", generate the next scene in JSON format:
    {
      "perspective": "<character perspective>",
      "text": "<scene description>",
      "choices": [
        {"option": "<player choice>"},
        {"option": "<alternate choice>"}
      ]
    }`;

    generateScene(nextPrompt);
  };

  // Calculate progress percentage
  const progressPercentage = (storyProgress.length / sceneLimit) * 100;

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
      
      <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
      </div>

    </div>
  );
};

export default PremadeStory;
