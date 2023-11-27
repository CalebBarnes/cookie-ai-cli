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
  values: Array<{ label: string; value: string }>;

  /**
   * A short description of what the command will do
   */
  description: string;
}

export interface ErrorMessageContent {
  /**
   * The action to use when an error needs to be communicated to the user.
   */
  action: "error";
  /**
   * The error message to display.
   */
  message: string;

  /**
   * An optional description of the error.
   */
  description?: string;
}

export type Response =
  | CommandMessageContent
  | CommandListMessageContent
  | UserInfoRequiredMessageContent
  | ErrorMessageContent;
