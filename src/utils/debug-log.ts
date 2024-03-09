import { colors } from "./colors";

type Message = unknown;

function debugLog(
  message: Message,
  level: "error" | "log" | "warn" | "info" = "log",
  overridePrefix?: string
): void {
  const prefix = overridePrefix ?? "[cookie-ai-cli]";
  const prefixColor = "\x1b[32m";

  const messagePrefix = (() => {
    switch (level) {
      case "error":
        return colors.red;
      case "warn":
        return colors.yellow;
      case "info":
        return colors.cyan;
      default:
        return "";
    }
  })();

  const reset = "\x1b[0m"; // Resets the color

  const levelPrefix = (() => {
    switch (level) {
      case "error":
        return colors.red;
      case "warn":
        return colors.yellow;
      default:
        return "";
    }
  })();

  let messageString;
  if (typeof message === "string") {
    messageString = message;
  }
  if (typeof message === "object" || Array.isArray(message)) {
    messageString = JSON.stringify(message, null, 2);
  }

  if (
    typeof messageString === "string" ||
    typeof messageString === "number" ||
    typeof messageString === "boolean"
  ) {
    // eslint-disable-next-line no-console -- We are logging to the console
    console[level](
      `${prefixColor}${prefix}${reset}${levelPrefix}${reset} ${messagePrefix}${messageString}${reset}`
    );
  }
}

const logger = {
  log: (message: Message, overridePrefix?: string) => {
    debugLog(message, "log", overridePrefix);
  },
  error: (message: Message, overridePrefix?: string) => {
    debugLog(message, "error", overridePrefix);
  },
  warn: (message: Message, overridePrefix?: string) => {
    debugLog(message, "warn", overridePrefix);
  },
  info: (message: Message, overridePrefix?: string) => {
    debugLog(message, "info", overridePrefix);
  },
};

export { logger };
