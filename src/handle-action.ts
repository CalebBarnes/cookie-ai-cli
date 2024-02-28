import { askQuestion } from "./ask-question";
import { handleCommand } from "./handle-command";
import { sendChat } from "./send-chat";
import { promptUser } from "./prompt-user";
import { colors } from "./utils/colors";
import { Interface } from "readline";
import { Response } from "./ai-response-schema";

export async function handleAction({
  result,
  rl,
}: {
  result: Response;
  rl: Interface;
}) {
  if (result.action === "command") {
    await handleCommand({
      rl,
      command: result.command,
      description: result.description,
    });
  } else if (result.action === "command_list") {
    for (const command of result.commands) {
      await handleCommand({
        rl,
        command,
        description: result.description,
      });
    }
  } else if (result.action === "user_info_required") {
    const values = {};
    for (const item of result.values) {
      const answer = await askQuestion(rl, item.label);
      values[item.value] = answer;
    }

    if (result.suggested_command_list) {
      for (const command of result.suggested_command_list) {
        await handleCommand({
          rl,
          command,
          values,
          description: result.description,
        });
      }
    }
    if (result.suggested_command) {
      await handleCommand({
        rl,
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
      rl,
    });
  }
  promptUser(rl);
}
