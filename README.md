# Cookie AI CLI

[![npm version](https://badge.fury.io/js/cookie-ai-cli.svg)](https://badge.fury.io/js/cookie-ai-cli)
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
  "model": "gpt-4" // defaults to gpt-3.5-turbo
}
```

#### Custom Local API

To use a custom OpenAI-compatible API on your local network:

```json
{
  "service": "custom",
  "endpoint": "http://192.168.8.162:5000/v1/chat/completions",
  "model": "gpt-4" // defaults to gpt-3.5-turbo
}
```

#### Cloudflare Service

```json
{
  "service": "cloudflare",
  "endpoint": "https://<your-endpoint>/v1/chat/completions",
  "cloudflare": {
    "client_id": "<your client id>",
    "client_secret": "<your client secret>"
  },
  "model": "gpt-4" // defaults to gpt-3.5-turbo
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
  "model": "gpt-4" // defaults to gpt-3.5-turbo
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
