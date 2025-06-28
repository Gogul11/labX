import React from "react";
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <div className="logo">
        <div className="logo-dot" />
        <span className="logo-text">labX</span>
      </div>

      <div className="button-group">
        <button className="btn host-btn">Host</button>
        <button className="btn join-btn">Join</button>
      </div>
      <p className="subtitle">Your interactive, cross-platform IDE built for speed and simplicity.</p>
      <footer className="footer">
      <p>LabX v1.0.0 &mdash; Built with ❤️</p>
      </footer>

    </div>
  );
};

export default HomePage;
