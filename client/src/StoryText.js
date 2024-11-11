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
    // Extract the JSON block between the first and last curly braces
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) {
      return '{}'; // Return an empty object if no JSON is found
    }

    // Clean up potential issues within the JSON block
    let sanitizedText = jsonMatch[0]
      .replace(/[^\x20-\x7E\n\t]/g, '') // Remove non-printable ASCII characters
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
      .replace(/"choices":\s*\[\s*{[^}]*?"text":\s*".*?"/g, ''); // Remove invalid "text" fields in choices

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
        setStoryProgress((prev) => [...prev, parsedSegment]);
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
  }, []);

  useEffect(() => {
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
  }, [generateScene]);

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

