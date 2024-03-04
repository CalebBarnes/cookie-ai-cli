import { describe, it, expect } from "vitest";
import { saveSettings } from "../src/settings/save-settings";
import { Settings } from "../src/settings/settings-schema";
import { getSettings } from "../src/settings/get-settings";
import { config } from "dotenv";
config({ path: ".env.local" });

const TEST_SETTINGS_PATH = "./.tmp/test-settings.json";

console.log(getSettings);
describe("settings", () => {
  it("save settings file", () => {
    const settings: Settings = {
      service: "openai",
      openai: {
        key: process.env.OPENAI_KEY || "missing-key",
      },
      model: "gpt-4",
    };
    saveSettings(settings, TEST_SETTINGS_PATH);
    // expect(getSettings(TEST_SETTINGS_PATH)).toEqual(settings);
  });

  // it("should throw validation errors and not overwrite existing settings", () => {
  //   const validSettings: Settings = {
  //     service: "custom",
  //     endpoint: "http://localhost:8000/v1/chat/completions",
  //     model: "gpt-4",
  //   };

  //   saveSettings(validSettings, TEST_SETTINGS_PATH);

  //   const invalidSettings: Settings = {
  //     service: "custom",
  //     model: "gpt-4",
  //   };

  //   expect(() => {
  //     saveSettings(invalidSettings, TEST_SETTINGS_PATH);
  //   }).toThrow(errors.ENDPOINT_REQUIRED);

  //   expect(getSettings(TEST_SETTINGS_PATH)).toEqual(validSettings);
  // });
});
