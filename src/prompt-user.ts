import { askQuestion } from "./ask-question.js";
import { sendChat } from "./send-chat.js";

export async function promptUser() {
  let answer = await askQuestion("Enter your command: ");
  await sendChat({ message: answer });
  return answer;
}
