import {
  type UserInfoRequiredMessageContent,
  type Response,
} from "./ai-response-schema";
import { askQuestion } from "./ask-question";
import { handleCommand } from "./handle-command.js";

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

export async function handleAction({ result }: { result: Response }): Promise<{
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}> {
  switch (result.action) {
    case "command": {
      await handleCommand(result);
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
