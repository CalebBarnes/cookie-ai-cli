import { askQuestion } from "../ask-question.js";
import { debug } from "../utils/debug-log.js";
import { saveSettings } from "./save-settings.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { type Settings, services } from "./settings-schema.js";

export async function initializeSettings(
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): Promise<void> {
  const settings: Settings = {
    service: "openai",
    model: "gpt-4",
  };

  settings.service = (await askQuestion("Select the API service to use: ", [
    ...services,
  ])) as Settings["service"];

  switch (settings.service) {
    case "openai":
      settings.openai = {
        key: await askQuestion("Enter your OpenAI API key: "),
      };
      break;
    case "custom":
      settings.endpoint = await askQuestion("Enter the API endpoint: ");
      settings.headers = await askForCustomHeaders();
      break;
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- Handles invalid service
      throw new Error(`Invalid service: ${settings.service}`);
  }

  const model = await askQuestion(
    "Enter your model (leave blank for default: gpt-4): "
  );
  settings.model = model || "gpt-4";

  debug.info(
    `Saving settings at ${settingsPath}:\n${JSON.stringify(settings, null, 2)}}`
  );

  saveSettings(settings, settingsPath);
}

async function askForCustomHeaders(): Promise<Record<string, string>> {
  console.log(
    "Enter custom headers. Type 'done' as the header key when finished."
  );
  const headers = {} as Record<string, string>;
  let addingHeaders = true;

  while (addingHeaders) {
    const key = await askQuestion(
      "Enter header key (or type 'done' to finish): "
    );

    if (key.toLowerCase() === "done") {
      addingHeaders = false;
    } else {
      const value = await askQuestion(`Enter value for header '${key}': `);
      headers[key] = value;
    }
  }

  return headers;
}
