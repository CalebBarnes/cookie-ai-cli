import readline from "readline";
import { Command } from "commander";
import { initializeSettings } from "../settings/initialize-settings";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("initialize settings")
    .action(async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      await initializeSettings(rl);
      process.exit(0);
    });
}
