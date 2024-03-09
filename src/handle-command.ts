import { spawn } from "node:child_process";
import { askQuestion } from "./ask-question";
import { colors } from "./utils/colors";
import { logger } from "./utils/debug-log";

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
      const keyWithBraces = `{${match}}`; // Construct the key with curly braces
      return values[keyWithBraces] ?? `{${match}}`; // Replace with value or keep the placeholder if value is not found
    });
  }
  logger.log(`command: ${colors.red}${fullCommand}${colors.reset}`);
  if (description) {
    logger.log(`description: ${colors.yellow}${description}${colors.reset}`);
  }

  const answer = await askQuestion(
    `Run this command? (y/n/r) ${colors.darkGrey} (y: yes, n: no, r: revise command)`
  );

  switch (answer) {
    case "y": {
      await spawnProcAndExecuteCommand(fullCommand, onProcClosedWithError);
      return;
    }

    case "n": {
      logger.log("Command aborted.");
      break;
    }

    case "r": {
      // const answer = await askQuestion("Revise command: ");
      // await sendChat({ message: `Revise command: ${answer}` });
      logger.log("Command aborted.");
      break;
    }
    default: {
      logger.log("Command aborted.");
      break;
    }
  }
}

function spawnProcAndExecuteCommand(
  command: string,
  onProcClosedWithError?: (code: number | null, stderrOutput: string) => void
): Promise<number | null | undefined> {
  return new Promise((resolve, reject) => {
    logger.log(`Executing command: ${colors.blue}${command}${colors.reset}`);

    const [bin, ...args] = command.split(" ");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- bin is not null
    const proc = spawn(bin!, args, {
      stdio: ["inherit", "inherit", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    let stderrOutput = "";
    proc.stderr.on("data", (data: Buffer) => {
      logger.log(data.toString());
      stderrOutput += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        logger.log(
          `${colors.red}Command exited with error code: ${code}${colors.reset}`
        );
        onProcClosedWithError?.(code, stderrOutput);
        // return sendChat({
        //   isError: true,
        //   message: `Command exited with error code: ${code}\n${stderrOutput}`,
        // });
      }
      logger.log(``, "");
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
