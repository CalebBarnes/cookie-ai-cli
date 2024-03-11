import { z } from "zod";

export const services = ["openai", "custom"] as const;
export const errors = {
  OPENAI_KEY_REQUIRED: "'openai.key' is required when using service 'openai'",
  MODEL_REQUIRED: "'openai.model' is required . (example: 'gpt-4')",
  ENDPOINT_REQUIRED:
    "'custom.endpoint' is required when using service 'custom'",
};

export const settingsSchema = z
  .object({
    service: z.enum(["openai", "custom"]),

    openai: z
      .object({
        key: z.string({
          required_error: errors.OPENAI_KEY_REQUIRED,
        }),
        model: z.string({
          required_error: errors.MODEL_REQUIRED,
        }),
        temperature: z.string().optional(),
      })
      .optional(),

    custom: z
      .object({
        endpoint: z
          .string({
            required_error: errors.ENDPOINT_REQUIRED,
          })
          .url(),
        headers: z.record(z.string()).optional(),
        payload: z.record(z.string()).optional(),
      })
      .optional(),

    /**
     * List of files whose contents will be provided as context to the model
     */
    files: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.service === "openai") {
        return Boolean(data.openai?.key);
      }
      return true;
    },
    {
      message: errors.OPENAI_KEY_REQUIRED,
      path: ["openai"],
    }
  )
  .refine(
    (data) => {
      if (data.service === "custom" && !data.custom?.endpoint) {
        return false;
      }
      return true;
    },
    {
      message: errors.ENDPOINT_REQUIRED,
      path: ["endpoint"],
    }
  );

export type Settings = z.infer<typeof settingsSchema>;

export function validateSettings(settings: unknown): Settings {
  const result = settingsSchema.safeParse(settings);
  if (!result.success) {
    throw new Error(result.error.issues.map((i) => i.message).join("\n"));
  }
  return result.data;
}
