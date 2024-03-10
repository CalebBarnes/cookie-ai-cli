import fs from "node:fs";
import { logger } from "../utils/logger.js";
import { options } from "../arg-options.js";
import { colors } from "../utils/colors.js";
import { type Settings, validateSettings } from "./settings-schema.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";

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

    try {
      const validatedSettings = validateSettings(settings);
      return validatedSettings;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error validating settings file: ${filePath}. 
• ${error.message}`);
        logger.error(
          `
You can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running ${colors.cyan}"ai init"${colors.reset}
      `,
          ""
        );
        process.exit(1);
      }
    }
  }

  throw new Error(`Error loading settings: ${filePath}`);
}
