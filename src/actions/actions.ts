// import { type UserInfoRequiredMessageContent } from "../ai-response-schema";
// import { askQuestion } from "../ask-question";
// import { handleCommand } from "../handle-command";
// import { sendChat } from "../send-chat";
// import { colors } from "../utils/colors";

// export async function commandListAction({
//   commands,
//   description,
// }: {
//   commands: string[];
//   description: string;
// }): Promise<void> {
//   for (const command of commands) {
//     await handleCommand({ command, description });
//   }
// }

// export async function userInfoRequiredAction(
//   result: UserInfoRequiredMessageContent
// ): Promise<void> {
//   const values = {} as Record<string, string>;
//   for (const item of result.values) {
//     const answer = await askQuestion(item.label);
//     values[item.value] = answer;
//   }

//   if (result.suggested_command_list) {
//     for (const command of result.suggested_command_list) {
//       await handleCommand({
//         command,
//         values,
//         description: result.description,
//       });
//     }
//   }
//   if (result.suggested_command) {
//     await handleCommand({
//       command: result.suggested_command,
//       values,
//       description: result.description,
//     });
//   }
// }

// export async function unsupportedAction(result: {
//   action: string;
// }): Promise<void> {
//   console.log(
//     `${colors.red}AI tried to use unsupported action "${result.action}", asking AI to retry: ${colors.reset}`,
//     result.action
//   );
//   await sendChat({
//     message: `${result.action} is not a supported action. Make sure you respond ONLY with JSON that satisfies the Response type.`,
//   });
// }
