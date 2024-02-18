#!/usr/bin/env node
import readline from "readline";
import { sendChat } from "./send-chat";
import { initializeSettings } from "./settings/initialize-settings";
import { promptUser } from "./prompt-user";
import packageJson from "../package.json";

export const isDebug = process.argv.includes("--debug");

async function main() {
  if (process.argv.includes("--version")) {
    console.log(packageJson.version);
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let userPrompt: string | undefined = process.argv.slice(2).join(" ");
  if (userPrompt?.includes("--debug")) {
    userPrompt = userPrompt.replace("--debug", "");
  }

  if (userPrompt.includes("--init")) {
    await initializeSettings(rl);
  }

  if (!userPrompt) {
    await promptUser({ rl });
  } else {
    await sendChat({ message: userPrompt, rl });
  }
}
main();
