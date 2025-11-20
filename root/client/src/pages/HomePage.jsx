import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-hero">
        <h1 className="homepage-title">Welcome to RendezVue</h1>
        <p className="homepage-subtitle">Find people with the same hobbies as you!</p>
        <p className="homepage-description">
          Connect with hobby enthusiasts, discover new interests, and create meaningful connections 
          through shared passions. Whether you're into dancing, cooking, hiking, or anything in between, 
          RendezVue helps you find your perfect match.
        </p>
        <div className="homepage-cta">
          <Link to="/register" className="cta-button primary">
            Get Started
          </Link>
          <Link to="/explore" className="cta-button secondary">
            Explore Hobbies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
