import { handleCommand } from "../../src/handle-command";

async function testCommand() {
  await handleCommand({
    command: "npx create-next-app",
  });
  process.exit(0);
}

testCommand();
