import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/RoomJoin.css";
import axios from "axios";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnter = async (e) => {
    e.preventDefault();

    if (!name || !roomId) {
      alert("⚠️ Enter both name and room ID");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/rooms/join", {
        playerName: name,
        roomId: roomId,
      });

      console.log("✅ Room joined:", res.data);

      // Save locally
      localStorage.setItem("playerName", name);
      localStorage.setItem("roomId", roomId);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Join failed:", err.response?.data || err.message);
      alert(
        `Error: ${
          err.response?.data?.error || "Failed to connect to backend"
        }`
      );
    } finally {
      setLoading(false);
    }
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
        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
