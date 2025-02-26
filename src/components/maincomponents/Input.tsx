import React from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import sendIcon from "../../icons/pngegg.png";

export function Input({
  setInput,
  input,
}: {
  setInput: (input: string) => void;
  input: string;
}) {
  return (
    <TextInput
      value={input}
      onChange={(e) => setInput(e.target.value)}
      rightSection={
        <ActionIcon>
          <img
            src={sendIcon}
            alt="send"
            style={{ width: "100%", height: "100%" }}
          />
        </ActionIcon>
      }
    />
  );
}
