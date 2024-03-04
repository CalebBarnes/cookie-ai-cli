import { Command } from "commander";
import { promptUser } from "../prompt-user";
import { sendChat } from "../send-chat";

export function registerPromptCommand(program: Command) {
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
