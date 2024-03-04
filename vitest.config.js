import { defineConfig } from "vitest/config";
// import path from "path";

export default defineConfig({
  // resolve: {
  //   // Replicate the alias configuration from Vite
  //   alias: {
  //     "@": path.resolve(__dirname, "src"),
  //   },
  // },
  test: {
    // Since your target environment is Node.js
    environment: "node",

    // globals: true,
    // transformMode: {
    //   web: [/.[tj]sx?$/], // Transform .ts, .tsx, .js, .jsx files under Vite
    // },

    sourcemap: true,
  },
});
