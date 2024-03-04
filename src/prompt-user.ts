import { askQuestion } from "./ask-question";
import { sendChat } from "./send-chat";

export async function promptUser() {
  let answer = await askQuestion("Enter your command: ");
  await sendChat({ message: answer });
  return answer;
}
