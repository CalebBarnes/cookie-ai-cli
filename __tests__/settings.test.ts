import fs from "node:fs";
import { describe, it, expect, afterEach, vi, afterAll } from "vitest";
import { saveSettings } from "../src/settings/save-settings";
import { errors } from "../src/settings/settings-schema";
import { getSettings } from "../src/settings/get-settings";
import {
  mockInvalidSettingsMissingEndpoint,
  mockOpenAISettings,
} from "../__mocks__/mock-settings";
import { TEMP_TEST_DIR } from "../__mocks__/test-constants";
import path from "node:path";
import { logger } from "../src/utils/logger";

const TEST_SETTINGS_PATH = `${TEMP_TEST_DIR}/test-settings.json`;

describe("settings", () => {
  const loggerInfoSpy = vi
    .spyOn(logger, "info")
    .mockImplementation((_infoObject: object) => logger);
  const loggerErrorSpy = vi
    .spyOn(logger, "error")
    .mockImplementation((_infoObject: object) => logger);
  const mockExit = vi
    .spyOn(process, "exit")
    .mockImplementation((_code?: number) => undefined as never);

  afterEach(() => {
    mockExit.mockClear();
    loggerErrorSpy.mockClear();
    loggerInfoSpy.mockClear();
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });
  });
  afterAll(() => {
    mockExit.mockRestore();
    loggerErrorSpy.mockRestore();
    loggerInfoSpy.mockRestore();
  });

  it("should save and load settings file", () => {
    expect(() =>
      saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH)
    ).not.toThrow();
    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });

  it("should log validation errors and not overwrite existing settings", () => {
    expect(() =>
      saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH)
    ).not.toThrow();
    saveSettings(mockInvalidSettingsMissingEndpoint, TEST_SETTINGS_PATH);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(errors.ENDPOINT_REQUIRED))
    );
    expect(getSettings(TEST_SETTINGS_PATH)).toEqual(mockOpenAISettings);
  });

  it("should fail to get missing settings file and log a message to the user", () => {
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });
    expect(() => getSettings(TEST_SETTINGS_PATH)).toThrow();
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(`Settings file not found`)
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
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(errors.ENDPOINT_REQUIRED))
    );
  });
});
