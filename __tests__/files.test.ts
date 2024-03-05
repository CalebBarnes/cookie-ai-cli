import fs from "fs";
import path from "path";
import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { mockOpenAISettings } from "../__mocks__/mock-settings";
import {
  listFiles,
  addItem,
  getFilesMessage,
  removeItem,
} from "../src/commands/files";
import { TEST_DIR } from "../__mocks__/test_constants";
import { getSettings } from "../src/settings/get-settings";
import { saveSettings } from "../src/settings/save-settings";

const TEST_SETTINGS_PATH = `${TEST_DIR}/test-settings-files.json`;

describe("files", () => {
  beforeEach(() => {
    saveSettings(mockOpenAISettings, TEST_SETTINGS_PATH);
  });

  afterEach(() => {
    fs.rmSync(TEST_SETTINGS_PATH, {
      force: true,
    });
  });

  it("should log that no files are added yet", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    listFiles(TEST_SETTINGS_PATH);
    expect(consoleSpy).toHaveBeenCalledWith("No files added");
    consoleSpy.mockRestore();
  });

  it("should add a file then list the files", () => {
    const TEST_FILE_PATH = `${TEST_DIR}/hello_world.txt`;

    fs.writeFileSync(TEST_FILE_PATH, "Hello, World!");

    addItem([TEST_FILE_PATH], TEST_SETTINGS_PATH);
    const settings = getSettings(TEST_SETTINGS_PATH);

    expect(settings).toEqual({
      ...mockOpenAISettings,
      files: [path.resolve(TEST_FILE_PATH)],
    });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    listFiles(TEST_SETTINGS_PATH);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`• ${path.resolve(TEST_FILE_PATH)}`))
    );

    fs.rmSync(TEST_FILE_PATH);
  });

  it("should add and remove a file", () => {
    const TEST_FILE_PATH = `${TEST_DIR}/hello_world.txt`;

    fs.writeFileSync(TEST_FILE_PATH, "Hello, World!");

    addItem([TEST_FILE_PATH], TEST_SETTINGS_PATH);
    let settings = getSettings(TEST_SETTINGS_PATH);

    expect(settings).toEqual({
      ...mockOpenAISettings,
      files: [path.resolve(TEST_FILE_PATH)],
    });

    removeItem([path.resolve(TEST_FILE_PATH)], TEST_SETTINGS_PATH);
    settings = getSettings(TEST_SETTINGS_PATH);

    expect(settings).toEqual({
      ...mockOpenAISettings,
      files: [],
    });

    fs.rmSync(TEST_FILE_PATH);
  });

  it("should get file contents message text", async () => {
    const TEST_FILE_PATH = `${TEST_DIR}/hello_world.txt`;

    fs.writeFileSync(TEST_FILE_PATH, "Hello, World!");
    fs.writeFileSync(TEST_FILE_PATH + 2, "Hello, World!");

    addItem([TEST_FILE_PATH], TEST_SETTINGS_PATH);
    addItem([TEST_FILE_PATH + 2], TEST_SETTINGS_PATH);

    const text = await getFilesMessage(TEST_SETTINGS_PATH);

    expect(text).toEqual(
      path.resolve(TEST_FILE_PATH) +
        ":\nHello, World!\n\n" +
        path.resolve(TEST_FILE_PATH + 2) +
        ":\nHello, World!\n\n"
    );

    fs.rmSync(TEST_FILE_PATH);
    fs.rmSync(TEST_FILE_PATH + 2);
  });
});
