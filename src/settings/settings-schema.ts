import { z } from "zod";

export const services = ["openai", "custom"] as const;

export const errors = {
  OPENAI_KEY_REQUIRED: "'openai.key' is required when using service 'openai'",
  ENDPOINT_REQUIRED: "'endpoint' is required when using service 'custom'",
  MODEL_REQUIRED: "'model' is required. (example: 'gpt-4')",
};

export const settingsSchema = z
  .object({
    service: z.enum(["custom", "openai"]),
    /**
     * Model to be used for requests
     */
    model: z.string({
      required_error: errors.MODEL_REQUIRED,
    }),
    /**
     * OpenAI API key to be used for requests, when using service 'openai'
     */
    openai: z
      .object({
        key: z.string({
          required_error: errors.OPENAI_KEY_REQUIRED,
        }),
      })
      .optional(),
    /**
     * Custom payload to be sent with the request, when using service 'custom'
     */
    custom: z
      .object({
        payload: z.record(z.string()).optional(),
      })
      .optional(),
    /**
     * Custom endpoint to send the request to (only used when service is 'custom')
     */
    endpoint: z.string().url().optional(),
    /**
     * Additional headers to be sent with the request
     */
    headers: z.record(z.string()).optional(),
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
      if (data.service === "custom" && !data.endpoint) {
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
