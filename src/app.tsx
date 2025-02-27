import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import "@mantine/core/styles.css";
import { MantineProvider, Center } from "@mantine/core";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import classes from "./CSS/app.module.css";
import "@mantine/code-highlight/styles.css";
// Add this type declaration at the top of your file
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, callback: (arg: any) => void) => void;
        send: (channel: string, ...args: any[]) => void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

function App() {
  return (
    <MantineProvider>
      <main className="app-container">
        <Center className={classes.center}>
          <Header />
          <Main />
        </Center>
      </main>
    </MantineProvider>
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
