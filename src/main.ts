#!/usr/bin/env bun
import readline from "readline";
import chalk from "chalk";
import { sendChat } from "./send-chat";
import { exec } from "node:child_process";

async function promptUser({ rl }) {
  let answer = await askQuestion(rl, "Enter your command: ");
  await sendChat({ message: answer, rl });
  return answer;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let userPrompt: string | undefined = process.argv.slice(2).join(" ");
  if (userPrompt?.includes("--debug")) {
    userPrompt = userPrompt.replace("--debug", "");
  }

  if (!userPrompt) {
    await promptUser({ rl });
  } else {
    await sendChat({ message: userPrompt, rl });
  }
}
main();

export async function handleAction({ result, rl }) {
  if (result.action === "command") {
    await handleCommand({
      rl,
      command: result.command,
      description: result.description,
    });
  } else if (result.action === "command_list") {
    for (const command of result.commands) {
      await handleCommand({
        rl,
        command,
        description: result.description,
      });
    }
  } else if (result.action === "user_info_required") {
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
  } else {
    console.log(
      chalk.red("AI tried to use an unsupported action, telling AI to retry: "),
      result.action
    );
    await sendChat({
      message: `${result.action} is not a supported action. Make sure you respond only with JSON that satisfies the Response type.`,
      rl,
    });
  }
  promptUser({ rl });
}

async function handleCommand({
  rl,
  command,
  values,
  description,
  commandFinishedCallback,
}: {
  rl: readline.Interface;
  command: string;
  values?: Record<string, string>;
  description?: string;
  commandFinishedCallback?: () => void;
}) {
  return new Promise(async (resolve, reject) => {
    let fullCommand = command;
    if (values) {
      fullCommand = command.replaceAll(/{(\w+)}/g, (_, match) => {
        const keyWithBraces = `{${match}}`; // Construct the key with curly braces
        return values[keyWithBraces] || `{${match}}`; // Replace with value or keep the placeholder if value is not found
      });
    }

    console.log(`${chalk.underline("command")}: ${chalk.red(fullCommand)}`);
    if (description) {
      console.log(
        `${chalk.underline("description")}: ${chalk.yellow(description)}`
      );
    }

    const answer = await askQuestion(rl, `Run this command? (y/n) `);
    if (answer === "y") {
      const proc = exec(fullCommand, async (error, stdout, stderr) => {
        if (error) {
          // console.log(`error: ${error.message}`);
          await sendChat({ isError: true, message: error.message, rl });
          // console.log({ result });
          return;
        }

        console.log(chalk.green("\nCommand executed: ", fullCommand, "\n"));
        console.log(stdout);
        console.log(stderr);
      });

      // Listen to the close event
      proc.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
        commandFinishedCallback?.();
        resolve(code);
        // Perform any cleanup or additional actions needed after process exit
      });
    } else {
      console.log("Command aborted.");
      reject();
      process.exit(0);
    }
  });
}

function askQuestion(rl, query): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    rl.question(chalk.cyan(query), (answer) => {
      if (answer) {
        resolve(answer);
      } else {
        resolve(undefined);
      }
    });
  });
}
