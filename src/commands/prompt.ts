import { type Command } from "commander";
import { sendChat } from "../send-chat";
import { askQuestion } from "../ask-question";

export function registerPromptCommand(program: Command): void {
  program
    .arguments("[message...]")
    .description("Send a message or prompt user")
    .action(async (argv: string[]) => {
      const message = argv.join(" ");

      if (!message) {
        const answer = await askQuestion("What do you want to do?");
        await sendChat({ message: answer });
      } else {
        await sendChat({ message });
      }
    });
}
