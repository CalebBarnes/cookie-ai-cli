import { OpenAI } from "openai";
import { getSettings } from "../settings/get-settings.js";
import { baseInstructions } from "../system-instructions/base-instructions.js";

const settings = getSettings();

const client = new OpenAI({
  apiKey: settings.openai?.key,
  baseURL: settings.custom?.endpoint,
});

const stream = await client.chat.completions.create({
  messages: [
    {
      role: "system",
      content: baseInstructions,
    },
    {
      role: "user",
      content: "What is my ip address?",
    },
  ],
  model: "gpt-4",
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
