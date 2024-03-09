import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/debug-log.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { type Settings, validateSettings } from "./settings-schema.js";

export function saveSettings(
  settings: Settings,
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): void {
  const validatedSettings = validateSettings(settings);
  try {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(validatedSettings, null, 2));
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error saving settings file: ${err.message}`);
    }
  }
}
