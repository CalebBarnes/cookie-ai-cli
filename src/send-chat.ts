import ora from "ora";
import { type Response } from "./ai-response-schema.js";
import { getSettings } from "./settings/get-settings.js";
import { handleAction } from "./handle-action.js";
import { getHeaders } from "./settings/get-headers.js";
import { logger } from "./utils/logger.js";
import { colors } from "./utils/colors.js";
import { baseInstructions } from "./settings/settings-constants.js";
import { getSystemInstructions } from "./settings/get-system-instructions.js";
import { askQuestion } from "./ask-question.js";
import { type Settings } from "./settings/settings-schema.js";

interface Payload {
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
}
interface Choice {
  message: { role: string; content: string };
}
interface ResponseJson {
  choices: Choice[];
}

const payload = {
  model: "gpt-4",
  messages: [{ role: "system", content: baseInstructions }],
  temperature: 0.7,
} as Payload;

export async function sendChat({
  message,
  isError,
}: {
  message: string;
  isError?: boolean;
}): Promise<Response | undefined> {
  logger.debug("sendChat");
  logger.debug(message);
  logger.debug({ isError });

  if (payload.messages[0]) {
    const systemInstructions = await getSystemInstructions();
    logger.debug("systemInstructions");
    logger.debug(systemInstructions);
    payload.messages[0].content = systemInstructions;
  }

  const settings = getSettings();
  if (settings.service === "custom" && settings.custom?.payload) {
    Object.assign(payload, settings.custom.payload);
  }
  if (settings.openai?.model) {
    payload.model = settings.openai.model;
  }

  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  const endpoint = getEndpoint(settings);
  if (!endpoint) {
    logger.error(
      `Failed to resolve endpoint from settings: ${JSON.stringify(settings, null, 2)}`
    );
    return;
    // process.exit(1);
  }

  logger.debug("payload");
  logger.debug(payload);

  const spinner = ora({
    spinner: {
      interval: 200,
      frames: ["▱▱▱▱▱", "▰▱▱▱▱", "▰▰▱▱▱", "▰▰▰▱▱", "▰▰▰▰▱", "▰▰▰▰▰"],
    },
    prefixText: `${colors.cyan}ℹ ${colors.reset}${message}`,
  });

  if (!isError) {
    // process.stdout.moveCursor(0, -1);
    // process.stdout.clearLine(1);
    spinner.start();
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders(settings),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    logger.error(`Failed to send message to endpoint: ${endpoint}`);
    if (!isError) {
      spinner.fail();
    }
    logger.error(`Payload: ${JSON.stringify(payload, null, 2)}`);
    logger.error(`Response status: ${response.status}`);
    logger.error(`Response status text: ${response.statusText}`);
    logger.error(await response.text());

    return;
    // process.exit(1);
  }
  if (!isError) {
    spinner.succeed();
  }

  let responseJson: ResponseJson;
  try {
    responseJson = (await response.json()) as ResponseJson;
    logger.debug("responseJson");
    logger.debug(responseJson);
  } catch (err: unknown) {
    logger.error("Failed to parse endpoint response as JSON");
    if (err instanceof Error) {
      logger.error(err);
    }
    return;
    // process.exit(1);
  }

  const aiResponseChatMessage = responseJson.choices[0]?.message;
  if (!aiResponseChatMessage) {
    switch (settings.service) {
      case "openai":
        logger.error(
          `No message in response from the AI.
    Check that your OpenAI account does not have restricted usage limits at https://platform.openai.com/account/limits 
    and that you have enough credits to use the API.
    
    Make sure you're also using the correct API key and model.
    `
        );
        break;
      default:
        logger.error(
          `No message in response from the AI. Check that your custom endpoint is working correctly.`
        );
    }
    process.exit(1);
  }

  payload.messages.push(aiResponseChatMessage);
  logger.debug("payload:");
  logger.debug(payload);

  const aiResponseContent = responseJson.choices[0]?.message?.content ?? "";
  let pamperedResponseData;
  const json = aiResponseContent.slice(
    aiResponseContent.indexOf("{"),
    aiResponseContent.lastIndexOf("}") + 1
  );

  try {
    pamperedResponseData = JSON.parse(json) as Response;
    const actionResult = await handleAction({ result: pamperedResponseData });
    if (actionResult.filesLoaded) {
      await sendChat({
        message: "Files loaded",
      });
    }
    if (actionResult.success) {
      const nextMessage = await askQuestion("➜");
      await sendChat({
        message: nextMessage,
      });
    }

    if (actionResult.error?.code === "unsupported_action") {
      const unsupportedAction = pamperedResponseData.action as
        | string
        | undefined;

      logger.log(
        `${colors.red}AI tried to use unsupported action "${unsupportedAction}", asking AI to retry: ${colors.reset}`,
        unsupportedAction
      );

      logger.error("AI tried to use unsupported action");
      logger.error(`actionResult.error.message: ${actionResult.error.message}`);

      await sendChat({
        message: actionResult.error.message,
      });
    }
  } catch (error) {
    logger.error("Failed to parse AI response as JSON");
    logger.info("Asking AI to retry...");
    logger.debug(`AI Response:
${aiResponseContent}`);

    await sendChat({
      isError: true,
      message: "Your last response was not valid JSON. Please try again.",
    });
  }

  return pamperedResponseData;
}

function getEndpoint(settings: Settings): string {
  if (settings.service === "openai") {
    return "https://api.openai.com/v1/chat/completions";
  }

  return settings.custom?.endpoint ?? "";
}
