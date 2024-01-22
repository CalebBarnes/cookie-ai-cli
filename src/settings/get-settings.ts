import { initializeSettings } from "./initialize-settings";
import { settingsFilePath } from "./settings-constants";
import fs from "fs";
import readline from "readline";
import { Settings, validateSettings } from "./settings-schema";
import { debug } from "../utils/debug-log";

export async function getSettings({
  rl,
}: {
  rl: readline.Interface;
}): Promise<Settings> {
  let settings: Settings | undefined;
  let settingsFile: string | undefined;

  try {
    settingsFile = fs.readFileSync(settingsFilePath, "utf8");
  } catch (error) {
    await initializeSettings(rl);
  }

  try {
    if (settingsFile) {
      settings = JSON.parse(settingsFile);
    }
  } catch (error) {
    debug.error(
      `Error parsing JSON ${settingsFilePath}\n\nYou can edit your settings file manually to resolve the issue, or try reinitializing a new settings file by running the following command: \n\x1b[36mai --init\n`
    );
    process.exit(1);
  }

  if (settings) {
    validateSettings(settings);
    return settings;
  }

  debug.error("Failed to read settings file");
  process.exit(1);
}
