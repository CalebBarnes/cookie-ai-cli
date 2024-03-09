import fs from "node:fs";
import path from "node:path";
import { type Command } from "commander";
import { getSettings } from "../settings/get-settings";
import { DEFAULT_SETTINGS_FILE_PATH } from "../settings/settings-constants";
import { logger } from "../utils/debug-log";
import { saveSettings } from "../settings/save-settings";
import { colors } from "../utils/colors";
import { writeToClipboard } from "../utils/write-to-clipboard";
import { askQuestion } from "../ask-question";

export async function getFilesMessage(
  settingsFilePath = DEFAULT_SETTINGS_FILE_PATH
): Promise<string> {
  const settings = getSettings(settingsFilePath);

  let contents = ``;
  if (settings.files?.length) {
    for (const file of settings.files) {
      let fileContents;

      try {
        fileContents = fs.readFileSync(file, "utf-8");
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("no such file or directory")) {
            logger.error(`File not found: ${file}`);
          } else {
            logger.error(`Error reading file: ${file}`);
          }

          const answer = await askQuestion(
            "Remove this file from the list? (y/n)"
          );
          if (answer === "y") {
            removeItem([file]);
          }
        }
        continue;
      }

      contents += `${file}:
${fileContents}

`;
    }
  } else {
    throw new Error("No files added");
  }

  return contents;
}

export function addItem(
  files: string[],
  filePath = DEFAULT_SETTINGS_FILE_PATH
): void {
  if (!files.length) {
    logger.error("No files provided");
    // todo: use readline interface to list files and select checkboxes with space (TUI?)
    return;
  }

  const settings = getSettings(filePath);

  for (const file of files) {
    const exists = fs.existsSync(file);
    const absolutePath = path.resolve(file);

    if (!exists) {
      logger.error(`File or directory does not exist: ${absolutePath}`);
      return;
    }
    if (settings.files?.includes(absolutePath)) {
      logger.error(`${absolutePath} is already in the list`);
      return;
    }
    settings.files = settings.files
      ? settings.files.concat([absolutePath])
      : [absolutePath];
  }

  saveSettings(settings, filePath);
}

export function removeItem(
  files: string[],
  filePath = DEFAULT_SETTINGS_FILE_PATH
): void {
  if (!files.length) {
    logger.error("No files provided");
    return;
  }

  const settings = getSettings(filePath);

  for (const file of files) {
    if (settings.files?.includes(file)) {
      settings.files = settings.files.filter((f) => f !== file);
      saveSettings(settings, filePath);
    } else {
      logger.error(`${file} is not in the list:`);
      logger.log(settings.files, "");
      return;
    }
  }

  saveSettings(settings, filePath);
}

export function listFiles(filePath = DEFAULT_SETTINGS_FILE_PATH): void {
  const settings = getSettings(filePath);

  if (settings.files?.length) {
    for (const file of settings.files) {
      logger.log(`${colors.green}• ${file}${colors.reset}`, "");
    }
  } else {
    logger.log(
      `${colors.yellow}No files added. You can use the "files add <filepath>" command to add files to the list.${colors.reset}`,
      ""
    );
  }
}

async function copyFilesToClipboard(): Promise<void> {
  const text = await getFilesMessage();
  writeToClipboard(text);
}

type Operation = "add" | "remove" | "reset" | "list" | "copy";

export function registerFilesCommands(program: Command): void {
  program
    .command("files [operation] [path...]")
    .description("Manage files")
    // eslint-disable-next-line @typescript-eslint/default-param-last -- list has no files anyways
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
          listFiles();
          break;

        case "copy":
          await copyFilesToClipboard();
          logger.log(
            `${colors.green}files copied to clipboard:${colors.reset}`,
            ""
          );
          listFiles();

          process.exit(0);
      }
    });
}
