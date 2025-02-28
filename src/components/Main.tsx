import { streamText } from "ai";

import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Stack,
  Title,
  Text,
  Card,
  ScrollArea,
  Divider,
  Box,
} from "@mantine/core";

import classes from "./CSS/Main.module.css";
import { DisplayArea } from "./maincomponents/DisplayArea";
import { Input } from "./maincomponents/Input";
import { openai } from "@ai-sdk/openai";
import AiTest from "./maincomponents/AiTest";
export function Main() {
  const [apiKey, setApiKey] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  // Custom API implementation for useChat

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer
        .invoke("get-openai-api-key")
        .then((key: string) => {
          setApiKey(key);
          console.log(
            "API key retrieved:",
            key ? "Available" : "Not available"
          );
        })
        .catch((error) => {
          console.error("Error retrieving API key:", error);
        });
    }
  }, []);

  // Get the latest assistant response for the DisplayArea
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    // Clear previous response and set loading state
    setLatestResponse("");
    setStatus("loading");
    setError(null);

    try {
      console.log("Submitting input:", input);

      // Create the stream
      const response = streamText({
        model: openai("gpt-4o-mini"),
        messages: [{ role: "user", content: input }],
      });

      console.log("Stream created:", response);

      // Try accessing the text directly first
      try {
        const fullText = await response.text;
        console.log("Full text received:", fullText);
        setLatestResponse(fullText);
      } catch (textError) {
        console.error("Error getting full text:", textError);

        // Fall back to streaming if direct text access fails
        try {
          console.log("Attempting to read from textStream...");
          for await (const delta of response.textStream) {
            console.log("Received delta:", delta);
            setLatestResponse((prev) => prev + delta);
          }
        } catch (streamError) {
          console.error("Error reading from textStream:", streamError);
          throw streamError;
        }
      }

      setStatus("idle");
    } catch (err) {
      console.error("Error in API call:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus("error");
    }
  };

  return (
    <Box className={classes.box}>
      <Paper p="md" shadow="sm" radius="md" withBorder>
        {/* <Stack gap="md" justify="center" align="center">
          <Title order={2}>LLM Response</Title>
          <Divider />
          <DisplayArea response={latestResponse} />
          <Divider />
          <Input
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </Stack> */}
        <AiTest />
      </Paper>
    </Box>
  );
}
