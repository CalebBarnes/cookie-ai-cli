# Cookie AI CLI

### Quickstart

```bash
npm install -g cookie-ai-cli
```

This installs the global `ai` command.

### Commands

```bash
ai --init
```

The init command will prompt you for your API service, endpoint and optional API key.
The settings will be stored at `~/.cookie-ai/settings.json`

example settings using your own OpenAI compatible API on your local network:

```json
{
  "service": "custom",
  "endpoint": "http://192.168.8.162:5000/v1/chat/completions",
  "model": "gpt-4" // defaults to gpt-3.5-turbo
}
```

example settings using your own OpenAI compatible API including a Cloudflare a Service Token for auth:

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

example settings using your own OpenAI compatible API with custom headers included in each request:

```json
{
  "service": "custom",
  "endpoint": "https://<your-endpoint>/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer <your-token>",
    "Some-Other-Heaer": "Some-Other-Value"
  },
  "model": "gpt-4" // defaults to gpt-3.5-turbo
}
```

example settings using OpenAI Chat GPT-4 API:

```json
{
  "service": "openai",
  "openai": {
    "key": "<your-open-ai-api-key>"
  },
  "model": "gpt-4" // defaults to gpt-3.5-turbo
}
```

You are able to type your prompt directly after the `ai` command or you can type `ai` to enter the cli and then type your message on the next line.

```bash
ai what is my public ip address
```

> **Note:** There are some special characters you cannot use if you are prompting directly after the `ai` command. For example, you cannot use `?` or `!` or `.`. If you want to use these characters, you must enter the cli first, or surround your prompt with quotes.

```bash
ai
Enter your command: what is my public ip address?
```
