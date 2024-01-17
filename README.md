# Cookie AI CLI

[![cookie-ai-logo-2@0 25x](https://github.com/CalebBarnes/cookie-ai-cli/assets/24890515/4cafa635-3a79-4aff-9b1f-ae8eb12a7cbc)](https://ai.cookiecloud.dev)



[![npm version](https://badge.fury.io/js/cookie-ai-cli.svg?v=1.3.1)](https://badge.fury.io/js/cookie-ai-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Cookie AI CLI is an advanced command-line interface tool designed to bridge the gap between natural language processing and command-line operations. It serves as an AI Terminal Assistant, automating CLI commands based on user prompts given in natural language. This makes it particularly useful for users who may not be familiar with specific command-line syntax or for those looking to streamline their workflow.

The tool's unique capability lies in its understanding and interpretation of natural language inputs, converting them into executable commands. For instance, a user can simply request to "rename a git branch" or "delete a specific file", and the tool generates the appropriate command, saving time and reducing the likelihood of syntax errors.

Key features include:

- **Natural Language Command Interpretation**: Translates natural language prompts into executable CLI commands.
- **Automated Response Parsing**: Responses are automatically parsed using JSON.parse(), ensuring a seamless integration with your system's command line.
- **Customizable Settings**: Supports various configurations, including different AI models and custom API endpoints.
- **System-Specific Adaptability**: Adjusts commands based on the user's system info (CPU architecture, OS platform, type, and kernel version), enhancing the tool's versatility across different environments.
- **Response Schema Flexibility**: The tool adheres to a predefined response schema, which includes actions for executing a single command, a list of commands, or requiring additional user info for more complex operations.
  This AI-powered assistant is ideal for developers, system administrators, and tech enthusiasts who seek an efficient and user-friendly way to navigate and execute CLI commands.

## Installation

To get started, install Cookie AI CLI globally using npm:

```bash
npm install -g cookie-ai-cli
```

This will make the ai command available globally on your system.

## Configuration

### Requirements

The cli is executed with [Bun](https://bun.sh/). You can install it with the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Initialization

Start by initializing your configuration:

```bash
ai --init
```

This command prompts you to input your API service, endpoint, and an optional API key. Your settings will be saved in ~/.cookie-ai/settings.json.

### Setting Options

#### OpenAI Service

For using OpenAI's Chat GPT-4 API, configure as follows:

```json
{
  "service": "openai",
  "openai": {
    "key": "<your-open-ai-api-key>"
  },
  "model": "gpt-4" // defaults to gpt-4
}
```

#### Custom Local API

To use a custom OpenAI-compatible API on your local network:

```json
{
  "service": "custom",
  "endpoint": "http://192.168.8.162:5000/v1/chat/completions",
  "model": "gpt-4" // defaults to gpt-4
}
```

#### Cloudflare Service

Using a [Cloudflare Service Token](https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/) to access your application secured with [Zero Trust](https://developers.cloudflare.com/cloudflare-one/applications/) rules.

```json
{
  "service": "cloudflare",
  "endpoint": "https://<your-endpoint>/v1/chat/completions",
  "cloudflare": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "model": "gpt-4" // defaults to gpt-4
}
```

#### Custom Headers

For including custom headers in each request:

```json
{
  "service": "custom",
  "endpoint": "https://<your-endpoint>/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer <your-token>",
    "Some-Other-Header": "Some-Other-Value"
  },
  "model": "gpt-4" // defaults to gpt-4
}
```

### Usage

You can directly input your prompt after the ai command or enter the CLI and type your message on the next line.

```bash
ai what is my public ip address
```

> **Note:** Directly after the ai command, avoid special characters like ?, !, or .. Use quotes or enter the CLI for such prompts.

```bash
ai
> Enter your command: what is my public ip address?
```

### Special Characters Handling

Be aware that certain special characters can't be used directly after the ai command. To use characters like ?, !, or ., you must either enter the CLI first or surround your prompt with quotes.

### Error Handling

In case of command errors, Cookie AI CLI is programmed to automatically provide feedback and suggest new commands. This feature is crucial in maintaining an efficient workflow, especially when dealing with complex commands. The tool keeps track of the context from previous commands and errors, ensuring that the user does not have to repeat information, and can quickly move towards a successful execution.

## Command Not Found Handling

"Command not found" errors, often due to typos or new commands, are common in command lines. Cookie AI CLI assists by integrating with the shell's error handler, suggesting corrections or alternatives for unrecognized commands.

### Integrating with Zsh

To enable this feature in Zsh, you need to add a custom `command_not_found_handler` function to your `.zshrc` or `.zprofile`. This function gets triggered whenever you enter a command that Zsh cannot find. It then passes this command to Cookie AI CLI for intelligent processing and suggestions.

Here's how you can set it up:

1. Edit .zshrc or .zprofile:
   Open your .zshrc or .zprofile file in a text editor. You can usually find these files in your home directory (~).

2. Add the Custom Handler Function:
   Append the following function to the file:

   ```bash
   command_not_found_handler() {
       echo "zsh: command not found: $@\nAsking AI for help..."
       ai "zsh: command not found: $@"
       # return 127
   }
   ```

   This function:

   - Outputs a message to inform you that the entered command was not found.
   - Calls the `ai` command with the unrecognized command as an argument.
   - (Optional) You can uncomment `return 127` if you want the function to return the standard error code for a command not found.

3. Save and Reload:

   Save your changes and reload the shell configuration by running `source ~/.zshrc` or `source ~/.zprofile`, depending on which file you edited.

### Example Usage in Zsh

When you type a command that is not recognized, the command_not_found_handler will automatically invoke Cookie AI CLI to analyze the input. For example:

```bash
$ gitstats
zsh: command not found: gitstats
Asking AI for help...
```

Cookie AI CLI will then process the input and suggest relevant commands or actions, guiding you towards resolving the issue or finding the right command.

This feature enhances the user experience by providing real-time, AI-driven support for command line errors, turning a potentially frustrating situation into a learning opportunity.

### Setting up in Bash

To enable this feature in bash, you need to define a function in your `.bashrc` or `.bash_profile` that handles the "command not found" scenario. The function will send the unrecognized command to Cookie AI CLI for suggestions.

Here's how to do it:

1. Edit `.bashrc` or `.bash_profile`:
   Open your `.bashrc` or `.bash_profile` file in a text editor. These files are typically located in your home directory (~).
2. Add the Handler Function:
   Add the following function to your `.bashrc` or `.bash_profile`:

   ```bash
   command_not_found_handle() {
     echo "bash: command not found: $1"
     echo "Asking AI for help..."
     ai "bash: command not found: $1"
   }

   ```

   This function will:

   - Notify you that the entered command was not found.
   - Invoke the `ai` command with the unrecognized command as an argument.

3. Save and Reload:
   After saving your changes, apply them by running `source ~/.bashrc` or `source ~/.bash_profile`, depending on which file you edited.

### Example Usage in Bash

Now, whenever you type a command that Bash does not recognize, the `command_not_found_handle` function will automatically call Cookie AI CLI to analyze the input and suggest appropriate actions. For instance:

```bash
$ unknowncommand
bash: command not found: unknowncommand
Asking AI for help...
```

The CLI will then process the input, offering relevant commands or guidance to resolve the issue or discover the correct command.

This integration enhances the Bash user experience by providing immediate, AI-driven support for command line errors, transforming challenges into informative interactions.
