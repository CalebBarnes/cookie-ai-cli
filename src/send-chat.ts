import { type Response } from "./ai-response-schema.js";
import { getSettings } from "./settings/get-settings.js";
import { handleAction } from "./handle-action.js";
import { getHeaders } from "./settings/get-headers.js";
import { options } from "./arg-options.js";
import { logger } from "./utils/debug-log.js";
import { colors } from "./utils/colors.js";
import { baseInstructions } from "./settings/settings-constants.js";
import { getSystemInstructions } from "./settings/get-system-instructions.js";

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
}

interface Choice {
  message: { role: string; content: string };
}
interface ResponseJson {
  choices: Choice[];
}

// eslint-disable-next-line prefer-const -- This is a asdasd
let payload = {
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
  if (payload.messages[0]) {
    payload.messages[0].content = await getSystemInstructions();
  }

  const settings = getSettings();

  if (settings.service === "custom" && settings.custom?.payload) {
    Object.assign(payload, settings.custom.payload);
  }

  if (settings.model) {
    payload.model = settings.model;
  }

  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  logger.log(`${colors.yellow}🤔 AI thinking...${colors.reset}`, "");

  const endpoint =
    settings.service === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : settings.endpoint;

  if (!endpoint) {
    logger.error(
      `Failed to resolve endpoint from settings: ${JSON.stringify(settings, null, 2)}`
    );
    process.exit(1);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders(settings),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    logger.error(`Failed to send message to endpoint: ${endpoint}`);
    process.exit(1);
  }

  logger.log(`${colors.green}✅ AI responded!${colors.reset}`);

  let responseJson: ResponseJson;
  try {
    responseJson = (await response.json()) as ResponseJson;
    if (options.debug) {
      logger.log("responseJson");
      logger.log(responseJson);
    }
  } catch (err: unknown) {
    logger.error("Failed to parse endpoint response as JSON");
    if (err instanceof Error) {
      logger.error(err);
    }
    process.exit(1);
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

  // add the AI response to the chat history
  payload.messages.push(aiResponseChatMessage);
  if (options.debug) {
    logger.log("payload:");
    logger.log(payload);
  }

  const aiResponseContent = responseJson.choices[0]?.message?.content ?? "";
  let pamperedResponseData;
  const json = aiResponseContent.slice(
    aiResponseContent.indexOf("{"),
    aiResponseContent.lastIndexOf("}") + 1
  );

  try {
    pamperedResponseData = JSON.parse(json) as Response;
    const actionResult = await handleAction({ result: pamperedResponseData });
    logger.log({ actionResult });

    if (actionResult.error?.code === "unsupported_action") {
      // logger.log(
      //   `${colors.red}AI tried to use unsupported action "${result.action}", asking AI to retry: ${colors.reset}`,
      //   result.action
      // );
      logger.error(actionResult.error.message);
      await sendChat({
        message: actionResult.error.message,
      });
    }
  } catch (error) {
    logger.error("Failed to parse AI response as JSON");
    logger.log("Asking AI to retry...");
    if (options.debug) {
      logger.log("AI Response: ");
      logger.log(aiResponseContent);
    }
    await sendChat({
      isError: true,
      message: "Your last response was not valid JSON. Please try again.",
    });
  }

  return pamperedResponseData;
}
