import fs from "node:fs";
import path from "node:path";
import { debug } from "../utils/debug-log.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { type Settings, validateSettings } from "./settings-schema.js";

export function saveSettings(
  settings: Settings,
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): void {
  validateSettings(settings);
  try {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true }); // Create directory if it doesn't exist
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2)); // Write settings to file
  } catch (err: unknown) {
    if (err instanceof Error) {
      debug.error(`Error saving settings file: ${err.message}`);
    }
  }
}
