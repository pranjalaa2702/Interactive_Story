import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './StoryText.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClipLoader } from 'react-spinners'; // For loading spinner

//To Do in this file
//1. Change progress storage from local storage to mongo
//2. Move Gemini API to env

const StoryGenerator = ({ token, onChoose, onLogout }) => {
  const { storyId } = useParams(); //Stores story id
  const [storyName, setStoryName] = useState(''); //Stores story name
  const [currentScene, setCurrentScene] = useState(null); //Stores current scene
  const [isLoading, setIsLoading] = useState(false); //Stores loading status
  const [lastChoice, setLastChoice] = useState(null); //Stores the last choice
  const [storyProgress, setStoryProgress] = useState([]); //Stores the progress of the story
  const [userPrompt, setUserPrompt] = useState(''); //Stores user prompt
  const [promptSubmitted, setPromptSubmitted] = useState(false); //Stores the prompt to sent to gemini
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); //Stores button state

  //To store API key in environment variables
  //const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI('AIzaSyDFX-jeNr095kCQ_nqInr6mcxjLeePQZtI');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  //Connecting to Gemini and checking the response
  const generateStorySegment = async (prompt) => {
    try {
      const response = await model.generateContent(prompt);
      const segment = response.response.text();
      console.log('API Response:', segment);
      return segment;
    } 
    catch (error) {
      console.error('Gemini API error:', error);
      return '';
    }
  };

  //Sanitizing the output
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

  //useCallback is a cache function that doesn't need to recalculate values every time and gives faster outputs
  const generateScene = useCallback(async (prompt) => {
    setIsLoading(true);
    const aiPrompt = prompt;

    //Passing the prompt through the generateStory function and getting the Gemini output which is sanitized so that JSON parser can work on it
    const segment = await generateStorySegment(aiPrompt);
    if (segment) {
      const sanitizedSegment = sanitizeJson(segment);
      try {
        const parsedSegment = JSON.parse(sanitizedSegment);

        //Checking if all outputs from parser are useable. If yes, then setting current scene and updating the progress
        if (parsedSegment.perspective && parsedSegment.text && Array.isArray(parsedSegment.choices)) {
          setCurrentScene(parsedSegment);
          setStoryProgress((prev) => {
            const updatedProgress = [...prev, parsedSegment];
            localStorage.setItem(`storyProgress_${storyId}`, JSON.stringify(updatedProgress)); //Change from localStorage to mongo
            return updatedProgress;
          });

          //If the story hasn't been saved yet, save it
          const savedStories = JSON.parse(localStorage.getItem('userStories')) || [];
          if (!savedStories.find(story => story.name === storyName)) {
            const newStory = {
              id: storyId,
              name: storyName,
              progress: [...storyProgress, parsedSegment],
            };
            localStorage.setItem('userStories', JSON.stringify([...savedStories, newStory]));
          }
        } 

        //Error
        else {
          throw new Error('Incomplete or invalid JSON structure');
        }
      } 

      //Error
      catch (error) {
        console.error('Failed to parse JSON or invalid structure:', error, sanitizedSegment);
        generateScene(prompt);
      }
    } 
    else {
      generateScene(prompt);
    }
    setIsLoading(false);
  }, [storyId, storyName, storyProgress]);

  //When user continues playing the game
  useEffect(() => {
    const savedProgress = localStorage.getItem(`storyProgress_${storyId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setStoryProgress(parsedProgress);
      setCurrentScene(parsedProgress[parsedProgress.length - 1]);
    }
  }, [storyId]);

  //Handling error of when user doesn't provide name of story and prompt
  const handleStartStory = () => {
    if (!storyName.trim() || !userPrompt.trim()) {
      alert('Please fill in both the story name and the prompt.');
      return;
    }
    setPromptSubmitted(true);
    const prompt = `
      Please generate a concise and impactful scene (maximum 150 words) formatted as JSON:
      {
        "perspective": "<character perspective>",
        "text": "<short, meaningful scene description>",
        "choices": [
          {"option": "<player choice>"},
          {"option": "<alternate choice>"}
        ]
      }

      The story starts with: "${userPrompt}"
    `
    generateScene(prompt);
  };

  //Once user has picked options, the button is disabled and next scene is generated
  const handleChoice = (choice) => {
    setLastChoice(choice.option);
    setIsButtonDisabled(true); // Disable button after choice

    const previousScenes = storyProgress.map(scene => scene.text).join(' ');
    const nextPrompt = `The story is based on: ${userPrompt}
    Based on previous scenes: "${previousScenes}" and user's choice "${choice.option}", generate the next concise and impactful scene (maximum 150 words) in JSON format:
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

      {/* If prompt hasn't been submitted yet, show the prompt container */}
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
      )  
      
      // If Gemini is processing, isLoading is true and the spinner is activated
      :isLoading ? (
        <div className="loading-spinner">
          <ClipLoader size={50} color={"#123abc"} />
        </div>
      ) 

      //If not loading, scene is displayed
      : (
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

      {/* Progress bar on the bottom right corner*/}
      <div className="progress-bar-container">
        <p>{`Scenes generated: ${storyProgress.length}`}</p>
      </div>

      {/* Restart button */}
      <div className="restart-container">
        <button className="restart" onClick={() => window.location.reload()}>Restart Story</button>
      </div>
    </div>
  );
};

export default StoryGenerator;
