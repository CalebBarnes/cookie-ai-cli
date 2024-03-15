import React, { useState } from "react";
import { type Instance, render, Box, Text } from "ink";
import {
  type CommandMessageContent,
  type Response,
} from "../ai-response-schema.js";
import { CommandInput } from "./command-input.js";
import { SingleCommandPreview } from "./actions/single-command.js";
import { ProgressBar } from "./loading-spinner.js";

export interface CommandPreviewProps {
  onSubmitPrompt?: (msg: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  prompt?: string;
  isLoading?: boolean;
  isError?: boolean;
  response?: Partial<Response>;
}

export function renderCommandPreview(
  props: CommandPreviewProps,
  response?: Partial<Response>
): Instance {
  return render(<CommandPreview {...props} response={response} />);
}

export function CommandPreview({
  onConfirm,
  onCancel,
  onSubmitPrompt,
  prompt,
  response,
  isLoading,
  isError,
}: CommandPreviewProps): React.ReactNode {
  const [userPrompt, setUserPrompt] = useState<string | undefined>(prompt);

  return (
    <>
      {userPrompt ? (
        <>
          <Box>
            <Text color="cyan">* </Text>
            <Text color="white">{userPrompt} </Text>
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
          <CommandAction
            prompt={userPrompt}
            response={response}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </>
      ) : (
        <CommandInput
          onSubmit={(msg) => {
            onSubmitPrompt?.(msg);
            setUserPrompt(msg);
          }}
        />
      )}
    </>
  );
}

function CommandAction({
  prompt,
  response,
  onConfirm,
  onCancel,
}: {
  prompt: string;
  response?: Partial<Response>;
  onConfirm?: () => void;
  onCancel?: () => void;
}): React.ReactNode {
  switch (response?.action) {
    case "command":
      return (
        <SingleCommandPreview
          onConfirm={onConfirm}
          onCancel={onCancel}
          prompt={prompt}
          response={response as Partial<CommandMessageContent>}
        />
      );
    // case "command_list":
    //   return <CommandListPreview action={action} {...rest} />;

    default:
      return null;
  }
}
