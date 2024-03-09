import fs from "node:fs";
import { logger } from "../utils/debug-log";
import { options } from "../arg-options";
import { type Settings, validateSettings } from "./settings-schema";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants";

export function getSettings(filePath = DEFAULT_SETTINGS_FILE_PATH): Settings {
  let settings;
  let settingsFileContents: string | undefined;

  if (!fs.existsSync(filePath)) {
    logger.error(`Settings file not found: ${filePath}
Run "ai init" to create a new settings file.`);
    process.exit(1);
  }

  try {
    settingsFileContents = fs.readFileSync(filePath, "utf8");
  } catch (error: unknown) {
    if (error instanceof Error) {
      options.debug &&
        logger.error("Error reading settings file", error.message);
    }
  }

  if (settingsFileContents && typeof settingsFileContents === "string") {
    try {
      settings = JSON.parse(settingsFileContents) as unknown;
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Error parsing JSON file: ${filePath}`);
        process.exit(1);
      }
    }

    const validatedSettings = validateSettings(settings);
    return validatedSettings;
  }

  //   try {
  //   } catch (error) {
  //     // eslint-disable-next-line no-console -- fuck u
  //     console.error(error);
  //     throw new Error(
  //       `Error parsing JSON: ${filePath}

  // You can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command:
  // \x1b[36mai --init
  // `
  //     );
  //   }

  throw new Error("Failed to read settings file");
}
