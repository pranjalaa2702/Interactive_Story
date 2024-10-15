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
    return `Continue:
Instructions:
Check for Incomplete Scenes: Begin by checking if the last scene is incomplete or missing choices. If the last scene is incomplete or missing, complete it by providing a proper conclusion and choices.Follow the same formatting style as previous scenes(js). check the last scene (starts with "id"). If it has no "choices", redo from that "id".
The scenes until now are: ${lastSegment}
Format: Follow this structure for each scene in JavaScript:
Scene ID: Each scene should have a unique ID, starting where the last scene left off (e.g., if the last complete scene is 53, continue with 54). If the last scene is incomplete, continue from the last scene (e.g. if the last incomplete scene is 53, coontinue from 54).
Perspective: Either 'Detective,' 'Vera Steele,' or 'Alex.'
Scene Description: Write the text inside backticks. This should be a detailed description of the setting, the characters, and the situation unfolding.
Choices: End each scene with at least two meaningful choices that lead to different subsequent scenes, each with its own unique ID. Make sure the text for each choice and the next node is also inside backticks.
Complete Story: Ensure the story progresses smoothly, completing any unfinished scenes from previous iterations and creating new scenes with consistent branching paths. Continue generating scenes in sequence and make sure to complete the story within a 100 scenes and no more.No IDs should go beyond 100.
End the Story: The story must end at 'id': '100'. Nextnode can't exceed '100'. When you reach 'id': '100', make sure to conclude the story with a final resolution and print THE END.

Example Format for Each Scene:
{
    "id": "54",
    "perspective": "Detective",
    "text": "The alley behind the warehouse is eerily quiet. You’ve followed the tip about Vera Steele’s secret meeting place, but now doubt is creeping in. A single light flickers above the door, casting strange shadows in the mist. Something feels wrong.",
    "choices": [
      {
        "option": "Enter the building through the back door",
        "nextNode": "55"
      },
      {
        "option": "Wait outside and observe",
        "nextNode": "56"
      }
    ]
}`; 
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
