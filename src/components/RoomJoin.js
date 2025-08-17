import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/RoomJoin.css";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleEnter = (e) => {
    e.preventDefault();
    if (!name || !roomId) {
      alert("Enter both name and room ID");
      return;
    }
    localStorage.setItem("playerName", name);
    localStorage.setItem("roomId", roomId);
    navigate("/dashboard");
  };

  return (
    <div className="room-join-container">
      <h1>Join a Room</h1>
      <form onSubmit={handleEnter} className="room-join-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default JoinRoom;
