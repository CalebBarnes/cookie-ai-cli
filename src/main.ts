#!/usr/bin/env node
import { Command } from "commander";
import packageJson from "../package.json";
import { registerInitCommand } from "./commands/init";
import { registerPromptCommand } from "./commands/prompt";

export const program = new Command();
program.version(packageJson.version);
program.option("-d, --debug", "output extra debugging");

registerInitCommand(program);
registerPromptCommand(program);

program.parse(process.argv);

export const options = program.opts();
