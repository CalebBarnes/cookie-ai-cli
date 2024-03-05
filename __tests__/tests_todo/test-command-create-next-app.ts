import { handleCommand } from "../../src/handle-command";

async function testCommand(): Promise<void> {
  await handleCommand({
    command: "npx create-next-app",
  });
  process.exit(0);
}

await testCommand();
