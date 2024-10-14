// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>Please choose an option:</p>
      <div>
        <Link to="/generate-story">
          <button>Generate Story</button>
        </Link>
        <Link to={`/story/start`}>
          <button>Play Story</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
