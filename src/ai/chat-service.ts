import { EventEmitter } from "node:events";
import { OpenAI } from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import { parse } from "best-effort-json-parser";
import { getSettings } from "../settings/get-settings.js";
import { type Settings } from "../settings/settings-schema.js";
import { getSystemInstructions } from "../system-instructions/get-system-instructions.js";
import { getBaseURL, getHeaders } from "./utils.js";

export class ChatService extends EventEmitter {
  private settings: Settings;
  private messages: ChatCompletionMessageParam[] = [];
  private client: OpenAI;

  constructor(options: { settingsFilePath?: string } = {}) {
    super();
    this.settings = getSettings(options.settingsFilePath);
    this.client = new OpenAI({
      apiKey: this.settings.openai?.key,
      baseURL: getBaseURL(this.settings),
      defaultHeaders: getHeaders(this.settings),
    });
  }

  async sendChat(message: string): Promise<unknown> {
    this.messages.push({ role: "user", content: message });

    const stream = await this.client.chat.completions.create({
      model: this.settings.openai?.model ?? "gpt-4",
      temperature: Number(this.settings.openai?.temperature ?? 0.7),
      response_format: { type: "json_object" },
      stream: true,
      messages: [
        { role: "system", content: await getSystemInstructions(this.settings) },
        ...this.messages,
      ],
    });

    let parsedJson: unknown;
    let response = "";

    for await (const chunk of stream) {
      const chunkContent = chunk.choices[0]?.delta?.content ?? "";
      response += chunkContent;
      if (response.length > 0) {
        parsedJson = parse(response);
        this.emit("message", parsedJson);
      }
    }

    this.messages.push({ role: "assistant", content: response });

    return parsedJson;
  }
}
