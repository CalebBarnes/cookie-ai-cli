import { execSync } from "child_process";

export async function writeToClipboard(text) {
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
      console.error("Platform not supported for clipboard operations");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to write to clipboard:", error);
    return false;
  }
}
