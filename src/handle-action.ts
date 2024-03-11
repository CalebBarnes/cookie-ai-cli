import {
  type UserInfoRequiredMessageContent,
  type Response,
} from "./ai-response-schema.js";
import { askQuestion } from "./utils/ask-question.js";
import { addItem } from "./commands/files.js";
import { handleCommand } from "./handle-command.js";
import { logger } from "./utils/logger.js";

function handleProcError(code: number | null, stderrOutput: string): void {
  console.log("HANDLE PROC ERROR HERE");
  console.log({ code });
  console.log({ stderrOutput });
}

export async function handleAction({ result }: { result: Response }): Promise<{
  success: boolean;
  filesLoaded?: boolean;
  error?: {
    code: string;
    message: string;
  };
}> {
  switch (result.action) {
    case "command": {
      await handleCommand(result, handleProcError);
      return { success: true };
    }

    case "command_list": {
      await commandListAction(result);
      return { success: true };
    }

    case "user_info_required": {
      await userInfoRequiredAction(result);
      return { success: true };
    }

    case "message_to_user": {
      logger.info(result.message);
      return { success: true };
    }

    case "request_file_access": {
      await requestFileAccessAction(result);
      return { success: true, filesLoaded: true };
    }

    default: {
      const unknownResult = result as {
        action?: string;
      };
      return {
        success: false,
        error: {
          code: "unsupported_action",
          message: `${unknownResult.action ? `${unknownResult.action} is not` : "You didn't use"} a supported action. Make sure you respond ONLY with JSON that satisfies the Response type.`,
        },
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

export async function commandListAction({
  commands,
  description,
}: {
  commands: string[];
  description: string;
}): Promise<void> {
  for (const command of commands) {
    await handleCommand({ command, description });
  }
}

export async function userInfoRequiredAction(
  result: UserInfoRequiredMessageContent
): Promise<void> {
  const values = {} as Record<string, string>;
  for (const item of result.values) {
    const answer = await askQuestion(item.label);
    values[item.value] = answer;
  }

  if (result.suggested_command_list) {
    for (const command of result.suggested_command_list) {
      await handleCommand({
        command,
        values,
        description: result.description,
      });
    }
  }
  if (result.suggested_command) {
    await handleCommand({
      command: result.suggested_command,
      values,
      description: result.description,
    });
  }
}
