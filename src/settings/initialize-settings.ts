import inquirer from "inquirer";
import { logger } from "../utils/logger.js";
import { saveSettings } from "./save-settings.js";
import { DEFAULT_SETTINGS_FILE_PATH } from "./settings-constants.js";
import { type Settings, services } from "./settings-schema.js";

type Choice = string | inquirer.Separator;
interface Question {
  type: string;
  name: string;
  message: string;
  choices?: Choice[];
  default?: string;
  mask?: string;
  when?: (answers: Answers) => boolean;
  validate?: (input: string) => string | boolean;
}

type Answers =
  | {
      service: "openai";
      openai: {
        key: string;
        model: string;
        temperature: string;
      };
    }
  | {
      service: "custom";
      custom: {
        endpoint: string;
        headers: Record<string, string>;
        payload: Record<string, string>;
      };
    };

export async function initializeSettings(
  settingsPath = DEFAULT_SETTINGS_FILE_PATH
): Promise<void> {
  const newSettings: Settings = {
    service: services[0],
  };

  const questions: Question[] = [
    {
      type: "list",
      name: "service",
      message: "Select the API service to use: ",
      choices: [...services],
      default: services[0],
    },
    {
      type: "password",
      name: "openai.key",
      message: "Enter your OpenAI API key: ",
      when: (answers: Answers) => answers.service === "openai",
      mask: "*",
      validate: (input: string) =>
        Boolean(input) || "API key is required to use OpenAI service.",
    },
    {
      type: "input",
      name: "openai.model",
      message: "Enter your model: ",
      default: "gpt-4",
      when: (answers: Answers) => answers.service === "openai",
    },
    {
      type: "input",
      name: "openai.temperature",
      message: "Temperature: ",
      when: (answers: Answers) => answers.service === "openai",
      default: "0.7",
    },

    {
      type: "input",
      name: "custom.endpoint",
      message: "Enter the API endpoint: ",
      when: (answers: Answers) => answers.service === "custom",
      validate: (input: string) => {
        if (!input) {
          return "API endpoint is required for custom service.";
        }
        const _url = new URL(input);
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  Object.assign(newSettings, answers);

  if (newSettings.service === "custom" && newSettings.custom) {
    const addCustomHeaders = (await inquirer.prompt([
      {
        type: "confirm",
        name: "addHeaders",
        message: "Do you want to add custom headers to each request?",
      },
    ])) as { addHeaders: boolean };

    if (addCustomHeaders.addHeaders) {
      newSettings.custom.headers = await getItems("header");
    }

    const addCustomPayload = (await inquirer.prompt([
      {
        type: "confirm",
        name: "addPayload",
        message: "Do you want to add key-value pairs to each request payload?",
      },
    ])) as { addPayload: boolean };

    if (addCustomPayload.addPayload) {
      newSettings.custom.payload = await getItems("payload");
    }
  }

  logger.info(`Saving settings at ${settingsPath}`);
  saveSettings(newSettings, settingsPath);
}

async function getItems(label: string): Promise<Record<string, string>> {
  const items = {} as Record<string, string>;

  const getItem = async (): Promise<void> => {
    const item = (await inquirer.prompt([
      {
        type: "input",
        name: "key",
        message: `Enter the ${label} key: `,
      },
      {
        type: "input",
        name: "value",
        message: `Enter the ${label} value: `,
      },
      {
        type: "confirm",
        name: "askAgain",
        message: `Do you want to enter another ${label}?`,
        default: true,
      },
    ])) as { key: string; value: string; askAgain: boolean };

    if (typeof item.key === "string" && typeof item.value === "string") {
      items[item.key] = item.value;
    }
    if (item.askAgain) {
      await getItem();
    }
  };

  await getItem();

  return items;
}
