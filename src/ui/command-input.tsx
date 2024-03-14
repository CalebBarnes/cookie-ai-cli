import React from "react";
import { Box, Text } from "ink";
import { TextInput } from "@inkjs/ui";
import { SelectArrow } from "./select-arrow.js";

interface CommandInputProps {
  onSubmit?: (input: string) => void;
}

export function CommandInput({ onSubmit }: CommandInputProps): React.ReactNode {
  return (
    <Box>
      <Text>
        <SelectArrow isSelected={true} />
        <TextInput placeholder="What do you want to do?" onSubmit={onSubmit} />
      </Text>
    </Box>
  );
}
