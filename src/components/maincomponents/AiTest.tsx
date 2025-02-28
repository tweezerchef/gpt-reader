import React, { useState, useEffect } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get API key on component mount
  useEffect(() => {
    async function getApiKey() {
      if (window.electron) {
        try {
          const key = await window.electron.ipcRenderer.invoke(
            "get-openai-api-key"
          );
          setApiKey(key);
          console.log(
            "API key retrieved:",
            key ? "Available" : "Not available"
          );
        } catch (error) {
          console.error("Error retrieving API key:", error);
        }
      }
    }
    getApiKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey) {
      console.error("No API key available");
      return;
    }

    // Add user message to UI
    const userMessage = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Call OpenAI through our main process proxy
      const response = await window.electron.ipcRenderer.invoke(
        "call-openai-api",
        {
          messages: [{ role: "user", content: input }],
          model: "gpt-4-turbo",
        }
      );

      console.log("Response from OpenAI:", response);

      // Extract the assistant's message
      if (response.choices && response.choices.length > 0) {
        const assistantMessage = {
          id: Date.now(),
          role: "assistant",
          content: response.choices[0].message.content,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      {isLoading && <div>Loading response...</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt"
          disabled={isLoading}
        />
        <button type="submit" disabled={!apiKey || isLoading}>
          Submit
        </button>
      </form>
    </>
  );
}
