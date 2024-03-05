import { handleCommand } from "../../src/handle-command";

async function testCommand(): Promise<void> {
  await handleCommand({
    command: "asdfasdfasdf 123123",
  });
  process.exit(0);
}

await testCommand();
