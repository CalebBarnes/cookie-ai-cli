import { type Response } from "./ai-response-schema";
import chalk from "chalk";
import { getSettings } from "./settings/get-settings";
import { handleAction } from "./handle-action";
import {
  settingsFilePath,
  systemInstructions,
} from "./settings/settings-constants";
import { getHeaders } from "./settings/get-headers";
import { isDebug } from "./main";
import { debug } from "./utils/debug-log";

type Payload = {
  /**
   * ID of the model to use for chat completion.
   * See the model endpoint compatibility table for details on which models work with the Chat API.
   * @see https://platform.openai.com/docs/models/model-endpoint-compatibility
   */
  model: string;
  /**
   * A list of messages comprising the conversation so far.
   */
  messages: { role: string; content: string }[];
  /**
   *
   */
  temperature: number;
  /**
   *
   * Don't use mode if you're using OpenAI's API
   * For text-generation-webui, valid options are "instruct", "chat", "chat-instruct" and it defaults to "instruct".
   */
  mode?: string;
  /**
   * Don't use instruction_template if you're using OpenAI's API
   * An instruction template defined under text-generation-webui/instruction-templates.
   * If not set, the correct template will be guessed using the regex expressions in models/config.yaml.
   */
  instruction_template?: string;
};

let payload = {
  model: "gpt-4",
  messages: [{ role: "system", content: systemInstructions }],
  temperature: 0.7,
} as Payload;

export async function sendChat({
  message,
  rl,
  isError,
}: {
  message: string;
  rl: any;
  isError?: boolean;
}): Promise<Response> {
  const settings = await getSettings({ rl });

  if (settings.service !== "openai") {
    payload.instruction_template = "Alpaca";
  }

  if (settings.model) {
    payload.model = settings.model;
  }

  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  console.log(chalk.yellow("🤔 AI thinking..."));

  const endpoint =
    settings.service === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : settings.endpoint;

  if (!endpoint) {
    debug.error(`Failed to resolve endpoint from settings: ${settings}`);
    process.exit(1);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders(settings),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    debug.error(`Failed to send message to endpoint: ${endpoint}`);
    process.exit(1);
  }

  console.log(chalk.green("✅ AI responded!"));

  let responseJson;
  try {
    responseJson = await response.json();

    if (isDebug) {
      console.log("responseJson", responseJson);
    }

    payload.messages.push(responseJson?.choices?.[0]?.message);
    if (isDebug) {
      console.log("payload", payload);
    }
  } catch (err) {
    console.log(chalk.red("Failed to parse endpoint response as JSON"));
    console.log(
      chalk.red(
        `Check your settings at ${settingsFilePath}, or run \`ai --init\` to reinitialize your settings file.`
      )
    );
    console.error(err);
    process.exit(1);
  }

  const aiResponseContent = responseJson?.choices?.[0]?.message?.content;

  let pamperedResponseData;

  const json = aiResponseContent?.slice(
    aiResponseContent.indexOf("{"),
    aiResponseContent.lastIndexOf("}") + 1
  );

  try {
    pamperedResponseData = JSON.parse(json) as Response;
    const aiMessage = responseJson?.choices?.[0]?.message;
    if (!aiMessage) {
      await handleEmptyResponse({ rl });
    }
    payload.messages.push(aiMessage);
    await handleAction({ result: pamperedResponseData, rl });
  } catch (error) {
    console.log(chalk.red("Result is not valid JSON, failed to parse"));
    console.log("AI Response: ");
    console.log(aiResponseContent);

    console.log("Asking AI to retry...");
    sendChat({
      isError: true,
      message: "Your response was not valid JSON. Please try again.",
      rl,
    });
  }

  return pamperedResponseData;
}

async function handleEmptyResponse({ rl }) {
  const settings = await getSettings({ rl });
  console.log(chalk.red("No message in the response from the AI."));
  console.log(
    chalk.red("Make sure you're using the correct API key and model.")
  );
  if (settings.service === "openai") {
    console.log(
      chalk.red(
        "Check that your OpenAI account does not have restricted usage limits at https://platform.openai.com/account/limits \nand that you have enough credits to use the API."
      )
    );
  }
  process.exit(1);
}
