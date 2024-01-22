import { Settings } from "./settings-schema";

export function getHeaders(settings: Settings) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (settings.service === "openai") {
    headers["Authorization"] = `Bearer ${settings.openai?.key}`;
  }
  if (settings.headers) {
    Object.assign(headers, settings.headers);
  }
  return headers;
}
