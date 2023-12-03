import fs from "fs";
import { settingsFilePath } from "./settings-constants";

export function saveSettings(settings: { endpoint?: string; apiKey?: string }) {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}
