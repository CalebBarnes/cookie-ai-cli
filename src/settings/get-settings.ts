import chalk from "chalk";
import { initializeSettings } from "./initialize-settings";
import { settingsFilePath } from "./settings-constants";
import fs from "fs";
import readline from "readline";

export async function getSettings({
  rl,
}: {
  rl: readline.Interface;
}): Promise<Settings> {
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
  } catch (error) {
    console.log(chalk.red(`Settings file not found. at ${settingsFilePath}`));
    await initializeSettings(rl);
  }

  if (settings) {
    try {
      validateSettings(settings);
      return settings;
    } catch (err: any) {
      console.log(
        chalk.red(`Error validating settings at ${settingsFilePath}`)
      );
      console.log(chalk.red(err?.message));
      process.exit(1);
    }
  }

  return settings;
}

export const services = ["custom", "cloudflare", "openai"] as const;

export type Settings = {
  /**
   * The endpoint of the server
   */
  endpoint?: string;

  /**
   * The service to use for the request
   */
  service?: (typeof services)[number];

  /**
   * The AI model to use for the request
   * @default gpt-3.5-turbo
   */
  model?: string;

  /**
   * Your API key for OpenAI
   */
  openai?: {
    key: string;
  };

  /**
   * The client id and secret for cloudflare service token authentication
   */
  cloudflare?: {
    client_id: string;
    client_secret: string;
  };

  /**
   * Any additional headers to send with the request
   */
  headers?: {
    [key: string]: string;
  };
};

function validateSettings(settings) {
  if (
    (settings.service === "custom" || settings.service === "cloudflare") &&
    !settings.endpoint
  ) {
    throw new Error(
      `"endpoint" is required when using service "${settings.service}".`
    );
  }
  if (!settings.service) {
    throw new Error(
      `"service" is required. Must be one of ${services.join(", ")}`
    );
  }
  if (settings.service === "openai" && !settings.openai) {
    throw new Error(`OpenAI settings are required when using "openai" service`);
  }
  if (settings.service === "cloudflare" && !settings.cloudflare) {
    throw new Error(
      `Cloudflare settings are required when using "cloudflare" service`
    );
  }
  if (settings.service === "cloudflare" && !settings.cloudflare.client_id) {
    throw new Error(
      `cloudflare.client_id is required when using "cloudflare" service`
    );
  }
  if (settings.service === "cloudflare" && !settings.cloudflare.client_secret) {
    throw new Error(
      `cloudflare.client_secret is required when using "cloudflare" service`
    );
  }
  if (settings.service === "openai" && !settings.openai.key) {
    throw new Error(`OpenAI api_key is required when using "openai" service`);
  }
}
