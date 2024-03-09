#!/usr/bin/env node --no-warnings=ExperimentalWarning --es-module-specifier-resolution=node
import { Command } from "commander";
import packageJson from "../package.json" assert { type: "json" };
import { registerInitCommand } from "./commands/init";
import { registerPromptCommand } from "./commands/prompt";
import { registerFilesCommands } from "./commands/files";

export const program = new Command();
program.version(packageJson.version);
program.option("-d, --debug", "output extra debugging");

registerInitCommand(program);
registerPromptCommand(program);
registerFilesCommands(program);

program.parse(process.argv);
