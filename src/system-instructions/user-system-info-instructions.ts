import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { type Plugin } from "./plugin-types.js";

export const userSystemInfoPlugin: Plugin = {
  name: "user-system-info",
  description:
    "Loads info about the system like the OS, current working directory, and more.",
  instructions: `
User System Info:
${JSON.stringify({
  "os.arch()": os.arch(),
  "os.platform()": os.platform(),
  "os.type()": os.type(),
  "os.version()": os.version(),
})}
User's Home Directory: ${os.homedir()}
The current working directory right now: ${process.cwd()}
These are the files in current working directory where this command is being executed: 
${getCwdFiles()}
If the user directly asks a question related to one of these files, and you do not already see the contents of it, then you can use the "request_file_access" action to request access to the file.
Use the "request_file_access" action if your command suggestion depends on the contents of a file that you do not have access to yet.
`,
};

function getFiles(
  dir: string,
  depth = 0,
  maxDepth = 4,
  exclude: string[] = ["node_modules", ".git"]
): string[] {
  if (depth > maxDepth) return [];
  const files: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(process.cwd(), fullPath);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!exclude.some((excludedDir) => fullPath.includes(excludedDir))) {
        files.push(...getFiles(relativePath, depth + 1, maxDepth, exclude));
      }
    } else {
      files.push(relativePath);
    }
  });
  return files;
}

function getCwdFiles(
  {
    exclude = ["node_modules", ".git"],
  }: {
    exclude?: string[];
  } = {
    exclude: ["node_modules", ".git"],
  }
): string {
  const cwdFiles = getFiles(process.cwd(), 0, 4, exclude).join(`
`);
  return cwdFiles;
}
