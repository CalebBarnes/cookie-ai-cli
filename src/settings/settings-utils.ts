import path, { dirname } from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getSchemaString(): string {
  const possiblePaths = [
    path.join(__dirname, "ai-response-schema.ts"), // For development
    path.join(__dirname, "../ai-response-schema.ts"), // For production (if __dirname is inside /dist)
    path.join(__dirname, "../../src/ai-response-schema.ts"), // For tests (if tests are run from root or another directory)
  ];
  const existingPath = possiblePaths.find(fs.existsSync);
  if (!existingPath) {
    throw new Error(
      "ai-response-schema.ts file not found in expected locations."
    );
  }

  const schemaString = fs.readFileSync(existingPath, "utf8");
  return schemaString;
}
