import { Command } from "commander";
import { promptUser } from "../prompt-user";
import { sendChat } from "../send-chat";
import readline from "readline";

export function registerPromptCommand(program: Command) {
  program
    .arguments("[message]")
    .description("Send a message or prompt user")
    .action(async (message) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      if (!message) {
        await promptUser(rl);
      } else {
        await sendChat({ message, rl });
      }
    });
}
