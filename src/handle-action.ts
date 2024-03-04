import { askQuestion } from "./ask-question.js";
import { handleCommand } from "./handle-command.js";
import { sendChat } from "./send-chat.js";
import { promptUser } from "./prompt-user.js";
import { colors } from "./utils/colors.js";
import { Response } from "./ai-response-schema.js";

export async function handleAction({ result }: { result: Response }) {
  if (result.action === "command") {
    await handleCommand({
      command: result.command,
      description: result.description,
    });
  } else if (result.action === "command_list") {
    for (const command of result.commands) {
      await handleCommand({
        command,
        description: result.description,
      });
    }
  } else if (result.action === "user_info_required") {
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
  } else {
    console.log(
      `${colors.red}AI tried to use an unsupported action, telling AI to retry: ${colors.reset}`,
      // @ts-ignore -- handle unsupported action
      result.action
    );
    await sendChat({
      // @ts-ignore -- handle unsupported action
      message: `${result.action} is not a supported action. Make sure you respond only with JSON that satisfies the Response type.`,
    });
  }
  promptUser();
}
