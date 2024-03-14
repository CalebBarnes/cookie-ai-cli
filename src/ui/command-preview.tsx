import React, { useState } from "react";
import { type Instance, render } from "ink";
import {
  type CommandMessageContent,
  // type CommandMessageContent,
  type Response,
} from "../ai-response-schema.js";
// import { LoadingSpinner, ProgressBar } from "./loading-spinner.js";
// import { SelectArrow } from "./select-arrow.js";
import { CommandInput } from "./command-input.js";
import { SingleCommandPreview } from "./actions/single-command.js";
// import { SingleCommand } from "./actions/single-command.js";

export interface CommandPreviewProps {
  prompt?: string;
  isLoading?: boolean;
  isError?: boolean;
}
export function CommandPreview({
  prompt,
  action,
}: CommandPreviewProps & Partial<Response>): React.ReactNode {
  const [userPrompt, setUserPrompt] = useState<string>(prompt ?? "");

  return (
    <>
      {userPrompt ? (
        <CommandAction prompt={userPrompt} action={action} />
      ) : (
        <CommandInput
          onSubmit={(msg) => {
            setUserPrompt(msg);
          }}
        />
      )}
    </>
  );
}

function CommandAction({
  action,
  prompt,
  ...rest
}: { prompt: string } & Response): React.ReactNode {
  switch (action) {
    case "command":
      return (
        <SingleCommandPreview
          prompt={prompt}
          {...(rest as CommandMessageContent)}
        />
      );
    // case "command_list":
    //   return <CommandListPreview action={action} {...rest} />;

    default:
      return null;
  }
}

// function CommandListPreview({
//   prompt,
//   isLoading,
//   isError,
// }: CommandPreviewProps): React.ReactNode {
//   return (
//     <Box>
//       <Text color="cyan">* </Text>
//       <Text color="white">{prompt} </Text>
//       {!isLoading && !isError && (
//         <Text>
//           <Text color="green">✔</Text>
//         </Text>
//       )}
//       {isError && !isLoading && (
//         <Text>
//           <Text color="red">✘</Text>
//         </Text>
//       )}
//       {isLoading && <LoadingSpinner />}
//     </Box>
//   );
// }

export function renderCommandPreview(props: CommandPreviewProps): Instance {
  return render(<CommandPreview {...props} />);
}
