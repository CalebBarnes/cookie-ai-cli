import { type Command } from "commander";
import { sendChat } from "../send-chat.js";
import { askQuestion } from "../ask-question.js";

export function registerPromptCommand(program: Command): void {
  program
    .arguments("[message...]")
    .description("Send a message or prompt user")
    .action(async (argv: string[]) => {
      const message = argv.join(" ");

      if (!message) {
        const answer = await askQuestion("➜");
        await sendChat({ message: answer });
      } else {
        await sendChat({ message });
      }
    });
}
