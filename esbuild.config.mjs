import { execSync } from "node:child_process";
import { copyFileSync } from "node:fs";
import esbuild from "esbuild";

try {
  execSync("eslint . --ext .ts", { stdio: "inherit" });
  execSync("tsc --noEmit", { stdio: "inherit" });
} catch (error) {
  process.exit(1);
}

console.log("🚀 Build starting... 🔥");
await esbuild
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
    ], // external dependencies to not include in the bundle
    tsconfig: "tsconfig.json",
  })
  .catch(() => process.exit(1));

copyFileSync("src/ai-response-schema.ts", "dist/ai-response-schema.ts");
console.log("🚀 Build completed. 🎉");
