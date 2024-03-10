import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: ["node18"],
    outdir: "dist",
    format: "esm",
    sourcemap: true,
    external: [
      "commander",
      "inquirer",
      "winston",
      "@colors/colors",
      "logform",
      "ora",
    ], // external dependencies to not include in the bundled file
    tsconfig: "tsconfig.json",
  })
  .catch(() => process.exit(1));
