import { Command } from "commander";
import { initializeSettings } from "../settings/initialize-settings.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("initialize settings")
    .action(async () => {
      await initializeSettings();
      process.exit(0);
    });
}
