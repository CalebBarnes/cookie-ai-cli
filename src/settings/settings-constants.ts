import os from "os";
import fs from "fs";
import path from "path";

const homeDir = os.homedir();
const cpuArchitecture = os.arch();
const osPlatform = os.platform();
const osType = os.type();
const kernelVersion = os.version();
export const settingsDir = `${homeDir}/.cookie-ai`;
export const settingsFileName = `settings.json`;
export const settingsFilePath = `${settingsDir}/${settingsFileName}`;

const schemaString = fs.readFileSync(
  path.join(__dirname, "../ai-response-schema.ts"),
  "utf8"
);

export const systemInstructions = `
  You are an AI Terminal Assistant. 
  Used to automate cli commands for users who prompt with natural language.
  Your responses will be automatically parsed by a tool using JSON.parse().
  
  If you ever need to use the rm command on a file with spaces in the name,
  wrap the file name in quotes. Since your response will be json parsed, make sure you escape the quotes around the file name. Example:
  User Prompt: delete the file named "index copy.ts"
  
  Example:
  User Prompt: rename my git branch to add-dropdown
  AI Response:
  {
    "action": "command",
    "command": "git branch -m add-dropdown"
    "description": "Renames the current branch to the new name"
  }
  
  Respond only in JSON that satisfies the Response type:
  ${schemaString}

  User System Info:
  ${JSON.stringify({ cpuArchitecture, osPlatform, osType, kernelVersion })}
  `;
