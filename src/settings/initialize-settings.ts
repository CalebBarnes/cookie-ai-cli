import fs from "fs";
import { saveSettings } from "./save-settings";
import { settingsDir, settingsFilePath } from "./settings-constants";
import { askQuestion } from "../ask-question";
import readline from "readline";

import { Settings, services } from "./get-settings";
import chalk from "chalk";

export async function initializeSettings(rl: readline.Interface) {
  fs.mkdirSync(settingsDir, { recursive: true });

  let settings: Settings = {};

  settings.service = (await askQuestion(rl, "Select the API service to use: ", [
    ...services,
  ])) as Settings["service"];

  if (settings.service === "custom" || settings.service === "cloudflare") {
    settings.endpoint = await askQuestion(rl, "Enter the API endpoint: ");
  }

  if (settings.service === "openai") {
    settings.openai = {
      key: await askQuestion(rl, "Enter the OpenAI API key: "),
    };
  }

  if (settings.service === "cloudflare") {
    settings.cloudflare = {
      client_id: await askQuestion(
        rl,
        "Enter the Cloudflare service token client id: "
      ),
      client_secret: await askQuestion(
        rl,
        "Enter the Cloudflare service token client secret: "
      ),
    };
  }

  if (settings.service === "custom") {
    console.log(
      "Enter custom headers. Type 'done' as the header key when finished."
    );
    settings.headers = await askForCustomHeaders(rl);
  }

  settings.model = await askQuestion(
    rl,
    "Enter your model (leave blank for default: gpt-3.5-turbo): "
  );

  console.log(chalk.green(`Saving settings: ${settingsFilePath}`));
  console.log({ settings });

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
