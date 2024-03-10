export interface CommandMessageContent {
  /**
   * The action to take when the command can be executed without any additional info from the user
   */
  action: "command";
  /**
   * The command to run in the terminal
   */
  command: string;
  /**
   * A short description of what the command will do
   */
  description?: string;
}

export interface CommandListMessageContent {
  /**
   * The action to take when the commands can be executed without any additional info from the user
   */
  action: "command_list";
  /**
   * The commands to run in the terminal sequentially
   */
  commands: string[];
  /**
   * A short description of what the commands will do
   */
  description: string;
}

export interface UserInfoRequiredMessageContent {
  /**
   * The action to take when the suggested command (or command list) requires additional info from the user.
   */
  action: "user_info_required";

  /**
   * The command to run in the terminal
   * @example "ssh-copy-id {user}@{hostname}"
   */
  suggested_command: string;

  /**
   * The list of commands to run in the terminal. This should be used if multiple commands are suggested.
   * @example ["git checkout {old_branch_name}", "git branch -m {new_branch_name}"]
   */
  suggested_command_list?: string[];

  /**
   * The values to request from the user
   * @example [{ label: "Enter your username: ", value: "{user}" }]
   */
  values: { label: string; value: string }[];

  /**
   * A short description of what the command will do
   */
  description: string;
}

export interface RequestFileAccessMessageContent {
  /**
   * The action to take when you need to request file access from the user to gain additional context when suggesting a command.
   */
  action: "request_file_access";
  /**
   * The list of files to request access to
   */
  files: string[];
}

export interface MessageToUserContent {
  /**
   * The action to take when there is no command to run, but you just need to display a message to the user instead.
   * Prefer running commands in most cases to make the user's life easier. Only use this when you need to display a message to the user.
   * If the user asks a question and you are about to answer the question directly, use this action to display the answer to the user instead.
   */
  action: "message_to_user";
  /**
   * The message to display to the user
   */
  message: string;
}

export type Response =
  | CommandMessageContent
  | CommandListMessageContent
  | UserInfoRequiredMessageContent
  | MessageToUserContent
  | RequestFileAccessMessageContent;
