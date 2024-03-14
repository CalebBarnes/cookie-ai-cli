import fs from "node:fs";
import path from "node:path";
import { type Command } from "commander";
import inquirer from "inquirer";
import { getSettings } from "../settings/get-settings.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "../settings/settings-constants.js";
import { logger } from "../utils/logger.js";
import { saveSettings } from "../settings/save-settings.js";
import { colors } from "../utils/colors.js";
import { writeToClipboard } from "../utils/write-to-clipboard.js";
import { askQuestion } from "../utils/ask-question.js";
import { type Settings } from "../settings/settings-schema.js";

export async function getFilesMessage(settings: Settings): Promise<string> {
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
            await removeItem([file]);
          }
        }
        continue;
      }

      contents += `
${path.relative(process.cwd(), file)}:
${fileContents}
`;
    }
  } else {
    throw new Error("No files added");
  }

  return contents;
}

export async function addItem(
  files: string[],
  filePath = DEFAULT_SETTINGS_FILE_PATH
): Promise<void> {
  const settings = getSettings(filePath);
  if (!files.length) {
    const availableFiles = fs
      .readdirSync(process.cwd())
      .filter((file) => !settings.files?.includes(file));

    const answers = (await inquirer.prompt([
      {
        type: "checkbox",
        name: "files",
        message: "Select files to add",
        choices: availableFiles,
      },
    ])) as { files: string[] };

    for (const file of answers.files) {
      await addItem([file]);
    }
    return;
  }

  for (const file of files) {
    const exists = fs.existsSync(file);
    const absolutePath = path.resolve(file);
    const isDir = fs.lstatSync(file).isDirectory();
    if (isDir) {
      const filesInDir = fs.readdirSync(file);
      const answers = (await inquirer.prompt([
        {
          type: "checkbox",
          name: "files",
          message: `Select files to add from "${file}" directory.:`,
          choices: filesInDir,
        },
      ])) as { files: string[] };

      for (const fileInDir of answers.files) {
        await addItem([path.join(file, fileInDir)]);
      }
      return;
    }

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

export async function removeItem(
  files: string[],
  filePath = DEFAULT_SETTINGS_FILE_PATH
): Promise<void> {
  const settings = getSettings(filePath);
  if (!files.length) {
    if (!settings.files?.length) {
      logger.error("No files to remove");
      return;
    }
    const answers = (await inquirer.prompt([
      {
        type: "checkbox",
        name: "files",
        message: "Select files to remove",
        choices: settings.files ?? [],
      },
    ])) as { files: string[] };
    for (const file of answers.files) {
      await removeItem([file]);
    }
    return;
  }

  for (const file of files) {
    if (settings.files?.includes(file)) {
      settings.files = settings.files.filter((f) => f !== file);
      saveSettings(settings, filePath);
    } else {
      logger.error(`${file} is not in the list:
      ${settings.files?.join("\n")}`);
      return;
    }
  }

  saveSettings(settings, filePath);
}

export function listFiles(filePath = DEFAULT_SETTINGS_FILE_PATH): void {
  const settings = getSettings(filePath);

  if (settings.files?.length) {
    for (const file of settings.files) {
      console.log(`${colors.green}• ${file}${colors.reset}`);
    }
  } else {
    logger.info(
      `${colors.yellow}No files added. You can use the "files add" command to add files to the list.${colors.reset}`
    );
  }
}

async function copyFilesToClipboard(): Promise<void> {
  const settings = getSettings();
  const text = await getFilesMessage(settings);
  writeToClipboard(text);
}

export type Operation = "add" | "remove" | "reset" | "list" | "copy";

export async function handleFilesCommand(
  // eslint-disable-next-line @typescript-eslint/default-param-last -- doesn't matter for commander function
  operation: Operation = "list",
  files: string[]
): Promise<void> {
  const settings = getSettings();

  switch (operation) {
    case "add":
      await addItem(files);
      break;
    case "remove":
      await removeItem(files);
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
      logger.info(`${colors.green}files copied to clipboard:${colors.reset}`);
      listFiles();

      process.exit(0);
  }
}

export function registerFilesCommands(program: Command): void {
  program
    .command("files [operation] [path...]")
    .description("Manage files")
    .action(handleFilesCommand)
    .on("--help", () => {
      console.log("Examples:");
      console.log(`   "ai files add"`);
      console.log(`   "ai files add ./path/to/file"`);
      console.log(`   "ai files remove"`);
      console.log(`   "ai files reset"`);
      console.log(`   "ai files list"`);
      console.log(`   "ai files copy" ~ copies files to clipboard`);
    });
}
