import fs from "fs";
import { saveSettings } from "./save-settings";
import { services, settingsDir, settingsFilePath } from "./settings-constants";
import { askQuestion } from "../ask-question";
import { Interface } from "readline";
import { Settings } from "./settings-schema";
import { debug } from "../utils/debug-log";

export async function initializeSettings(rl: Interface) {
  fs.mkdirSync(settingsDir, { recursive: true });

  let settings: Settings = {
    service: "openai",
    model: "gpt-4",
  };

  settings.service = (await askQuestion(rl, "Select the API service to use: ", [
    ...services,
  ])) as Settings["service"];

  if (settings.service === "custom") {
    settings.endpoint = await askQuestion(rl, "Enter the API endpoint: ");
  }
  if (settings.service === "openai") {
    settings.openai = {
      key: await askQuestion(rl, "Enter your OpenAI API key: "),
    };
  }
  if (settings.service === "custom") {
    console.log(
      "Enter custom headers. Type 'done' as the header key when finished."
    );
    settings.headers = await askForCustomHeaders(rl);
  }
  const modelAnswer = await askQuestion(
    rl,
    "Enter your model (leave blank for default: gpt-4): "
  );
  if (modelAnswer) {
    settings.model = modelAnswer;
  }

  debug.info(
    `Saving settings at ${settingsFilePath}:\n${JSON.stringify(
      settings,
      null,
      2
    )}}`
  );

  saveSettings(settings);
  rl.close();
  process.exit(0);
}

async function askForCustomHeaders(rl) {
  const headers = {};
  let addingHeaders = true;

  while (addingHeaders) {
    const key = await askQuestion(
      rl,
      "Enter header key (or type 'done' to finish): "
    );

    if (key.toLowerCase() === "done") {
      addingHeaders = false;
    } else {
      const value = await askQuestion(rl, `Enter value for header '${key}': `);
      headers[key] = value;
    }
  }

  return headers;
}
