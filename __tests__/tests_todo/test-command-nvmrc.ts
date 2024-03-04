import { handleCommand } from "../../src/handle-command";

async function testCommand() {
  await handleCommand({
    command: "node -v > .nvmrc",
  });
  process.exit(0);
}

testCommand();
