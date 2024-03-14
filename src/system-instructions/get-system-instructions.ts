import path from "node:path";
import { getFilesMessage } from "../commands/files.js";
import { type Settings } from "../settings/settings-schema.js";
import { baseInstructions } from "./base-instructions.js";

export async function getSystemInstructions(
  settings: Settings
): Promise<string> {
  let instructions = baseInstructions;

  if (
    settings.files &&
    Array.isArray(settings.files) &&
    settings.files.length
  ) {
    const filesMessageContent = await getFilesMessage(settings);
    const relativeFiles = settings.files
      .map((file) => path.relative(process.cwd(), file))
      .join(`, `);
    instructions += `Current User watched files: ${relativeFiles}
${filesMessageContent}
`;
  } else {
    instructions += `Current User watched files: None, user can add files with the "ai files add" command, or AI can request access to files with the "request_file_access" action.
  `;
  }

  return instructions;
}
