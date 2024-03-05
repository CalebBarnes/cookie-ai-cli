import { colors } from "./colors.js";

function debugLog(
  message: string | Record<string, unknown>,
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

  console[level](
    `${prefixColor}${prefix}${reset}${levelPrefix}${reset} ${messagePrefix}${
      typeof message === "object"
        ? `\n${JSON.stringify(message, null, 2)}`
        : message
    }${reset}`
  );
}

const debug = {
  log: (message: string, overridePrefix?: string) => {
    debugLog(message, "log", overridePrefix);
  },
  error: (message: string, overridePrefix?: string) => {
    debugLog(message, "error", overridePrefix);
  },
  warn: (message: string, overridePrefix?: string) => {
    debugLog(message, "warn", overridePrefix);
  },
  info: (message: string, overridePrefix?: string) => {
    debugLog(message, "info", overridePrefix);
  },
};

export { debug };
