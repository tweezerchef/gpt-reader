import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";

// Add this type declaration at the top of your file
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, callback: (arg: any) => void) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}

function App() {
  const [message, setMessage] = useState("...loading");

  useEffect(() => {
    console.log("Window electron object:", window.electron); // Debug log

    // Fix: Use lowercase 'electron' to match your preload script
    if (window.electron && window.electron.ipcRenderer) {
      console.log("Setting up IPC listener"); // Debug log

      window.electron.ipcRenderer.on("message-from-main", (arg: string) => {
        console.log("Received message:", arg); // Debug log
        setMessage(arg);
      });

      // Send a message to main process to request initial data
      window.electron.ipcRenderer.send("request-initial-data");
    } else {
      console.error("Electron IPC not available"); // Debug log
      setMessage("Error: IPC not available");
    }
  }, []);

  return (
    <div>
      <h1>Starting Shit</h1>
      <p>Message from main process: {message}</p>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
