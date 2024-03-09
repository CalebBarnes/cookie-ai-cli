import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export -- required by Vitest
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
