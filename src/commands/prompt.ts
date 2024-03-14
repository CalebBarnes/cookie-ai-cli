import { type Command } from "commander";
import { client } from "../ai/client.js";
import { renderCommandPreview } from "../ui/command-preview.js";
import { askQuestion } from "../utils/ask-question.js";
import { type Response } from "../ai-response-schema.js";
import { type Operation, handleFilesCommand } from "./files.js";

export function registerPromptCommand(program: Command): void {
  program
    .arguments("[prompt...]")
    .description("Prompt the AI with a message.")
    .action(async (argv: string[]) => {
      const prompt = argv.join(" ");
      return handlePrompt(prompt);
    });
}

async function handlePrompt(prompt: string): Promise<void> {
  if (prompt.startsWith("files")) {
    const [_command, operation, ...files] = prompt.split(" ");
    return handleFilesCommand(operation as Operation, files);
  }
  const userPrompt = prompt || (await askQuestion("➜"));

  let instance = renderCommandPreview({
    prompt: userPrompt,
    isLoading: true,
  });

  client.on("message", (message?: Response) => {
    instance = renderCommandPreview({
      prompt: userPrompt,
      ...(message ?? {}),
      isLoading: true,
    });
  });
  const response = await client.sendChat(userPrompt);

  instance = renderCommandPreview({
    prompt: userPrompt,
    ...(response ?? {}),
    isLoading: false,
  });
  instance.unmount();
  await handlePrompt(await askQuestion("➜"));
}
