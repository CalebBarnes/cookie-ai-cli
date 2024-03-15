import { type Command } from "commander";
import { type Instance } from "ink";
import { client } from "../ai/client.js";
import { renderCommandPreview } from "../ui/command-preview.js";
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

async function handlePrompt(prompt?: string): Promise<void> {
  if (prompt?.startsWith("files")) {
    const [_command, operation, ...files] = prompt.split(" ");
    return handleFilesCommand(operation as Operation, files);
  }

  let userPrompt = prompt;

  function handleSubmitPrompt(msg: string): void {
    userPrompt = msg;

    client.sendChat(msg).catch((err) => {
      console.error(err);
    });
  }

  function handleConfirm(): void {
    client.off("message", handleMessage);
    client.off("completed", handleCompleted);
    instance?.unmount();
    console.log("Confirmed!!!");
  }

  function handleCancel(): void {
    client.off("message", handleMessage);
    client.off("completed", handleCompleted);
    instance?.unmount();
    console.log("Cancelled!!!");
    handlePrompt().catch(console.error);
  }

  function handleMessage(message?: Partial<Response>): void {
    instance = renderCommandPreview(
      {
        prompt: userPrompt,
        isLoading: true,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      },
      message
    );
  }

  function handleCompleted(message?: Partial<Response>): void {
    instance = renderCommandPreview(
      {
        prompt: userPrompt,
        isLoading: false,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      },
      message
    );
    client.off("message", handleMessage);
    client.off("completed", handleCompleted);
  }

  let instance: Instance | undefined;
  client.on("message", handleMessage);
  client.on("completed", handleCompleted);

  instance = renderCommandPreview({
    onSubmitPrompt: handleSubmitPrompt,
    prompt: userPrompt,
    isLoading: true,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  });

  if (userPrompt) {
    instance = renderCommandPreview({
      prompt: userPrompt,
      isLoading: true,
    });
    await client.sendChat(userPrompt);
  }
}
