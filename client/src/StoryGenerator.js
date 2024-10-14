import React, { useState } from 'react';
import axios from 'axios';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState(''); // Initial prompt from user
  const [story, setStory] = useState(''); // Holds the generated story
  const [isLoading, setIsLoading] = useState(false); // Loading state to handle async operations
  const apiKey = 'Fwe0MgNNnEODngzvHb1lIxCgSQkorBP2';
  
  // Function to generate a single story segment using the AI21 API
  const generateStorySegment = async (prompt) => {
    const apiUrl = 'https://api.ai21.com/studio/v1/j2-large/complete'; // Correct API endpoint

    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: prompt, // Directly include the prompt
          maxTokens: 300, // Correct maxTokens syntax
          temperature: 0.7, // Creative freedom in responses
          stopSequences: ["THE END"] // Stop generation on "THE END"
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Authorization header for API call
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Return the AI-generated text segment
      return response.data.completions[0].data.text; // Correct response format
    } catch (error) {
      console.error('AI21 API error:', error.response ? error.response.data : error.message);
      return ''; // In case of error, return an empty string
    }
  };

  // Function to handle the complete story generation
  const generateFullStory = async () => {
    setIsLoading(true);
    let fullStory = '';
    let currentPrompt = prompt;
    let storyComplete = false;

    // Loop to keep generating story segments until the story ends
    while (!storyComplete) {
      const segment = await generateStorySegment(currentPrompt);
      fullStory += segment;

      // Check if the current segment signals the end of the story
      if (isStoryComplete(segment)) {
        storyComplete = true;
      } else {
        // Generate the next prompt for story continuation
        currentPrompt = getNextPrompt(segment);
      }

      // Optional safeguard: Prevent overly long stories
      if (fullStory.length > 5000) {
        storyComplete = true;
      }
    }

    setStory(fullStory); // Set the final full story
    setIsLoading(false); // Disable loading state
  };

  // Helper function to determine if the story has reached its conclusion
  const isStoryComplete = (segment) => {
    return segment.includes('THE END'); // Example check: End the story if "THE END" is found
  };

  // Helper function to generate the next prompt based on the previous segment
  const getNextPrompt = (lastSegment) => {
    return `Continue the story: ${lastSegment.slice(-50)}`; // Use the last 50 characters as the continuation point
  };

  // Render the UI for the interactive story generator
  return (
    <div>
      <h1>Interactive Story Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter the story prompt or character decision..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={generateFullStory} disabled={isLoading || !prompt}>
        {isLoading ? 'Generating...' : 'Generate Story'}
      </button>

      {/* Display the generated story */}
      <div>
        <h2>Generated Story:</h2>
        <p>{story}</p>
      </div>
    </div>
  );
};

export default StoryGenerator;
