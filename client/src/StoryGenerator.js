import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './StoryText.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const StoryGenerator = ({ token, onChoose }) => {
  const { storyId } = useParams();
  const [currentScene, setCurrentScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const sceneLimit = 30;

  const genAI = new GoogleGenerativeAI('AIzaSyDFX-jeNr095kCQ_nqInr6mcxjLeePQZtI');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      const segment = response.response.text();
      console.log('API Response:', segment); // Debugging log
      return segment;
    } catch (error) {
      console.error('Gemini API error:', error);
      return '';
    }
  };

  const sanitizeJson = (text) => {
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.warn('No JSON match found in:', text); // Debugging log
      return '{}';
    }

    let sanitizedText = jsonMatch[0]
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ');

    console.log('Sanitized JSON:', sanitizedText); // Debugging log
    return sanitizedText;
  };

  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
    
    // Construct a more explicit prompt for the AI
    const aiPrompt = `
      Generate a JSON object for the next story segment. The object should look like this:
      {
        "perspective": "<character perspective>",
        "text": "<scene description>",
        "choices": [
          {"option": "<player choice>"},
          {"option": "<alternate choice>"}
        ]
      }
  
      The story starts with: "${prompt}"
    `;
    
    const segment = await generateStorySegment(aiPrompt);
  
    if (segment) {
      const sanitizedSegment = sanitizeJson(segment);
      try {
        const parsedSegment = JSON.parse(sanitizedSegment);
        console.log('Parsed JSON:', parsedSegment); // Debugging log
        
        if (parsedSegment.perspective && parsedSegment.text && Array.isArray(parsedSegment.choices)) {
          setCurrentScene(parsedSegment);
          setStoryProgress((prev) => {
            const updatedProgress = [...prev, parsedSegment];
            localStorage.setItem(`storyProgress_${storyId}`, JSON.stringify(updatedProgress));
            return updatedProgress;
          });
        } else {
          throw new Error('Incomplete or invalid JSON structure');
        }
      } catch (error) {
        console.error('Failed to parse JSON or invalid structure:', error, sanitizedSegment);
        setCurrentScene({
          perspective: 'Narrator',
          text: 'An error occurred while generating the story. Please try again.',
          choices: []
        });
      }
    } else {
      setCurrentScene({
        perspective: 'Narrator',
        text: 'An error occurred in the story progression. Please try again.',
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
    }
  }, [storyId]);

  const handleStartStory = () => {
    if (userPrompt.trim()) {
      setPromptSubmitted(true);
      generateScene(userPrompt);
    }
  };

  const handleChoice = (choice) => {
    setLastChoice(choice.option);

    if (storyProgress.length >= sceneLimit) {
      setCurrentScene({
        perspective: 'Narrator',
        text: 'The story has reached its thrilling conclusion. Thank you for playing!',
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

  const progressPercentage = (storyProgress.length / sceneLimit) * 100;

  return (
    <div>
      {!promptSubmitted ? (
        <div className="prompt-container">
          <textarea
            placeholder="Enter your starting prompt here..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows="4"
            cols="50"
            className="user-prompt"
          />
          <button onClick={handleStartStory}>Start Story</button>
        </div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        currentScene && (
          <div className="story-text">
            <p><strong>Perspective:</strong> {currentScene.perspective}</p>
            <p><strong>Scene:</strong> {currentScene.text}</p>
            {currentScene.choices && (
              <div className="choices">
                {currentScene.choices.map((choice, idx) => (
                  <button key={idx} style={{ display: 'block', margin: '5px 0' }} onClick={() => handleChoice(choice)}>
                    {choice.option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
};

export default StoryGenerator;
