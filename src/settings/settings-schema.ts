import { z } from "zod";
import { debug } from "../utils/debug-log";
import { settingsDir } from "./settings-constants";

const errors = {
  OPENAI_KEY_REQUIRED: "'openai.key' is required when using service 'openai'",
  ENDPOINT_REQUIRED: "'endpoint' is required when using service 'custom'",
};

const openaiSchema = z.object({
  key: z.string({
    required_error: errors.OPENAI_KEY_REQUIRED,
  }),
});
const customSchema = z.object({
  payload: z.record(z.string()).optional(),
});

export const settingsSchema = z
  .object({
    endpoint: z.string().url().optional(),
    service: z.enum(["custom", "openai"]),
    model: z.string({
      required_error: "'model' is required. (example: 'gpt-4')",
    }),
    openai: openaiSchema.optional(),
    custom: customSchema.optional(),
    headers: z.record(z.string()).optional(),
  })
  .refine((data) => data.service !== "openai" || data.openai, {
    message: errors.OPENAI_KEY_REQUIRED,
    path: ["openai"],
  })
  .refine((data) => data.service !== "custom" || data.endpoint, {
    message: errors.ENDPOINT_REQUIRED,
    path: ["endpoint"],
  });

export type Settings = z.infer<typeof settingsSchema>;

export function validateSettings(settings: Settings) {
  const result = settingsSchema.safeParse(settings);
  if (!result.success) {
    for (const error of result.error.issues) {
      debug.error(`settings.json: ${error.message}\n
You can edit your settings file at file://${settingsDir}
or run 'ai --init' to re-initialize your settings.\n`);
    }
    process.exit(1);
  }
}
