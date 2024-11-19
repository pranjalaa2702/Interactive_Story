import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./StoryText.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

//To Do in this file
//1. Loading spinner thing
//2. Move Gemini API to env
//3. Change to different prompts for each of the 3 premade stories
//4. Change progress from local storage to mongo

const PremadeStory = ({ token, onChoose, onLogout }) => {
  const { storyId } = useParams(); //Storing story id
  const [currentScene, setCurrentScene] = useState(null); //Storing current scene
  const [isLoading, setIsLoading] = useState(false); //Storing loading status
  const [lastChoice, setLastChoice] = useState(null); //Storing the last choice
  const [storyProgress, setStoryProgress] = useState([]); //Storing progress
  const [storyOver, setStoryOver] = useState(false); //Storing if story completed or not

  const navigate = useNavigate();

  //Gemini API
  const genAI = new GoogleGenerativeAI("AIzaSyDFX-jeNr095kCQ_nqInr6mcxjLeePQZtI");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //Generating story based on prompt which are premade.
  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      return response.response.text();
    } 
    catch (error) {
      console.error('Gemini API error:', error);
      generateStorySegment(prompt);
    }
  };

  // Sanitizing the JSON response from the API
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

  // Generating a scene based on a prompt
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

        // Check if the AI has naturally concluded the story
        if (parsedSegment.text.toLowerCase().includes("the end") || parsedSegment.text.toLowerCase().includes("conclusion")) {
          setStoryOver(true);
        }
      } 
      catch (error) {
        console.error('Failed to parse segment:', sanitizedSegment);
      }
    } 
    else {
      generateScene(prompt);
    }
    setIsLoading(false);
  }, [storyId]);

  // Effect to load saved progress or generate the initial scene
  useEffect(() => {
    const savedProgress = localStorage.getItem(`storyProgress_${storyId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setStoryProgress(parsedProgress);
      setCurrentScene(parsedProgress[parsedProgress.length - 1]);
    } else {
      const initialPrompt = `Generate the opening scene of a romantic thriller in 2-3 sentences (max 150 words), in JSON format:
      {
        "perspective": "<character perspective, e.g., 'Detective', 'Lover', or 'Villain'>",
        "text": "<short, impactful scene description that grabs attention>",
        "choices": [
          {"option": "<player choice>"},
          {"option": "<another player choice>"}
        ]
      }`;

      generateScene(initialPrompt);
    }
  }, [generateScene, storyId]);

  // Handling player's choice
  const handleChoice = (choice) => {
    setLastChoice(choice.option);

    const previousScenes = storyProgress.map(scene => scene.text).join(' ');
    const nextPrompt = `Based on previous scenes: "${previousScenes}" and the user's choice "${choice.option}", generate the next scene in 2-3 sentences (max 150 words), formatted as JSON:
    {
      "perspective": "<character perspective>",
      "text": "<brief but meaningful scene description. If the story is close to concluding, include a hint of resolution or closure.>",
      "choices": [
        {"option": "<player choice>"},
        {"option": "<alternate choice>"}
      ]
    }`;

    generateScene(nextPrompt);
  };

  // Handle Restart or Go to Homepage
  const handleRestart = () => {
    // Clear progress and reset state
    setStoryProgress([]);
    setStoryOver(false);
    localStorage.setItem(`storyProgress_${storyId}`, JSON.stringify([]));
    const initialPrompt = `Generate the opening scene of a romantic thriller in 2-3 sentences (max 150 words), in JSON format:
    {
      "perspective": "<character perspective, e.g., 'Detective', 'Lover', or 'Villain'>",
      "text": "<short, impactful scene description that grabs attention>",
      "choices": [
        {"option": "<player choice>"},
        {"option": "<another player choice>"
      }`;

    generateScene(initialPrompt);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const progressPercentage = (storyProgress.length / 50) * 100; // Adjusted progress bar calculation

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

      {isLoading ? <div>Loading...</div> : (
        currentScene && !storyOver ? (
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
        ) : (
          <div className="story-over">
            <p>The story has reached its thrilling conclusion!</p>
            <div>
              <button onClick={handleRestart}>Start Over</button>
              <button onClick={handleGoHome}>Go to Homepage</button>
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
