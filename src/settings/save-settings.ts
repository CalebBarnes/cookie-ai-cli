import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { type Settings, validateSettings } from "./settings-schema.js";

export function saveSettings(
  settings: Settings,
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): void {
  let validatedSettings;
  try {
    validatedSettings = validateSettings(settings);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`validating config: ${err.message}`);
      return;
    }
  }

  if (!validatedSettings) {
    return;
  }

  try {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2));
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error saving settings file: ${err.message}`);
    }
  }
}
