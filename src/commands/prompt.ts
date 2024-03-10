import { type Command } from "commander";
import { sendChat } from "../send-chat.js";
import { askQuestion } from "../ask-question.js";
import { type Operation, handleFilesCommand } from "./files.js";

export function registerPromptCommand(program: Command): void {
  program
    .arguments("[message...]")
    .description("Send a message or prompt user")
    .action(handlePromptCommand);
}

async function handlePromptCommand(argv: string[]): Promise<void> {
  const message = argv.join(" ");

  if (!message) {
    const answer = await askQuestion("➜");
    console.log({ answer });

    if (answer.startsWith("files")) {
      const [_command, operation, ...files] = answer.split(" ");
      await handleFilesCommand(operation as Operation, files);
      await handlePromptCommand([]);
    } else {
      await sendChat({ message: answer });
    }
  } else {
    await sendChat({ message });
  }
}
