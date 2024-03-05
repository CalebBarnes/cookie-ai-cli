import { askQuestion } from "./ask-question.js";
import { sendChat } from "./send-chat.js";

export async function promptUser(
  message = "What do you want to do?"
): Promise<string> {
  const answer = await askQuestion(message);
  await sendChat({ message: answer });
  return answer;
}
