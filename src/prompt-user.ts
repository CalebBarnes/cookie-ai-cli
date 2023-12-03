import { askQuestion } from "./ask-question";
import { sendChat } from "./send-chat";

export async function promptUser({ rl }) {
  let answer = await askQuestion(rl, "Enter your command: ");
  await sendChat({ message: answer, rl });
  return answer;
}
