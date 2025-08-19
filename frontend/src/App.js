import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import JoinRoom from "./components/RoomJoin";
import Dashboard from "./components/Dashboard";
import CodeRoom from "./components/CodeRoom";
// import VoiceBot from "./components/Voicebot";
import Footer from "./components/Footer"; // ✅ Import Footer

function App() {
  return (
    <Router>
      {/* VoiceBot floating widget */}
      

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join" element={<JoinRoom />} />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
              <Footer />   {/* ✅ Footer added here */}
            </>
          }
        />

        <Route
          path="/code/:roomId"
          element={
            <>
              <Navbar />
              <CodeRoom />
              <Footer />   {/* ✅ Footer added here */}
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
