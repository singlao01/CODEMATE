import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import JoinRoom from "./components/RoomJoin";
import Dashboard from "./components/Dashboard";
import CodeRoom from "./components/CodeRoom";
import VoiceBot from "./components/Voicebot";

function App() {
  return (
    <Router>
      {/* VoiceBot floating widget */}
      <VoiceBot />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/code/:roomId"
          element={
            <>
              <Navbar />
              <CodeRoom />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
