#!/usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import { sendChat } from "./send-chat";
import { exec } from "child_process";

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let userPrompt: string | undefined = process.argv.slice(2).join(" ");
  if (!userPrompt) {
    userPrompt = await askQuestion(rl, "What do you want to do? ");
  }

  if (!userPrompt) {
    userPrompt = "rename my git branch";
  }

  console.log(
    `\n${chalk.underline("user prompt")} ${chalk.green(userPrompt)}\n`
  );

  const result = await sendChat(userPrompt);

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

  if (result.action === "user_info_required") {
    const values = {};
    for (const item of result.values) {
      const answer = await askQuestion(rl, item.label);
      values[item.value] = answer;
    }

    const fullCommand = result.suggested_command.replaceAll(
      /{(\w+)}/g,
      (_, match) => {
        const keyWithBraces = `{${match}}`; // Construct the key with curly braces
        return values[keyWithBraces] || `{${match}}`; // Replace with value or keep the placeholder if value is not found
      }
    );

    console.log(
      `\n${chalk.underline("full command")} ${chalk.green(fullCommand)}\n`
    );

    const answer = await askQuestion(rl, `Run this command? (y/n) `);
    if (answer === "y") {
      const proc = Bun.spawn(["echo", "hello"]);
    } else {
      console.log("Command aborted.");
    }
  }
}
main();

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
