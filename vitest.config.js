import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    sourcemap: true,
    esbuild: {
      loader: "ts",
    },
  },
});
