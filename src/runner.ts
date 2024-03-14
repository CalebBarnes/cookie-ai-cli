// import { type Instance } from "ink";
// import { type CommandMessageContent } from "./ai-response-schema.js";
import { client } from "./ai/client.js";
// import { renderCommandPreview } from "./ui/command-preview.js";

export async function runner(): Promise<void> {
  const userPrompt = "get my ip?";

  // let instance: Instance | undefined;

  // client.on("message", (message: Partial<CommandMessageContent>) => {
  //   instance = renderCommandPreview({
  //     userPrompt,
  //     ...message,
  //     isLoading: true,
  //   });
  // });

  const _res = await client.sendChat(userPrompt);
  // const message = res as Partial<CommandMessageContent>;
  // instance = renderCommandPreview({
  //   userPrompt,
  //   ...message,
  //   isLoading: false,
  //   isError: false,
  // });

  // instance.unmount();
}
