import fs from "fs";
import path from "path";
import { type Response } from "./response-schema";
import chalk from "chalk";
import { handleAction } from "./main";

const schema = fs.readFileSync(
  path.join(__dirname, "response-schema.ts"),
  "utf8"
);

const systemInstructions = `
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
${schema}
`;

const url = "http://192.168.8.162:5000/v1/chat/completions";

let payload = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "system", content: systemInstructions }],
  temperature: 0.7,
  mode: "instruct",
  instruction_template: "Alpaca",
  response_format: { type: "json_object" },
};

export async function sendChat({
  message,
  rl,
  isError,
}: {
  message: string;
  rl: any;
  isError?: boolean;
}): Promise<Response> {
  const isDebug = process.argv.slice(2).join(" ").includes("--debug");
  if (isDebug) {
    console.log(chalk.cyan("user: "), message);
  }
  payload.messages.push({
    role: !isError ? "user" : "system",
    content: !isError ? message : `error with last command: ${message}`,
  });

  // console.log({ payload });
  console.log(chalk.yellow("🤔 AI thinking..."));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log(chalk.green("✅ AI responded!"));

  const responseJson = await response.json();
  const aiResponseContent = responseJson?.choices?.[0]?.message?.content;
  payload.messages.push(responseJson?.choices?.[0]?.message);
  // console.log("aiResponseContent: ");
  // console.log(aiResponseContent);

  let pamperedResponseData; // Response;

  const json = aiResponseContent?.slice(
    aiResponseContent.indexOf("{"),
    aiResponseContent.lastIndexOf("}") + 1
  );

  try {
    pamperedResponseData = JSON.parse(json);
    await handleAction({ result: pamperedResponseData, rl });
  } catch (error) {
    console.log(chalk.red("Result is not valid JSON, failed to parse"));

    sendChat({
      isError: true,
      message: "Your response was not valid JSON. Please try again.",
      rl,
    });
  }

  return pamperedResponseData;
}
