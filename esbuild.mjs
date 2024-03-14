import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import esbuild from "esbuild";

function copySchema() {
  if (!existsSync("dist")) {
    mkdirSync("dist");
  }
  copyFileSync("src/ai-response-schema.ts", "dist/ai-response-schema.ts");
}

const customPlugin = {
  name: "cookie-ai-cli-build-plugin",
  setup(build) {
    build.onStart(() => {
      console.log("building...");
    });
    build.onEnd(() => {
      // copy ai response schema ts file to dist after build (this ts file read at runtime)
      copySchema();
    });
  },
};

const esbuildConfig = {
  plugins: [customPlugin],
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
    "openai",
    "blessed",
    "ink",
    "react",
  ], // external dependencies to not include in the bundle
  tsconfig: "tsconfig.json",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(esbuildConfig);
  await ctx.watch();
  console.log("watching...");
  process.on("SIGINT", () => {
    ctx.dispose();
    process.exit();
  });
} else {
  await esbuild.build(esbuildConfig);
  copySchema();
}
