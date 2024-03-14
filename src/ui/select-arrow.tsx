import React from "react";
import { Text } from "ink";

export function SelectArrow({
  isSelected,
}: {
  isSelected: boolean;
}): React.ReactNode {
  return (
    <Text color={isSelected ? "green" : "black"}>
      {isSelected ? "➜ " : "  "}
    </Text>
  );
}
