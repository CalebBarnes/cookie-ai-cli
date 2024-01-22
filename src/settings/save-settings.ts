import fs from "fs";
import { settingsFilePath } from "./settings-constants";
import { Settings } from "./settings-schema";
import { debug } from "../utils/debug-log";

export function saveSettings(settings: Settings) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (err: any) {
    debug.error(`Error saving settings file: ${err.message}`);
  }
}
