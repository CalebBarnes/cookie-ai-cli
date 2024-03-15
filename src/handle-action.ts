import { type Response } from "./ai-response-schema.js";
import { askQuestion } from "./utils/ask-question.js";
import { addItem } from "./commands/files.js";
import { handleCommand } from "./handle-command.js";
import { logger } from "./utils/logger.js";

function handleProcError(code: number | null, stderrOutput: string): void {
  console.log("HANDLE PROC ERROR HERE");
  console.log({ code });
  console.log({ stderrOutput });
}

export async function handleAction({
  response,
}: {
  response: Response;
  answer: "y" | "n";
}): Promise<{
  success: boolean;
  message?: string;
}> {
  switch (response.action) {
    case "command": {
      const result = await handleCommand(response, handleProcError);
      return result;
    }

    // case "command_list": {
    //   // await commandListAction(result, answer, handleProcError);
    // }

    // case "user_info_required": {
    //   await userInfoRequiredAction(result);
    // }

    // case "message_to_user": {
    //   logger.info(result.message);
    // }

    // case "request_file_access": {
    //   await requestFileAccessAction(result);
    // }

    default: {
      const unknownResponse = response as {
        action?: string;
      };
      return {
        success: false,
        message: `${unknownResponse.action ? `${unknownResponse.action} is not` : "You didn't use"} a supported action. Make sure you respond ONLY with JSON that satisfies the Response type.`,
        // error: {
        //   code: "unsupported_action",
        // },
      };
    }
  }
}

export async function requestFileAccessAction({
  files,
}: {
  files: string[];
}): Promise<void> {
  logger.info(`AI Requesting access to file(s)`);
  for (const file of files) {
    const answer = await askQuestion(
      `Do you want to allow access to ${file}? (y/n)`
    );
    if (answer === "y") {
      logger.info(`Access granted to ${file}`);
      await addItem([file]);
    }
  }
}

// export async function commandListAction(
//   {
//     commands,
//     description,
//   }: {
//     commands: string[];
//     description: string;
//   },
//   answer: "y" | "n",
//   handleProcError: (code: number | null, stderrOutput: string) => void
// ): Promise<void> {
//   for (const command of commands) {
//     await handleCommand({ command, description }, answer, handleProcError);
//   }
// }

// export async function userInfoRequiredAction(
//   result: UserInfoRequiredMessageContent
// ): Promise<void> {
//   const values = {} as Record<string, string>;
//   for (const item of result.values) {
//     const answer = await askQuestion(item.label);
//     values[item.value] = answer;
//   }

//   if (result.suggested_command_list) {
//     for (const command of result.suggested_command_list) {
//       await handleCommand({
//         command,
//         values,
//         description: result.description,
//       });
//     }
//   }
//   if (result.suggested_command) {
//     await handleCommand({
//       command: result.suggested_command,
//       values,
//       description: result.description,
//     });
//   }
// }
