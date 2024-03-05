import { type Command } from "commander";
import { promptUser } from "../prompt-user.js";
import { sendChat } from "../send-chat.js";

export function registerPromptCommand(program: Command): void {
  program
    .arguments("[message...]")
    .description("Send a message or prompt user")
    .action(async (argv: string[]) => {
      const message = argv.join(" ");

      if (!message) {
        await promptUser();
      } else {
        await sendChat({ message });
      }
    });
}
