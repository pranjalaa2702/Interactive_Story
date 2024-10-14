import React, { useState } from 'react';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState(''); // Initial prompt from user
  const [story, setStory] = useState(''); // Holds the generated story
  const [isLoading, setIsLoading] = useState(false); // Loading state to handle async operations
  const apiKey = '58feLhKI08jwC34BKB6wHFFKx4fMb2m6'; // Replace with your actual API key
  
  // Function to generate a single story segment using the AI21 API with fetch
  const generateStorySegment = async (prompt) => {
    const apiUrl = 'https://api.ai21.com/studio/v1/chat/completions'; // Correct API endpoint

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`, // Authorization header for API call
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": "jamba-1.5-large",
          "messages": [{"role": "user", "content": prompt}], // Using prompt for the story
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

      // Return the AI-generated text segment
      return data.choices[0].message.content; // Accessing the story content from the response
    } catch (error) {
      console.error('AI21 API error:', error);
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
      if (fullStory.length > 100000) {
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
    return `Continue from the last scene: ${lastSegment.slice(-100)} Remember: Each scene should have a description of the setting, characters, and the situation unfolding.
Provide at least two meaningful choices at the end of each scene. Each choice should lead to a subsequent scene with its own description and branching paths.
The scenes should stay true to the noir theme and should involve elements of mystery, danger, and moral ambiguity.
The story should be dynamic, and each choice should significantly alter the story’s trajectory, with multiple endings based on the decisions made by the player.
There must be 100 scenes in total. Nothing less`; // Use the last 50 characters as the continuation point
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
        <pre>{story}</pre>
      </div>
    </div>
  );
};

export default StoryGenerator;
