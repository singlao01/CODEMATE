import React, { useState, useRef } from "react";
import "../css/VoiceBot.css";

function VoiceBot({ onTranscribe }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const toggleBot = () => setOpen(!open);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported!");

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        if (onTranscribe) onTranscribe(text);
      };

      recognitionRef.current.onerror = (e) => console.error(e.error);
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <>
      <div className={`voice-bot ${open ? "open" : ""}`}>
        <div className="bot-header">
          <h4>Voice Assistant</h4>
          <button onClick={toggleBot}>{open ? "×" : "🎤"}</button>
        </div>
        {open && (
          <div className="bot-body">
            <p>{transcript || "Say something..."}</p>
            <button onClick={toggleListening}>
              {listening ? "Stop Listening" : "Start Listening"}
            </button>
          </div>
        )}
      </div>

      {/* Floating button when closed */}
      {!open && (
        <button className="bot-toggle" onClick={toggleBot}>
          🎤
        </button>
      )}
    </>
  );
}

export default VoiceBot;
