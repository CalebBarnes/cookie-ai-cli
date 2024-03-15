import { Box, Text } from "ink";
import React from "react";
import { type CommandPreviewProps } from "../command-preview.js";
import { LoadingSpinner } from "../loading-spinner.js";

export function CommandListPreview({
  prompt,
  isLoading,
  isError,
}: CommandPreviewProps): React.ReactNode {
  return (
    <Box>
      <Text color="cyan">* </Text>
      <Text color="white">{prompt} </Text>
      {!isLoading && !isError && (
        <Text>
          <Text color="green">✔</Text>
        </Text>
      )}
      {isError && !isLoading && (
        <Text>
          <Text color="red">✘</Text>
        </Text>
      )}
      {isLoading && <LoadingSpinner />}
    </Box>
  );
}
