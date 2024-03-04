import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants";
import fs from "fs";
import { Settings, validateSettings } from "./settings-schema";
import { debug } from "../utils/debug-log";
import { options } from "..";

export function getSettings(filePath = DEFAULT_SETTINGS_FILE_PATH): Settings {
  let settings: Settings | undefined;
  let file: string | undefined;

  try {
    file = fs.readFileSync(filePath, "utf8");
  } catch (error: any) {
    options.debug && debug.error("Error reading settings file", error);
  }

  try {
    if (file) {
      settings = JSON.parse(file);
    }
  } catch (error) {
    throw new Error(
      `Error parsing JSON: ${filePath}

You can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command: 
\x1b[36mai --init
`
    );
  }

  if (settings) {
    validateSettings(settings);
    return settings;
  }

  throw new Error("Failed to read settings file");
}
