import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/debug-log";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants";
import { type Settings, validateSettings } from "./settings-schema";

export function saveSettings(
  settings: Settings,
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): void {
  const validatedSettings = validateSettings(settings);
  try {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true }); // Create directory if it doesn't exist
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2)); // Write settings to file
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error saving settings file: ${err.message}`);
    }
  }
}
