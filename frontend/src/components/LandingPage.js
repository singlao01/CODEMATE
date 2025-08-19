import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to CodeMate</h1>
      <p>Collaborate in real-time with voice support!</p>
      <button onClick={() => navigate("/join")}>Enter</button>
    </div>
  );
};

export default LandingPage;
