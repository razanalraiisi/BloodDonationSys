import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <img src={Logo} alt="Logo" className="landing-logo" />

        <h1 className="landing-title">Welcome to BloodLink Oman ❤️</h1>

        <p className="landing-subtitle">
          Connecting donors and recipients with ease.  
          Save lives with just a few clicks.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="landing-btn login-btn">
            Login
          </Link>

          <Link to="/register" className="landing-btn signup-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
