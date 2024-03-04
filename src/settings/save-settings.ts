import fs from "fs";
import path from "path";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { Settings, validateSettings } from "./settings-schema.js";
import { debug } from "../utils/debug-log.js";

export function saveSettings(
  settings: Settings,
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
) {
  validateSettings(settings);
  try {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true }); // Create directory if it doesn't exist
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2)); // Write settings to file
  } catch (err: any) {
    debug.error(`Error saving settings file: ${err.message}`);
  }
}
