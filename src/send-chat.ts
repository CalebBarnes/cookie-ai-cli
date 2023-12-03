import { type Response } from "./ai-response-schema";
import chalk from "chalk";
import { getSettings } from "./settings/get-settings";
import { handleAction } from "./handle-action";
import {
  settingsFilePath,
  systemInstructions,
} from "./settings/settings-constants";
import { getEndpoint, getHeaders } from "./settings/get-headers";

let payload = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "system", content: systemInstructions }],
  temperature: 0.7,
  mode: "instruct",
  instruction_template: "Alpaca",
  response_format: { type: "json_object" },
};

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

  if (settings.model) {
    payload.model = settings.model;
  }

  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  console.log(chalk.yellow("🤔 AI thinking..."));
  const response = await fetch(getEndpoint(settings), {
    method: "POST",
    headers: getHeaders(settings),
    body: JSON.stringify(payload),
  });
  console.log(chalk.green("✅ AI responded!"));

  let responseJson;
  try {
    responseJson = await response.json();
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
    payload.messages.push(responseJson?.choices?.[0]?.message);
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
