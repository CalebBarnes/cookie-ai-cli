import { execSync } from "node:child_process";
import { logger } from "./logger.js";

export function writeToClipboard(text: string): boolean {
  const platform = process.platform;

  try {
    if (platform === "darwin") {
      // macOS
      execSync(`pbcopy`, { input: text });
    } else if (platform === "win32") {
      // Windows
      execSync(`clip`, { input: text });
    } else if (platform === "linux") {
      // Linux (Ensure xclip is installed)
      execSync(`xclip -selection clipboard`, { input: text });
    } else {
      logger.error("Platform not supported for clipboard operations");
      return false;
    }

    return true;
  } catch (error: unknown) {
    logger.error("Failed to write to clipboard");
    if (error instanceof Error) {
      logger.error(error);
    }
    return false;
  }
}
