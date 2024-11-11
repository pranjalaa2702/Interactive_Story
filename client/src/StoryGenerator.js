import React, { useState, useEffect } from 'react';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [displayedStory, setDisplayedStory] = useState(''); // State to control typing effect
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = '58feLhKI08jwC34BKB6wHFFKx4fMb2m6'; // Replace with your actual API key

  // Function to generate a single story segment using the AI21 API with fetch
  const generateStorySegment = async (prompt) => {
    const apiUrl = 'https://api.ai21.com/studio/v1/chat/completions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'jamba-1.5-large',
          messages: [{ role: 'user', content: prompt }],
          documents: [],
          tools: [],
          n: 1,
          max_tokens: 4096,
          temperature: 0.7,
          top_p: 1,
          stop: [],
          response_format: { type: 'text' },
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI21 API error:', error);
      return '';
    }
  };

  // Function to handle the complete story generation
  const generateFullStory = async () => {
    setIsLoading(true);
    let fullStory = '';
    let currentPrompt = prompt;
    let storyComplete = false;

    while (!storyComplete) {
      const segment = await generateStorySegment(currentPrompt);
      fullStory += segment;

      if (isStoryComplete(segment)) {
        storyComplete = true;
      } else {
        currentPrompt = getNextPrompt(segment);
      }

      if (fullStory.length > 100000) {
        storyComplete = true;
      }
    }

    setStory(fullStory);
    setIsLoading(false);
  };

  // Helper function to determine if the story has reached its conclusion
  const isStoryComplete = (segment) => {
    return segment.includes('THE END');
  };

  // Helper function to generate the next prompt based on the previous segment
  const getNextPrompt = (lastSegment) => {
    return `Continue:
    Instructions:
    Check for Incomplete Scenes: Begin by checking if the last scene is incomplete or missing choices. If the last scene is incomplete or missing, complete it by providing a proper conclusion and choices...
    `;
  };

  // Typing effect with useEffect
  useEffect(() => {
    if (!story) return;

    let index = 0;
    setDisplayedStory(''); // Clear displayedStory when a new story is set

    const intervalId = setInterval(() => {
      setDisplayedStory((prev) => prev + story.charAt(index));
      index += 1;
      if (index === story.length) clearInterval(intervalId); // Stop typing at the end
    }, 50); // Adjust typing speed here (50ms per character)

    return () => clearInterval(intervalId); // Cleanup interval on component unmount or new story
  }, [story]);

  // Inline CSS styles
  const containerStyle = {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '2em',
    color: '#333',
    marginBottom: '20px',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '15px',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '1.1em',
    backgroundColor: '#5d4037',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonDisabledStyle = {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  };

  const buttonHoverStyle = {
    backgroundColor: '#5d4037',
  };

  const storySectionStyle = {
    marginTop: '20px',
  };

  const storyHeadingStyle = {
    fontSize: '1.5em',
    color: '#333',
    marginBottom: '10px',
  };

  const preStyle = {
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    padding: '20px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: "'Courier New', Courier, monospace",
    color: '#333',
    border: '1px solid #ddd',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Interactive Story Generator</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter the story prompt or character decision..."
        rows="4"
        cols="50"
        style={textareaStyle}
      />
      <br />
      <button
        onClick={generateFullStory}
        disabled={isLoading || !prompt}
        style={{
          ...buttonStyle,
          ...(isLoading || !prompt ? buttonDisabledStyle : {}),
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
      >
        {isLoading ? 'Generating...' : 'Generate Story'}
      </button>

      {/* Display the generated story with typing effect */}
      <div style={storySectionStyle}>
        <h2 style={storyHeadingStyle}>Generated Story:</h2>
        <pre style={preStyle}>{displayedStory}</pre>
      </div>
    </div>
  );
};

export default StoryGenerator;
