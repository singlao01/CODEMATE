import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import "../css/CodeRoom.css";

const socket = io("http://localhost:5000"); // Backend server

function CodeRoom() {
  const { roomId } = useParams();
  const playerName = localStorage.getItem("playerName");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [players, setPlayers] = useState([]);
  const [output, setOutput] = useState("");
  // const [listening, setListening] = useState(false);  // 🔇 Commented out
  // const recognitionRef = useRef(null);                // 🔇 Commented out

  // Predefined templates (editable)
  const templates = {
    javascript: `// JavaScript Template
function main() {
  console.log("Hello World");
}

main();`,
    python: `# Python Template
def main():
    print("Hello World")

if __name__ == "__main__":
    main()`,
    cpp: `// C++ Template
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
    java: `// Java Template
class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  };

  // Load initial code for the language
  useEffect(() => {
    setCode(templates[language]);
  }, [language]);

  // Socket.IO setup
  useEffect(() => {
    socket.emit("joinRoom", { roomId, playerName });

    socket.on("initialData", ({ code, players }) => {
      if (code) setCode(code);
      setPlayers(players);
    });

    socket.on("updateCode", (newCode) => setCode(newCode));
    socket.on("updatePlayers", (players) => setPlayers(players));

    /* 🔇 Commented out Speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCode((prev) => {
          const newCode = prev + transcript;
          socket.emit("codeChange", { roomId, code: newCode });
          return newCode;
        });
      };
    }
    */

    return () => {
      socket.off("initialData");
      socket.off("updateCode");
      socket.off("updatePlayers");
      // if (recognitionRef.current) recognitionRef.current.stop(); // 🔇 Commented out
    };
  }, [roomId, playerName]);

  /* 🔇 Commented out toggleListening
  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported!");
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };
  */

  const runCode = () => {
    if (language === "javascript") {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(code);
        setOutput(result?.toString() || "Executed successfully");
      } catch (err) {
        setOutput(err.message);
      }
    } else {
      setOutput(`Running ${language} code requires server-side execution.`);
    }
  };

  return (
    <div className="code-room-main">
      {/* Left Panel */}
      <div className="problem-panel">
        <h2>Room ID: {roomId}</h2>
        <h3>Players:</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>

        {/* 🔇 Commented out voice transcription button */}
        {/* <button onClick={toggleListening}>
          {listening ? "Stop Transcription" : "Start Transcription"}
        </button> */}

        <button onClick={runCode} style={{ marginTop: "10px" }}>
          Run Code
        </button>
        <div className="output">
          <h4>Output:</h4>
          <pre>{output}</pre>
        </div>
      </div>

      {/* Right Panel */}
      <div className="editor-panel">
        <div className="editor-header">
          <label>
            Language:{" "}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </label>
        </div>
        <Editor
          height="90vh"
          language={language}
          value={code}
          onChange={(value) => {
            setCode(value);
            socket.emit("codeChange", { roomId, code: value });
          }}
          theme="vs-dark"
          options={{
            fontSize: 16,
            automaticLayout: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}

export default CodeRoom;
