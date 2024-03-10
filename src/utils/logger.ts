import { createLogger, format, transports } from "winston";
import { type TransformableInfo } from "logform";

const { errors, combine, printf, colorize, timestamp } = format;

const formatMessage = printf((info: TransformableInfo) => {
  const prefix = `${info.level} `;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe to assume
  let message = info.message;
  if (
    typeof info.message === "object" ||
    Array.isArray(info.message) ||
    typeof info.message === "number" ||
    typeof info.message === "boolean"
  ) {
    message = JSON.stringify(info.message, null, 2);
  }
  return `${prefix} ${message}`;
});

export const logger = createLogger({
  level: process.argv.includes("--debug")
    ? "debug"
    : process.env.LOG_LEVEL ?? "info",
  format: combine(
    colorize({ all: false }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    errors({ stack: true }),
    formatMessage
  ),
  transports: [new transports.Console()],
});
