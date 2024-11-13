import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import love from './love.jfif.jpg';
import king from './king.jpg';
import bg from './homepage_pic.jpg';
import det from './detective_pic1.jpg';

const Dashboard = ({ onLogout }) => {
  const [userStories, setUserStories] = useState([]);

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('userStories')) || [];
    setUserStories(savedStories);
  }, []);

  return (
    <div>
      {/* Header Section */}
      <header>
        <nav>
          <div className="logo">
            <h1>Tell Me Why</h1>
          </div>
          <ul className="nav-links">
            <li><a href="#stories">Stories</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${bg})` }}>
        <div className="hero-content">
          <h2>Choose Your Story, Shape Your Destiny</h2>
          <p>Experience immersive, interactive stories where your decisions change everything.</p>
          <Link to="/generate-story">
            <button className="cta-btn">Start Your Adventure</button>
          </Link>
        </div>
      </section>

      {/* Story Highlights Section */}
      <section id="stories" className="story-highlights">
        <h2>Featured Stories</h2>
        <div className="stories-grid">
          <div className="story-card">
            <img src={king} alt="Story 1" />
            <h3>The Lost Kingdom</h3>
            <p>An ancient kingdom lost in time... Will you restore its glory or let it fall into ruins?</p>
            <Link to="/story/1">
              <button className="read-more-btn">Play Now</button>
            </Link>
          </div>

          <div className="story-card">
            <img src={love} alt="Story 2" />
            <h3>Love in the Shadows</h3>
            <p>A romance entwined with secrets and danger. How far will you go for love?</p>
            <Link to="/story/2">
              <button className="read-more-btn">Play Now</button>
            </Link>
          </div>

          <div className="story-card">
            <img src={det} alt="Story 3" />
            <h3>Whispers of the Past</h3>
            <p>A gripping mystery. Can you uncover the truth before the past catches up with you?</p>
            <Link to="/story/3">
              <button className="read-more-btn">Play Now</button>
            </Link>
          </div>

          {/* User-Created Stories */}
          {userStories.map((story) => (
            <div className="story-card" key={story.id}>
              <h3>{story.name}</h3>
              <p>Custom story created by you.</p>
              <Link to={`/story/${story.id}`}>
                <button className="read-more-btn">Play Now</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-us">
        <h2>About Us</h2>
        <p>"Tell Me Why" is an interactive storytelling platform that brings your decisions to life. Every choice you make changes the narrative, leading to countless possibilities. Explore our library of stories and create your own adventure.</p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-us">
        <h2>Contact Us</h2>
        <p>For suggestions and queries, contact:</p>
        <p><strong>Pranjalaa Rai</strong>, <strong>Pranav Rajesh</strong>, and <strong>Roshni Ramesh</strong></p>
        <p>Email: <a href="mailto:metamorphosisrestaurant365@gmail.com">metamorphosisrestaurant365@gmail.com</a></p>
      </section>

      {/* Footer Section */}
      <footer>
        <p>© 2024 Tell Me Why. All Rights Reserved.</p>
        <ul className="footer-links">
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default Dashboard;
