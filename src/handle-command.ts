import { spawn } from "node:child_process";
import { colors } from "./utils/colors.js";
import { logger } from "./utils/logger.js";
import { type CommandMessageContent } from "./ai-response-schema.js";

export function handleCommand(
  response: CommandMessageContent,
  onProcClosedWithError?: (code: number | null, stderrOutput: string) => void
): Promise<
  | { success: boolean }
  | { success: false; error: { code: number | null; stderrOutput: string } }
> {
  const { command } = response;

  return new Promise((resolve, reject) => {
    logger.info(`Executing command: ${colors.blue}${command}${colors.reset}`);

    const [bin, ...args] = command.split(" ");

    const proc = spawn(bin!, args, {
      stdio: ["inherit", "inherit", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    let stderrOutput = "";
    proc.stderr.on("data", (data: Buffer) => {
      try {
        console.log(data.toString());
        stderrOutput += data.toString();
      } catch (err: unknown) {
        console.log("err reading proc stderr", err);
      }
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        logger.info(
          "TODO: handle prompting AI X amount of times in a row if the error exits with non zero code"
        );
        logger.error(`Command exited with error code: ${code}`);
        return onProcClosedWithError?.(code, stderrOutput);
      }

      console.log("");
      resolve({ success: true });
    });

    process.on("SIGINT", () => {
      // Kill the spawned child processes and parent process if the user presses Ctrl+C
      proc.kill("SIGINT");
      reject(new Error("Command aborted by user"));
      process.exit(0);
    });
  });
}

// function spawnProcAndExecuteCommand(
//   command: string,
//   onProcClosedWithError?: (code: number | null, stderrOutput: string) => void
// ): Promise<
//   | { success: true }
//   | { success: false; error: { code: number | null; stderrOutput: string } }
// > {

// }

// function getFullCommand(
//   command: string,
//   values?: Record<string, string>
// ): string {
//   let fullCommand = command;
//   if (values) {
//     fullCommand = command.replaceAll(/{(?<temp1>\w+)}/g, (_, match) => {
//       const keyWithBraces = `{${match}}`;
//       return values[keyWithBraces] ?? `{${match}}`;
//     });
//   }
//   return fullCommand;
// }
