import { type Settings } from "../src/settings/settings-schema";

export const mockOpenAISettings: Settings = {
  service: "openai",
  openai: {
    model: "gpt-4",
    key: "missing-key",
  },
};

export const mockInvalidSettingsMissingEndpoint: Settings = {
  service: "custom",
  custom: {
    model: "gpt-4",
  },
};
