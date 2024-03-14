import { type Settings } from "../settings/settings-schema.js";

export function getBaseURL(settings: Settings): string | undefined {
  if (settings.service === "openai") {
    return;
  }
  return settings.custom?.endpoint;
}

export function getHeaders(
  settings: Settings
): Record<string, string> | undefined {
  let headers;
  if (settings.custom?.headers) {
    headers = {};
    Object.assign(headers, settings.custom.headers);
  }
  return headers;
}
