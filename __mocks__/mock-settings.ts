import { type Settings } from "../src/settings/settings-schema";

export const mockOpenAISettings: Settings = {
  service: "openai",
  openai: {
    key: "missing-key",
  },
  model: "gpt-4",
};

export const mockInvalidSettingsMissingEndpoint: Settings = {
  service: "custom",
  model: "gpt-4",
};
