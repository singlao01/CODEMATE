import React, { useState } from "react";
import "../css/LiveBackground.css";

const LiveBackground = () => {
  const [showVoice, setShowVoice] = useState(false);

  const handleVoicePopup = () => {
    setShowVoice(!showVoice);
  };

  return (
    <div className="live-bg">
      <button className="voice-btn" onClick={handleVoicePopup}>
        🎤 Voice Support
      </button>

      {showVoice && (
        <div className="voice-popup">
          <h2>Voice Support Active</h2>
          <p>Speak now and interact in real-time!</p>
          <button onClick={handleVoicePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LiveBackground;
