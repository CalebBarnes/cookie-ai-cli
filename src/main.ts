#!/usr/bin/env bun
import readline from "readline";
import chalk from "chalk";
import { sendChat } from "./send-chat";
import { exec } from "node:child_process";

async function main() {
  let isDebug = false;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let userPrompt: string | undefined = process.argv.slice(2).join(" ");
  if (userPrompt?.includes("--debug")) {
    userPrompt = userPrompt.replace("--debug", "");
    isDebug = true;
  }

  if (!userPrompt) {
    userPrompt = await askQuestion(rl, "Enter your command: ");
  }

  // if (!userPrompt) {
  //   userPrompt = "rename my git branch";
  // }
  // if (!userPrompt && isDebug) {
  //   userPrompt = "list files in this dir";
  // }
  if (!userPrompt && isDebug) {
    userPrompt = "delete the file named index copy.ts";
  }

  // console.log(
  //   `\n${chalk.underline("user prompt")} ${chalk.green(userPrompt)}\n`
  // );

  const result = await sendChat(userPrompt);

  if (isDebug) {
    if (result?.action) {
      console.log(
        `${chalk.underline("action")} ${chalk.yellowBright(result.action)}`
      );
    }
    if (result?.description) {
      console.log(
        `${chalk.underline("description")} ${chalk.red(result.description)}\n`
      );
    }
    console.log({ result });
  }

  if (result.action === "command") {
    await handleCommand({
      rl,
      command: result.command,
      description: result.description,
    });
  }
  if (result.action === "command_list") {
    for (const command of result.commands) {
      await handleCommand({ rl, command, description: result.description });
    }
  }

  if (result.action === "user_info_required") {
    const values = {};
    for (const item of result.values) {
      const answer = await askQuestion(rl, item.label);
      values[item.value] = answer;
    }

    if (result.suggested_command_list) {
      for (const command of result.suggested_command_list) {
        await handleCommand({
          rl,
          command,
          values,
          description: result.description,
        });
      }
    }
    if (result.suggested_command) {
      await handleCommand({
        rl,
        command: result.suggested_command,
        values,
        description: result.description,
      });
    }
  }
}
main();

async function handleCommand({
  rl,
  command,
  values,
  description,
}: {
  rl: readline.Interface;
  command: string;
  values?: Record<string, string>;
  description?: string;
}) {
  let fullCommand = command;
  if (values) {
    fullCommand = command.replaceAll(/{(\w+)}/g, (_, match) => {
      const keyWithBraces = `{${match}}`; // Construct the key with curly braces
      return values[keyWithBraces] || `{${match}}`; // Replace with value or keep the placeholder if value is not found
    });
  }

  console.log(`${chalk.underline("command")}: ${chalk.green(fullCommand)}`);
  if (description) {
    console.log(`${chalk.yellow(description)}`);
  }

  const answer = await askQuestion(rl, `Run this command? (y/n) `);
  if (answer === "y") {
    exec(fullCommand, async (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        const result = await sendChat(error.message);
        console.log({ result });
        return;
      }

      console.log(stdout);

      if (stderr) {
        console.log("STDERR:", stderr);
      }
      process.exit(0);
      return;
    });
  } else {
    console.log("Command aborted.");
    process.exit(0);
  }
}

function askQuestion(rl, query): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    rl.question(chalk.green(query), (answer) => {
      if (answer) {
        resolve(answer);
      } else {
        resolve(undefined);
      }
    });
  });
}
