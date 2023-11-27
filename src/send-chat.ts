import fs from "fs";
import path from "path";
import { type Response } from "./response-schema";

const schema = fs.readFileSync(
  path.join(__dirname, "response-schema.ts"),
  "utf8"
);

const systemInstructions = `
You are an AI Terminal Assistant. 
Used to automate cli commands for users who prompt with natural language.
Your responses will be automatically parsed by a tool using JSON.parse().

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

export async function sendChat(message: string): Promise<Response> {
  // const spinner = ora({
  //   text: "Thinking...",
  //   spinner: cliSpinners.dots,
  //   color: "green",
  // }).start();

  const content = await getResponse(message);
  const isJson: boolean = content?.includes("{");

  let result: Response;

  if (isJson) {
    const json = content?.slice(
      content.indexOf("{"),
      content.lastIndexOf("}") + 1
    );

    try {
      result = JSON.parse(json);
      // spinner.stop();
    } catch (error) {
      result = { action: "error", message: "AI result was not valid JSON" };
      console.log({ content });

      // spinner.fail("Result is not valid JSON");
    }
  } else {
    result = { action: "error", message: "AI result was not valid JSON" };
    console.log("no json { detected");
    console.log({ content });

    // spinner.fail("Result is not valid JSON");
  }
  return result;
}

const getResponse = async (message: string) => {
  const payload = { ...baseData };
  payload.messages.push({
    role: "user",
    content: message,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  return content;
};

const url = "http://192.168.8.162:5000/v1/chat/completions";
const baseData = {
  model: "gpt-3.5-turbo",
  messages: [{ role: "system", content: systemInstructions }],
  temperature: 0.7,
  mode: "instruct",
  instruction_template: "Alpaca",
  response_format: { type: "json_object" },
};
