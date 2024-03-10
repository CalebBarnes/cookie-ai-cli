import { spawn } from "node:child_process";
import { askQuestion } from "./ask-question.js";
import { colors } from "./utils/colors.js";
import { logger } from "./utils/logger.js";

export async function handleCommand({
  command,
  values,
  description,
  onProcClosedWithError,
}: {
  command: string;
  values?: Record<string, string>;
  description?: string;
  onProcClosedWithError?: (code: number | null, stderrOutput: string) => void;
}): Promise<void> {
  let fullCommand = command;
  if (values) {
    fullCommand = command.replaceAll(/{(?<temp1>\w+)}/g, (_, match) => {
      const keyWithBraces = `{${match}}`;
      return values[keyWithBraces] ?? `{${match}}`;
    });
  }

  console.log(`command: ${colors.red}${fullCommand}${colors.reset}`, "");
  if (description) {
    console.log(`description: ${colors.yellow}${description}${colors.reset}`);
  }

  const answer = await askQuestion(
    `Run this command? (y/n/r) ${colors.darkGrey} (y: yes, n: no, r: revise command)${colors.reset}`
  );

  switch (answer) {
    case "y": {
      await spawnProcAndExecuteCommand(fullCommand, onProcClosedWithError);
      return;
    }

    case "n": {
      logger.info("Command aborted.");
      break;
    }

    case "r": {
      break;
    }
    default: {
      logger.info("Command aborted.");
      break;
    }
  }
}

function spawnProcAndExecuteCommand(
  command: string,
  onProcClosedWithError?: (code: number | null, stderrOutput: string) => void
): Promise<number | null | undefined> {
  return new Promise((resolve, reject) => {
    logger.info(`Executing command: ${colors.blue}${command}${colors.reset}`);

    const [bin, ...args] = command.split(" ");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- bin is not null
    const proc = spawn(bin!, args, {
      stdio: ["inherit", "inherit", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    let stderrOutput = "";
    proc.stderr.on("data", (data: Buffer) => {
      console.log("data.toString()", data.toString());
      stderrOutput += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        logger.error(`Command exited with error code: ${code}`);
        onProcClosedWithError?.(code, stderrOutput);
        logger.info(
          "TODO: handle prompting AI X amount of times in a row if the error exits with non zero code"
        );
        // todo: handle prompting AI X amount of times in a row if the error exits with non zero code
        // return sendChat({
        //   isError: true,
        //   message: `Command exited with error code: ${code}\n${stderrOutput}`,
        // });
      }

      console.log("");
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
