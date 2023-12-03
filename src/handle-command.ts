import chalk from "chalk";
import { exec } from "node:child_process";
import { askQuestion } from "./ask-question";
import { sendChat } from "./send-chat";
import readline from "readline";

export async function handleCommand({
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
      console.log(chalk.green("Executing command: "), chalk.blue(fullCommand));
      const proc = exec(fullCommand, async (error, stdout, stderr) => {
        if (error) {
          await sendChat({ isError: true, message: error.message, rl });

          return;
        }

        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
      });

      // Listen to the close event
      proc.on("close", (code) => {
        if (code !== 0) {
          console.log(chalk.red("Command exited with error code: ", code));
        }

        resolve(code);
      });
    } else {
      console.log("Command aborted.");
      reject();
      process.exit(0);
    }
  });
}
