import fs from "fs";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants";
import { Settings, validateSettings } from "./settings-schema";
import { debug } from "../utils/debug-log";
import path from "path";

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
