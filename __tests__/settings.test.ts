import fs from "node:fs";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { saveSettings } from "../src/settings/save-settings.js";
import { errors } from "../src/settings/settings-schema.js";
import { getSettings } from "../src/settings/get-settings.js";
import {
  mockInvalidSettingsMissingEndpoint,
  mockOpenAISettings,
} from "../__mocks__/mock-settings.js";
import { TEST_DIR } from "../__mocks__/test-constants.js";

const TEST_SETTINGS_PATH = `${TEST_DIR}/test-settings.json`;

describe("settings", () => {
  beforeEach(() => {
    saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH);
  });

  afterEach(() => {
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });
  });

  it("should save and load settings file", () => {
    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });

  it("should throw validation errors and not overwrite existing settings", () => {
    expect(() => {
      saveSettings(mockInvalidSettingsMissingEndpoint, TEST_SETTINGS_PATH);
    }).toThrow(errors.ENDPOINT_REQUIRED);

    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });
});
