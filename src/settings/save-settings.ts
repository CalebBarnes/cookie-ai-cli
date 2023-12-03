import fs from "fs";
import { settingsFilePath } from "./settings-constants";
import { Settings } from "./get-settings";

export function saveSettings(settings: Settings) {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}
