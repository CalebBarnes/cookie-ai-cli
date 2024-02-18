import { type Response } from "./ai-response-schema";
import { getSettings } from "./settings/get-settings";
import { handleAction } from "./handle-action";
import { systemInstructions } from "./settings/settings-constants";
import { getHeaders } from "./settings/get-headers";
import { isDebug } from "./main";
import { debug } from "./utils/debug-log";
import { colors } from "./utils/colors";

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

  if (settings.service === "custom" && settings.custom?.payload) {
    // Allow passing in custom payload for service "custom"
    Object.assign(payload, settings.custom?.payload);
  }

  if (settings.model) {
    payload.model = settings.model;
  }

  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  console.log(`${colors.yellow}🤔 AI thinking...${colors.reset}`);

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

  console.log(`${colors.green}✅ AI responded!${colors.reset}`);

  let responseJson;
  try {
    responseJson = await response.json();
    if (isDebug) {
      console.log("responseJson", responseJson);
    }
  } catch (err) {
    debug.error("Failed to parse endpoint response as JSON");
    console.error(err);
    process.exit(1);
  }

  const aiResponseChatMessage = responseJson?.choices?.[0]?.message;
  if (!aiResponseChatMessage) {
    await handleEmptyResponse({ rl });
  }
  // add the AI response to the chat history
  payload.messages.push(aiResponseChatMessage);
  if (isDebug) {
    console.log("payload", payload);
  }

  const aiResponseContent = responseJson?.choices?.[0]?.message?.content;
  let pamperedResponseData;
  const json = aiResponseContent?.slice(
    aiResponseContent.indexOf("{"),
    aiResponseContent.lastIndexOf("}") + 1
  );

  try {
    pamperedResponseData = JSON.parse(json) as Response;
    await handleAction({ result: pamperedResponseData, rl });
  } catch (error) {
    debug.error("Failed to parse AI response as JSON");
    debug.log("Asking AI to retry...");
    if (isDebug) {
      console.log("AI Response: ");
      console.log(aiResponseContent);
    }
    await sendChat({
      isError: true,
      message: "Your last response was not valid JSON. Please try again.",
      rl,
    });
  }

  return pamperedResponseData;
}

async function handleEmptyResponse({ rl }) {
  const settings = await getSettings({ rl });
  if (settings.service === "openai") {
    debug.error(
      `No message in response from the AI.
Check that your OpenAI account does not have restricted usage limits at https://platform.openai.com/account/limits 
and that you have enough credits to use the API.

Make sure you're also using the correct API key and model.
`
    );
  }
  process.exit(1);
}
