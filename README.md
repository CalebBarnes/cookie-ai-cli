# Cookie AI CLI

[![cookie-ai-logo-2@0 25x](https://github.com/CalebBarnes/cookie-ai-cli/assets/24890515/4cafa635-3a79-4aff-9b1f-ae8eb12a7cbc)](https://ai.cookiecloud.dev)

Read the full docs at [ai.cookiecloud.dev](https://ai.cookiecloud.dev/)

[![npm version](https://badge.fury.io/js/cookie-ai-cli.svg?v=1.3.1)](https://badge.fury.io/js/cookie-ai-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Cookie AI CLI is a sophisticated command-line interface tool that seamlessly integrates natural language processing with command-line operations. It acts as an AI Terminal Assistant, transforming user prompts given in natural language into executable CLI commands. This tool is ideal for those unfamiliar with specific CLI syntax or looking to enhance their command-line efficiency.

**Key Features:**

- **Natural Language Command Interpretation**: Converts natural language inputs into executable CLI commands.
- **Customizable Settings**: Offers various configurations for different AI models and custom API endpoints.
- **System-Specific Adaptability**: Tailors commands for various systems based on CPU architecture, OS platform, type, and kernel version.
- **Response Schema Flexibility**: Supports a predefined response schema for executing commands, command lists, or handling complex operations needing additional user info.

## Installation

Install Cookie AI CLI globally with npm to access the `ai` command anywhere on your system:

```bash
npm install -g cookie-ai-cli
```

## Configuration

### Initialization

Initialize your configuration with:

```bash
ai --init
```

This will prompt for API service, endpoint, and an optional API key. Settings are saved in `~/.cookie-ai/settings.json`.

## Usage

Input your prompt after the `ai` command or enter the CLI for more complex prompts:

```bash
ai what is my public ip address
```

For special characters like `?`, `!`, or `.`, use quotes or enter the CLI:

```bash
ai
> Enter your command: what is my public ip address?
```

## Settings Configuration

The Cookie AI CLI tool uses a structured settings schema to manage various configuration options. Here’s how to set up and understand the settings for the tool:

### File Location

The settings are stored in a JSON file located at `~/.cookie-ai/settings.json`. You can manually edit this file or run `ai --init` to initialize or update the settings through a guided setup.

### Settings Schema Overview

The settings schema is defined as follows:

- `endpoint`: Optional. A URL string required when using a custom service.
- `service`: Required. Specifies the service type, either `"custom"` or `"openai"`.
- `model`: Required. Indicates the model to use (e.g., `"gpt-4"`).
- `openai`: Optional. Contains OpenAI specific settings.
  - `key`: Required for the `openai` service. Your OpenAI API key.
- `custom`: Optional. Contains settings for a custom service.
  - `payload`: Optional. A record of strings for additional payload data.
- `headers`: Optional. A record of strings for custom headers in each request.

### Example Configurations

#### OpenAI Service Example

```json
{
  "service": "openai",
  "model": "gpt-4",
  "openai": {
    "key": "<your-open-ai-api-key>"
  }
}
```

#### Custom Service Example

```json
{
  "service": "custom",
  "endpoint": "https://<your-custom-endpoint>/v1/chat/completions",
  "model": "gpt-4",
  "headers": {
    "Authorization": "Bearer <your-token>",
    "Some-Other-Header": "Some-Other-Value"
  }
}
```

#### Custom Payload Example

```json
{
  "service": "custom",
  "endpoint": "https://<your-custom-endpoint>/v1/chat/completions",
  "model": "gpt-4",
  "payload": {
    "instruction_template": "Alpaca"
  }
}
```

### Error Handling

Cookie AI CLI provides feedback and suggests new commands in case of errors. It tracks context from previous commands to streamline user experience.

## Command Not Found Handling

The tool assists with unrecognized commands, suggesting corrections or alternatives.

### Integrating with Zsh

Add a custom `command_not_found_handler` function to your `.zshrc` or `.zprofile`:

```bash
command_not_found_handler() {
    echo "zsh: command not found: $@"
    ai "zsh: command not found: $@"
}
```

Reload the shell configuration with `source ~/.zshrc` or `source ~/.zprofile`.

### Integrating with Bash

Define a `command_not_found_handle` function in your `.bashrc` or `.bash_profile`:

```bash
command_not_found_handle() {
  echo "bash: command not found: $@"
  ai "bash: command not found: $@"
}
```

Reload with `source ~/.bashrc` or `source ~/.bash_profile`.
