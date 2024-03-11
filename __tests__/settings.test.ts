import fs from "node:fs";
import { describe, it, expect, afterEach, vi, afterAll } from "vitest";
import { saveSettings } from "../src/settings/save-settings";
import { errors } from "../src/settings/settings-schema";
import { getSettings } from "../src/settings/get-settings";
import {
  mockInvalidSettingsMissingEndpoint,
  mockOpenAISettings,
} from "../__mocks__/mock-settings";
import { TEST_DIR } from "../__mocks__/test-constants";
import path from "node:path";

const TEST_SETTINGS_PATH = `${TEST_DIR}/test-settings.json`;

describe("settings", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});
  const mockExit = vi
    .spyOn(process, "exit")
    .mockImplementation((code?: number) => undefined as never);

  afterEach(() => {
    mockExit.mockClear();
    consoleErrorSpy.mockClear();
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });
  });
  afterAll(() => {
    mockExit.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should save and load settings file", () => {
    expect(() =>
      saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH)
    ).not.toThrow();

    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });

  it("should throw validation errors and not overwrite existing settings", () => {
    expect(() =>
      saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH)
    ).not.toThrow();
    expect(() => {
      saveSettings(mockInvalidSettingsMissingEndpoint, TEST_SETTINGS_PATH);
    }).toThrow(errors.ENDPOINT_REQUIRED);

    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });

  it("should fail to get missing settings file and log a message to the user", () => {
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });

    expect(() => getSettings(TEST_SETTINGS_PATH)).toThrow();
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(`Settings file not found: ${TEST_SETTINGS_PATH}
Run "ai init" to create a new settings file.`)
    );
  });

  it("should log validation errors when loading invalid settings", () => {
    // simulate a user manually writing to settings file with invalid settings
    fs.mkdirSync(path.dirname(TEST_SETTINGS_PATH), { recursive: true });
    fs.writeFileSync(
      TEST_SETTINGS_PATH,
      JSON.stringify(mockInvalidSettingsMissingEndpoint, null, 2)
    );

    expect(() => getSettings(TEST_SETTINGS_PATH)).toThrow(
      `Error loading settings: ${TEST_SETTINGS_PATH}`
    );

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(errors.ENDPOINT_REQUIRED))
    );
  });
});
