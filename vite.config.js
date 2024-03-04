import { defineConfig } from "vite";
// import path from "path";

export default defineConfig({
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "src"),
  //   },
  // },
  build: {
    // Output directory
    outDir: "dist",
    // Target Node.js environment
    target: "node14", // Adjust depending on the Node.js version you're targeting
    // Rollup options for Node.js
    rollupOptions: {
      // Entry point for the CLI tool
      input: "src/index.ts",
      output: {
        // Output format
        format: "esm", // CommonJS format suitable for Node.js
        // Entry file name
        entryFileNames: "[name].js",
      },
      // External dependencies that should not be bundled
      external: [
        "fs",
        "path",
        "node:child_process",
        "readline",
        "os",
        "events",
        "child_process",
        "process",
        "url",
      ],
    },
    // Vite specific configurations for Node.js
    minify: false, // Depending on your preference for CLI tools
    sourcemap: true, // Enable source maps for debugging
  },
});
