import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App'; // Import your main App component
import './index.css'; // Optional: your CSS file

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
