import { handleCommand } from "../../src/handle-command";

async function testCommand(): Promise<void> {
  await handleCommand({
    command: "node -v > .nvmrc",
    description: "Create .nvmrc file with the current Node version",
  });
  process.exit(0);
}

await testCommand();
