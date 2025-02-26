import React, { useState, useEffect } from "react";
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
  const [response, setResponse] = useState<Response | null>(null);
  const [input, setInput] = useState<string>("");
  useEffect(() => {
    console.log(input);
  }, [input]);
  const sampleResponse = {
    text: "This is a sample response from the LLM. It can contain **markdown** and `code blocks` as well as regular text.",
    metadata: {
      model: "Claude 3.7 Sonnet",
      promptTokens: 245,
      completionTokens: 512,
      totalTokens: 757,
      latency: "1.2s",
    },
  };
  return (
    <Box className={classes.box}>
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md" justify="center" align="center">
          <Title order={2}> LLM Response</Title>
          <Divider />
          <DisplayArea response={sampleResponse} />
          <Divider />
          <Input setInput={setInput} input={input} />
        </Stack>
      </Paper>
    </Box>
  );
}
