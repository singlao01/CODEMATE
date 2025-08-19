import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../css/Dashboard.css";

const socket = io("http://localhost:5000"); // Connect to your backend

function Dashboard() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName");
  const roomId = localStorage.getItem("roomId");

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Join the room
    socket.emit("joinRoom", { roomId, playerName });

    // Update players list in real-time
    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Cleanup on unmount
    return () => {
      socket.off("updatePlayers");
    };
  }, [roomId, playerName]);

  // 🎤 Voice feature (commented out)
  /*
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(`Welcome ${playerName} to room ${roomId}`);
      window.speechSynthesis.speak(msg);
    }
  }, [playerName, roomId]);
  */

  return (
    <div className="dashboard-container">
      <h1>Welcome, {playerName}</h1>
      <h3>Room ID: {roomId}</h3>

      <div className="live-players">
        <h2>Players Online</h2>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              <span className="player-dot" /> {p.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="fancy-stats">
        <h2>Live Activity</h2>
        <p>Connected: {players.length} players</p>
        <div className="activity-bar">
          {players.map((_, idx) => (
            <div key={idx} className="activity-dot" />
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate(`/code/${roomId}`)}
        className="enter-code-room"
      >
        Enter Code Room
      </button>
    </div>
  );
}

export default Dashboard;
