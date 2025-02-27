import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { useChat } from "@ai-sdk/react";
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

export function Main() {
  const [apiKey, setApiKey] = useState<string>("");

  // Custom API implementation for useChat
  const customFetch = useCallback(
    async (url: string, options: RequestInit) => {
      if (!apiKey) {
        console.log("API key not available in customFetch");
        throw new Error("API key not available");
      }

      // Extract messages from the request body
      const { messages } = JSON.parse(options.body as string);
      console.log("Messages sent to AI:", messages);

      try {
        console.log(
          "Starting streamText with API key:",
          apiKey ? "Available" : "Not available"
        );

        // Configure OpenAI with the API key
        const model = openai("gpt-3.5-turbo");

        // Create a stream using the AI SDK directly
        const result = streamText({
          model,
          system: "You are a helpful assistant.",
          messages,
        });

        console.log("Stream created successfully");

        // Convert the stream to a Response object that useChat can handle
        const response = result.toDataStreamResponse();
        console.log("Response created:", response);
        return response;
      } catch (error) {
        console.error("Error in customFetch:", error);
        throw error;
      }
    },
    [apiKey]
  );

  // Initialize useChat with our custom fetch implementation
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "/api/chat", // This is ignored but required by the type
      fetch: customFetch,
      onFinish: (message) => {
        console.log("Chat completed with message:", message);
      },
      onError: (error) => {
        console.error("Chat error:", error);
      },
      onResponse: (response) => {
        console.log(
          "Got response from AI:",
          response.status,
          response.statusText
        );
      },
    });

  // Log status changes
  useEffect(() => {
    console.log("Chat status changed:", status);
  }, [status]);

  // Log message updates
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Current messages:", messages);
      console.log("Latest message:", messages[messages.length - 1]);
    }
  }, [messages]);

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
  const latestResponse =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].content
      : "";

  return (
    <Box className={classes.box}>
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md" justify="center" align="center">
          <Title order={2}>LLM Response</Title>
          <Divider />
          <DisplayArea response={latestResponse} />
          <Divider />
          <Input
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          {error && <div>Error: {error.message}</div>}
          {status === "streaming" && <div>AI is thinking...</div>}
        </Stack>
      </Paper>
    </Box>
  );
}
