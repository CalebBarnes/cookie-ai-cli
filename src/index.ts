#!/usr/bin/env node
import { Command } from "commander";
import { version } from "../package.json" assert { type: "json" };
import { registerInitCommand } from "./commands/init.js";
import { registerPromptCommand } from "./commands/prompt.js";
import { registerFilesCommands } from "./commands/files.js";

export const program = new Command();
program.version(version);
program.option("-d, --debug", "output extra debugging");

registerInitCommand(program);
registerPromptCommand(program);
registerFilesCommands(program);

program.parse(process.argv);

export const options = program.opts();
