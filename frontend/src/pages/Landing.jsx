import React from 'react';
import './LandingPage.css'; // Import the CSS for the landing page styles

const Landing= () => {
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <h1 className="title">Welcome to Our Social Platform</h1>
        <p className="subtitle">Connect, interact, and grow your network with ease.</p>
        <a href="/signup" className="cta-button">Get Started</a>
      </header>

      {/* About Section */}
      <section className="about-section">
        <h2>About the Application</h2>
        <p>
          Our platform is designed to help you easily connect with friends, discover new people, and expand your network.
          Whether you're looking to engage with people who share common interests or build lasting friendships, this is the place to be.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Search for Users</h3>
            <p>Quickly find users by name, hobby, or interests to connect and build friendships.</p>
          </div>
          <div className="feature">
            <h3>Send Friend Requests</h3>
            <p>Send friend requests to users and wait for their approval to connect.</p>
          </div>
          <div className="feature">
            <h3>Friend Recommendations</h3>
            <p>Get recommendations for friends based on mutual connections and shared interests.</p>
          </div>
          <div className="feature">
            <h3>Manage Your Profile</h3>
            <p>Update your profile, manage your connections, and view your friends list at any time.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join us today and start connecting with people!</p>
        <a href="/login" className="cta-button">Sign Up Now</a>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Social Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
