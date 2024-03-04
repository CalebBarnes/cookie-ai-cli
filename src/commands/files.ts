import fs from "fs";
import { Command } from "commander";
import { getSettings } from "../settings/get-settings";
import { DEFAULT_SETTINGS_FILE_PATH } from "../settings/settings-constants";
import { debug } from "../utils/debug-log";
import { saveSettings } from "../settings/save-settings";
import { colors } from "../utils/colors";
import { writeToClipboard } from "../utils/write-to-clipboard";

export function getFilesMessage(settingsFilePath = DEFAULT_SETTINGS_FILE_PATH) {
  const settings = getSettings(settingsFilePath);

  let contents = ``;
  if (settings.files?.length) {
    for (const file of settings.files) {
      const fileContents = fs.readFileSync(file, "utf-8");
      contents += `${file}:
${fileContents}

`;
    }
  } else {
    throw new Error("No files added");
  }

  return contents;
}

function addItem(files: string[], filePath = DEFAULT_SETTINGS_FILE_PATH) {
  if (!files.length) {
    debug.error("No files provided");
    // todo: use readline interface to list files and select checkboxes with space (TUI?)
    return;
  }

  const settings = getSettings(filePath);

  for (const file of files) {
    const exists = fs.existsSync(file);
    const absolutePath = fs.realpathSync(file);
    console.log({ absolutePath });
    if (!exists) {
      debug.error(`File or directory does not exist: ${absolutePath}`);
      return;
    }
    if (settings.files?.includes(absolutePath)) {
      debug.error(`${absolutePath} is already in the list`);
      return;
    }
    settings.files = settings.files
      ? settings.files.concat([absolutePath])
      : [absolutePath];
  }

  return saveSettings(settings, filePath);
}

function removeItem(files: string[], filePath = DEFAULT_SETTINGS_FILE_PATH) {
  if (!files.length) {
    debug.error("No files provided");
    return;
  }

  const settings = getSettings(filePath);

  for (const file of files) {
    if (settings.files?.includes(file)) {
      settings.files = settings.files.filter((f) => f !== file);
      saveSettings(settings, filePath);
    } else {
      debug.error(`${file} is not in the list:`);
      console.log(settings.files);
      return;
    }
  }

  return saveSettings(settings, filePath);
}

export function listFiles(filePath = DEFAULT_SETTINGS_FILE_PATH) {
  const settings = getSettings(filePath);

  if (settings.files?.length) {
    for (const file of settings.files) {
      console.log(`${colors.green}• ${file}${colors.reset}`);
    }
  } else {
    debug.error("No files added");
  }
}

type Operation = "add" | "remove" | "reset" | "list" | "copy";

export function registerFilesCommands(program: Command) {
  program
    .command("files [operation] [path...]")
    .description("Manage files")
    .action(async (operation: Operation = "list", files: string[]) => {
      const settings = getSettings();

      switch (operation) {
        case "add":
          addItem(files);
          break;
        case "remove":
          removeItem(files);
          break;
        case "reset":
          settings.files = [];
          saveSettings(settings);
          break;
        case "list":
          console.log(`${colors.green}files:${colors.reset}`);
          listFiles();
          break;

        case "copy":
          const text = getFilesMessage();

          writeToClipboard(text);
          console.log(
            `${colors.green}files copied to clipboard:${colors.reset}`
          );
          listFiles();

          process.exit(0);
          break;
      }

      return;
    });
}
