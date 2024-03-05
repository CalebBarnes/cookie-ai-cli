import { spawn } from "node:child_process";
import { sendChat } from "./send-chat.js";
import { colors } from "./utils/colors.js";
import { promptUser } from "./prompt-user.js";
import { askQuestion } from "./ask-question.js";

export async function handleCommand({
  command,
  values,
  description,
}: {
  command: string;
  values?: Record<string, string>;
  description?: string;
}): Promise<void> {
  let fullCommand = command;
  if (values) {
    fullCommand = command.replaceAll(/{(?<temp1>\w+)}/g, (_, match) => {
      const keyWithBraces = `{${match}}`; // Construct the key with curly braces
      return values[keyWithBraces] ?? `{${match}}`; // Replace with value or keep the placeholder if value is not found
    });
  }
  console.log(`command: ${colors.red}${fullCommand}${colors.reset}`);
  if (description) {
    console.log(`description: ${colors.yellow}${description}${colors.reset}`);
  }

  const answer = await askQuestion(
    `Run this command? (y/n/r) ${colors.darkGrey} (y: yes, n: no, r: revise command)`
  );

  switch (answer) {
    case "y": {
      await spawnProcAndExecuteCommand(fullCommand);
      return;
    }

    case "n": {
      console.log("Command aborted.");
      break;
    }

    case "r": {
      await promptUser();
      break;
    }
    default: {
      console.log("Command aborted.");
      break;
    }
  }
}

function spawnProcAndExecuteCommand(
  command: string
): Promise<number | null | undefined> {
  return new Promise((resolve, reject) => {
    console.log(
      "Executing command: ",
      `${colors.blue}${command}${colors.reset}`
    );

    const [bin, ...args] = command.split(" ");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- bin is not null
    const proc = spawn(bin!, args, {
      stdio: ["inherit", "inherit", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    let stderrOutput = "";
    proc.stderr.on("data", (data: Buffer) => {
      console.log(data.toString());
      stderrOutput += data.toString();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- close event is not a promise
    proc.on("close", (code) => {
      if (code !== 0) {
        console.log(
          `${colors.red}Command exited with error code: ${code}${colors.reset}`
        );
        return sendChat({
          isError: true,
          message: `Command exited with error code: ${code}\n${stderrOutput}`,
        });
      }
      console.log(``);
      resolve(code);
    });

    process.on("SIGINT", () => {
      // Kill the spawned child processes and parent process if the user presses Ctrl+C
      proc.kill("SIGINT");
      reject(new Error("Command aborted by user"));
      process.exit(0);
    });
  });
}
