import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './StoryText.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClipLoader } from 'react-spinners'; // For loading spinner

const StoryGenerator = ({ token, onChoose, onLogout }) => {
  const { storyId } = useParams();
  const [storyName, setStoryName] = useState('');
  const [currentScene, setCurrentScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button disable state
  const sceneLimit = 30;

  // Assuming the API key is stored in environment variables
  //const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI('AIzaSyDFX-jeNr095kCQ_nqInr6mcxjLeePQZtI');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      const segment = response.response.text();
      console.log('API Response:', segment);
      return segment;
    } catch (error) {
      console.error('Gemini API error:', error);
      return '';
    }
  };

  const sanitizeJson = (text) => {
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) {
      console.warn('No JSON match found in:', text);
      return '{}';
    }

    let sanitizedText = jsonMatch[0]
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ');

    console.log('Sanitized JSON:', sanitizedText);
    return sanitizedText;
  };

  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
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
        if (parsedSegment.perspective && parsedSegment.text && Array.isArray(parsedSegment.choices)) {
          setCurrentScene(parsedSegment);
          setStoryProgress((prev) => {
            const updatedProgress = [...prev, parsedSegment];
            localStorage.setItem(`storyProgress_${storyId}`, JSON.stringify(updatedProgress));
            return updatedProgress;
          });

          // Save story to local storage only if the name is unique
          const savedStories = JSON.parse(localStorage.getItem('userStories')) || [];
          if (!savedStories.find(story => story.name === storyName)) {
            const newStory = {
              id: storyId,
              name: storyName,
              progress: [...storyProgress, parsedSegment],
            };
            localStorage.setItem('userStories', JSON.stringify([...savedStories, newStory]));
          }
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
  }, [storyId, storyName, storyProgress]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`storyProgress_${storyId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setStoryProgress(parsedProgress);
      setCurrentScene(parsedProgress[parsedProgress.length - 1]);
    }
  }, [storyId]);

  const handleStartStory = () => {
    if (!storyName.trim() || !userPrompt.trim()) {
      alert('Please fill in both the story name and the prompt.');
      return;
    }
    setPromptSubmitted(true);
    generateScene(userPrompt);
  };

  const handleChoice = (choice) => {
    setLastChoice(choice.option);
    setIsButtonDisabled(true); // Disable button after choice

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
      <header>
        <nav>
          <div className="logo">
            <h1>Tell Me Why</h1>
          </div>
          <ul className="nav-links">
            <li><a href="./../dashboard#stories">Stories</a></li>
            <li><a href="./../dashboard#about">About Us</a></li>
            <li><a href="./../dashboard#contact">Contact</a></li>
            <li>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      {!promptSubmitted ? (
        <div className="prompt-container">
          <input
            type="text"
            placeholder="Enter your story name..."
            value={storyName}
            onChange={(e) => setStoryName(e.target.value)}
          />
          <textarea
            placeholder="Enter your starting prompt here..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows="4"
            cols="50"
            className="user-prompt"
          />
          <button className="start" onClick={handleStartStory}>Start Story</button>
        </div>
      ) : isLoading ? (
        <div className="loading-spinner">
          <ClipLoader size={50} color={"#123abc"} />
        </div>
      ) : (
        currentScene && (
          <div className="story-text">
            <p><strong>Perspective:</strong> {currentScene.perspective}</p>
            <p><strong>Scene:</strong> {currentScene.text}</p>
            {currentScene.choices && (
              <div className="choices">
                {currentScene.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice)}
                    disabled={isButtonDisabled}
                  >
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
        <p>{`Progress: ${storyProgress.length} / ${sceneLimit}`}</p>
      </div>

      <div className="restart-container">
        <button className="restart" onClick={() => window.location.reload()}>Restart Story</button>
      </div>
    </div>
  );
};

export default StoryGenerator;
