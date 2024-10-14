import axios from 'axios';

const generateChatResponse = async (userMessage) => {
  const apiKey = process.env.REACT_APP_API_KEY; // Make sure your API key is in an environment variable
  const apiUrl = 'https://api.ai21.com/v1/chat/completions';

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "jamba-1.5-large",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 300,
        temperature: 0.7,
        stop: ["\n"]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI21 API error:', error.response ? error.response.data : error.message);
    return 'An error occurred while generating the response.';
  }
};

export default generateChatResponse;
