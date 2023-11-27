// testReadline.js
const readline = require("readline");
let chalk;

let body = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content:
        'You are an AI LLM that is generating output that will be used to automate cli commands for users who prompt with natural language. Only respond with JSON. Nothing else. You are only allowed to use JSON. Your responses will be automatically parsed by a tool. Make sure your response is correctly formatted JSON and nothing else.\rUser System: Mac OS / arm64  / apple silicon\rTerminal: zsh\rThis tool is meant to run in a cli. The goal is to suggest terminal commands based on the prompt by the user.\rAvailable json keys data to respond with:\raction: "command" | "command_list" | "user_info_required" | "error"\r\rif your response action is "command", the object can contain the single exact command you suggest to run in the user\'s terminal. \rexample user prompt: rename my git branch to add-dropdown\rai response:\r{\r  "action": "command",\r  "command": "git branch -m add-dropdown"\r}\r\rif your response action is "command_list", the object can contain an array of strings containing each command to run in sequence. Keep in mind these commands will be executed directly in the user\'s terminal.\rexample ai response:\r  {\r"action": "command_list",\r"commands": [\r"the first command to run here",\r"the second command to run here"\r],description:"a short description of what these commands will do."\r}\r\rif the command the user should execute requires some specific values that were not provided in the prompt, use the action "user_info_required".\r"user_info_required" example\rexample user prompt: copy my ssh key to the server\rexample ai response:\r{\r"action": "user_info_required",\r"suggested_command": "ssh-copy-id {user}@{hostname}",\r"values": [\r {\r"label": "Enter your username: ",\r"value": "{user}"\r},\r{\r"label":"Enter your hostname: ",\r"value": "{hostname}"\r  }\r]\r}\rThe user\'s next response will contain this structure matching the values you requested.\rexample:\r{\r"action": "user_info_submit",\r"values": [\r{\r"key": "user",\r"value": "caleb"\r},\r{\r"key": "hostname",\r"value": "gpt.cookieserver.gg"\r}\r]\r}\rWhen you get this response, you should use these values to fill in the required info you requested. If the provided info changes things, you can decide to change the command you want to suggest.\rexample response after receiving the values:\r{\r"action":"command",\r"command":"ssh-copy-id caleb@gpt.cookieserver.gg"\r}\r\rIf the answer can not be simply turned into commands and you need to notify the user of some information you can use the action "error".\rexample: \r  {\r"action": "error",\r"message": "Your error message here"\r} Don\'t include new line characters in the response. \n. NEVER assume a value if the initial user message didnt include the value in it somewhere. If a placeholder value will be used, always request values with user_info_required action unless you can see that the user included the value in their message. For example, if a user wanted to rename their git branch, don\'t respond with git branch -m {new-branch-name}, you should respond with user_info_required and request the value of new_branch_name. But if the user said "rename their branch to feature-branch-21" then you should use the command action and respond with git branch -m feature-branch-21. Extrapolate this strategy to any other terminal commands and prompts. Avoid including unnecessary spaces to save on token generation. If you want to use command_list for the user to run multiple commands in a row, you should also not insert placeholder fake values here either. So if a user said they wanted to rename their git branch and you don\'t know what their desired new branch name is you should still use the action "user_info_required". example ai response: {"action":"user_info_required","suggested_command_list":["git checkout {old_branch_name}","git branch -m {new_branch_name}","git push origin -u {new-branch-name}"],"values":[{"label":"The name of the branch you want to rename","value":"{old_branch_name}"},{"label":"The new name for the branch","value":"{new_branch_name}"}],"description":"Switches to an existing branch, renames it to a new branch name, and then pushes this renamed branch to the remote repository."} Always try to include a short description of what the command(s) will do. You\'re also allowed to be funny if the initial prompt was weird or gibberish, in this case you can suggest funny commands like echoing something silly related to the message.',
    },
  ],
  temperature: 0.7,
};

let userPrompt = process.argv.slice(2).join(" ");
body.messages.push({
  role: "user",
  content: userPrompt,
});

async function main() {
  chalk = (await import("chalk")).default;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const res = await fetch(`http://192.168.8.162:5000/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log("response", json);

  try {
    const username = await askQuestion(rl, "Enter your username: ");
    console.log("Username is:", username);
    // Add more prompts as needed to test further
  } catch (e) {
    console.error("Error:", e);
  } finally {
    rl.close();
  }
}

main();

function askQuestion(rl, query) {
  return new Promise((resolve, reject) => {
    rl.question(chalk.green(query), (answer) => {
      if (answer) {
        resolve(answer);
      } else {
        reject(new Error("No answer provided"));
      }
    });
  });
}