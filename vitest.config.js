import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    // deps:{

    // },
    // sourcemap: true,

    // Configure Vitest to use ts-node for TypeScript support
    // This allows you to write your tests in TypeScript directly
    esbuild: {
      loader: "ts",
      // Include any necessary TypeScript options here
      // This can be particularly useful for specifying compiler options that are relevant for tests
      // tsconfigRaw: {
      //   compilerOptions: {
      //     // Set to match your project's needs; for example, to support top-level await, etc.
      //     target: "ESNext",
      //     module: "ESNext",
      //   },
      // },
    },
  },
});
