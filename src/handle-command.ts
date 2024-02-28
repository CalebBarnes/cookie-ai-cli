import { spawn } from "node:child_process";
import { askQuestion } from "./ask-question";
import { sendChat } from "./send-chat";
import { Interface } from "readline";
import { colors } from "./utils/colors";

export async function handleCommand({
  rl,
  command,
  values,
  description,
}: {
  rl: Interface;
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
    console.log(`command: ${colors.red}${fullCommand}${colors.reset}`);
    if (description) {
      console.log(`description: ${colors.yellow}${description}${colors.reset}`);
    }

    const answer = await askQuestion(rl, `Run this command? (y/n) `);

    if (answer === "y") {
      console.log(
        "Executing command: ",
        `${colors.blue}${fullCommand}${colors.reset}`
      );

      const [bin, ...args] = fullCommand.split(" ");
      const proc = spawn(bin, args, {
        stdio: ["inherit", "inherit", "pipe"],
        shell: true,
        cwd: process.cwd(),
      });

      let stderrOutput = "";
      proc.stderr.on("data", (data) => {
        console.log(data.toString());
        stderrOutput += data.toString();
      });

      // Listen to the close event
      proc.on("close", async (code) => {
        if (code !== 0) {
          console.log(
            `${colors.red}Command exited with error code: ${code}${colors.reset}`
          );
          await sendChat({
            isError: true,
            message: `Command exited with error code: ${code}\n${stderrOutput}`,
            rl,
          });
        }
        console.log(``);
        resolve(code);
      });

      process.on("SIGINT", () => {
        // Kill the spawned child processes and parent process if the user presses Ctrl+C
        proc.kill("SIGINT");
        reject();
        process.exit(0);
      });
    } else {
      console.log("Command aborted.");
      reject();
      process.exit(0);
    }
  });
}
