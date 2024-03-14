import { Box, Text } from "ink";
import React from "react";
import { LoadingSpinner, ProgressBar } from "../loading-spinner.js";
import { type CommandMessageContent } from "../../ai-response-schema.js";
import { SelectArrow } from "../select-arrow.js";

export function SingleCommandPreview({
  prompt,
  command,
  description,
  isLoading = false,
  isError = false,
}: {
  prompt: string;
  isLoading?: boolean;
  isError?: boolean;
} & Partial<CommandMessageContent>): React.ReactNode {
  const estimatedWidth =
    Math.max(prompt.length, command?.length ?? 0, description?.length ?? 0) +
    10;

  return (
    <>
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
        {isLoading && <ProgressBar />}
      </Box>

      <Box>
        <Text color="cyan">{">"} </Text>
        <Text color="yellow">{command ?? <LoadingSpinner />}</Text>
      </Box>

      <Box
        width={estimatedWidth}
        borderStyle="round"
        paddingLeft={1}
        display="flex"
        flexShrink={1}
        flexDirection="column"
        minWidth={35}
      >
        <Box>
          <Text underline color="cyan">
            ℹ
          </Text>
          <Text color="white"> {description ?? <LoadingSpinner />}</Text>
        </Box>

        <Box>
          <Text color={isLoading ? "gray" : ""}>
            <SelectArrow isSelected={true} />
            Run this command? <Text color="gray">(y/n)</Text>
          </Text>
        </Box>
      </Box>
    </>
  );
}
