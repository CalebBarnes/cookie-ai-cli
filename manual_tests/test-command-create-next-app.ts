import { handleCommand } from "../src/handle-command";
import readline from "readline";

// this is a test function to test the handleCommand function using the npx create-next-app command
// test for interactive TUI commands with user input and output while using stdio inherit
async function testCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await handleCommand({
    rl,
    command: "npx create-next-app",
  });
  process.exit(0);
}

testCommand();
