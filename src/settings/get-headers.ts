import { type Settings } from "./settings-schema.js";

export function getHeaders(settings: Settings): Record<string, string> {
  const headers = {
    "Content-Type": "application/json",
  } as Record<string, string>;

  if (settings.service === "openai") {
    headers.Authorization = `Bearer ${settings.openai?.key}`;
  }
  if (settings.custom?.headers) {
    Object.assign(headers, settings.custom.headers);
  }
  return headers;
}
