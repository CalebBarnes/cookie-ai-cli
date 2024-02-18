import { handleCommand } from "../handle-command";
import readline from "readline";

async function testCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await handleCommand({
    rl,
    command: "node -v > .nvmrc",
  });
  process.exit(0);
}

testCommand();
