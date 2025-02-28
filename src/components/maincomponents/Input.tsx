import React from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import sendIcon from "../../icons/pngegg.png";

export function Input({
  value,
  onChange,
  onSubmit,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onSubmit: () => void;
}) {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      rightSection={
        <ActionIcon onClick={onSubmit}>
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
