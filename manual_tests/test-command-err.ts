import { handleCommand } from "../src/handle-command";
import readline from "readline";

async function testCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await handleCommand({
    rl,
    command: "asdfasdfasdf 123123",
  });
  process.exit(0);
}

testCommand();
