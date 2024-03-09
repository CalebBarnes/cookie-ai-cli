import { getFilesMessage } from "../commands/files";
import { getSettings } from "./get-settings";
import {
  DEFAULT_SETTINGS_FILE_PATH,
  baseInstructions,
} from "./settings-constants";

export async function getSystemInstructions(
  filePath = DEFAULT_SETTINGS_FILE_PATH
): Promise<string> {
  let instructions = baseInstructions;

  const settings = getSettings(filePath);

  if (
    settings.files &&
    Array.isArray(settings.files) &&
    settings.files.length
  ) {
    const filesMessageContent = await getFilesMessage();
    instructions += `Current User watched files: ${settings.files.join(", ")}
  
  ${filesMessageContent}
  `;
  } else {
    instructions += `Current User watched files: None, use the "files add" command to add files to watch
  `;
  }

  return instructions;
}
