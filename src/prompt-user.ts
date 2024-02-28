import { Interface } from "readline";
import { askQuestion } from "./ask-question";
import { sendChat } from "./send-chat";

export async function promptUser(rl: Interface) {
  let answer = await askQuestion(rl, "Enter your command: ");
  await sendChat({ message: answer, rl });
  return answer;
}
