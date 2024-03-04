import { handleCommand } from "../../src/handle-command";

async function testCommand() {
  await handleCommand({
    command: "asdfasdfasdf 123123",
  });
  process.exit(0);
}

testCommand();
