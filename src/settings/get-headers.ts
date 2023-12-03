import { Settings } from "./get-settings";

export function getHeaders(settings: Settings) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (settings.service === "openai") {
    headers["Authorization"] = `Bearer ${settings.openai?.key}`;
  }

  if (settings.service === "cloudflare") {
    headers["CF-Access-Client-Id"] = settings.cloudflare?.client_id;
    headers["CF-Access-Client-Secret"] = settings.cloudflare?.client_secret;
  }

  if (settings.headers) {
    Object.assign(headers, settings.headers);
  }

  return headers;
}

export function getEndpoint(settings: Settings): string {
  if (settings.service === "openai") {
    return "https://api.openai.com/v1/chat/completions";
  }

  if (settings.endpoint) {
    return settings.endpoint;
  }

  console.error(`Failed to resolve endpoint from settings: ${settings}`);
  return "";
}
