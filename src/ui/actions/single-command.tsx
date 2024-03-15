import { Box, Text } from "ink";
import React from "react";
import { ConfirmInput } from "@inkjs/ui";
import { LoadingSpinner } from "../loading-spinner.js";
import { type CommandMessageContent } from "../../ai-response-schema.js";
import { SelectArrow } from "../select-arrow.js";

export function SingleCommandPreview({
  onConfirm,
  onCancel,
  prompt,
  isLoading = false,
  // isError = false,
  response,
}: {
  onConfirm?: () => void;
  onCancel?: () => void;
  prompt: string;
  isLoading?: boolean;
  isError?: boolean;
  response?: Partial<CommandMessageContent>;
}): React.ReactNode {
  const estimatedWidth =
    Math.max(
      prompt.length,
      response?.command?.length ?? 0,
      response?.description?.length ?? 0
    ) + 10;

  return (
    <>
      <Box>
        <Text color="cyan">{">"} </Text>
        <Text color="yellow">{response?.command ?? <LoadingSpinner />}</Text>
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
          <Text color="white">
            {" "}
            {response?.description ?? <LoadingSpinner />}
          </Text>
        </Box>

        <Box>
          <Text color={isLoading ? "gray" : ""}>
            <SelectArrow isSelected={true} />
            Run this command?{" "}
            <ConfirmInput
              onConfirm={() => {
                onConfirm?.();
              }}
              onCancel={() => {
                onCancel?.();
              }}
            />
          </Text>
        </Box>
      </Box>
    </>
  );
}
