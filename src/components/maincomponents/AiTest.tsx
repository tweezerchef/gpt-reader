import React, { useState } from "react";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add User's message to the UI
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: input },
    ]);

    // Stream the text
    const response = await streamText({
      model: openai("gpt-4-turbo"),
      system: "You are a helpful assistant.",
      messages: [{ role: "user", content: input }],
    });

    console.log("response object:", response); // Debug the entire response

    let streamedContent = "";

    // Debugging each chunk
    for await (const chunk of response.textStream) {
      console.log("Received chunk:", chunk); // Will show partial text in console
      streamedContent += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        // If the last message is not from the AI, create a new AI message
        if (updated[lastIndex]?.role !== "assistant") {
          updated.push({
            id: Date.now(),
            role: "assistant",
            content: chunk,
          });
        } else {
          // Otherwise, update the existing AI message content
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: streamedContent,
          };
        }

        return updated;
      });
    }

    const fullText = await response.text;
    console.log("Full text returned:", fullText);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "assistant", content: fullText },
    ]);

    setInput("");
  };

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
