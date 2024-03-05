import fs from "node:fs";
import { debug } from "../utils/debug-log.js";
import { options } from "../arg-options.js";
import { type Settings, validateSettings } from "./settings-schema.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";

export function getSettings(filePath = DEFAULT_SETTINGS_FILE_PATH): Settings {
  let settings;
  let settingsFileContents: string | undefined;

  try {
    settingsFileContents = fs.readFileSync(filePath, "utf8");
  } catch (error: unknown) {
    if (error instanceof Error) {
      options.debug &&
        debug.error("Error reading settings file", error.message);
    }
  }

  try {
    if (settingsFileContents && typeof settingsFileContents === "string") {
      settings = JSON.parse(settingsFileContents) as unknown;
      const validatedSettings = validateSettings(settings);
      console.log({ validatedSettings });
      return validatedSettings;
    }
  } catch (error) {
    throw new Error(
      `Error parsing JSON: ${filePath}

You can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command: 
\x1b[36mai --init
`
    );
  }

  throw new Error("Failed to read settings file");
}
