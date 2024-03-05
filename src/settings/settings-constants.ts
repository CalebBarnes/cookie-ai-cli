import os from "node:os";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SETTINGS_FILE_PATH = `${os.homedir()}/.cookie-ai/settings.json`;

const __dirname = dirname(fileURLToPath(import.meta.url));

function getSchemaFilePath(): string {
  const possiblePaths = [
    path.join(__dirname, "ai-response-schema.ts"), // For development
    path.join(__dirname, "../ai-response-schema.ts"), // For production (if __dirname is inside /dist)
    path.join(__dirname, "../../src/ai-response-schema.ts"), // For tests (if tests are run from root or another directory)
  ];
  const existingPath = possiblePaths.find(fs.existsSync);
  if (!existingPath) {
    throw new Error(
      "ai-response-schema.ts file not found in expected locations."
    );
  }
  return existingPath;
}

const schemaString = fs.readFileSync(getSchemaFilePath(), "utf8");

export const baseInstructions = `
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

If you need to cd into a directory and then run a command, you can use the && operator because the cd command does not really work since you are running the command in a spawned process in Node.js with "spawn".
Example:
User Prompt: run the npm start in the my-project-directory directory
AI Response:
{
  "action": "command",
  "command": "cd my-project-directory && npm start",
  "description": "Changes the current working directory to the project directory and then runs the command"
}

Respond only in JSON that satisfies the Response type:
${schemaString}

User System Info:
${JSON.stringify({
  "os.arch()": os.arch(),
  "os.platform()": os.platform(),
  "os.type()": os.type(),
  "os.version()": os.version(),
})}

User Home Directory: ${os.homedir()}
Current Working Directory: ${process.cwd()}
Current Directory Files: ${fs
  .readdirSync(process.cwd())
  .map((f) => f)
  .join("\n ")}
`;
