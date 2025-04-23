# GroqFlow Integrations Documentation

This document provides technical details about how GroqFlow integrates with Groq AI and Screenpipe Terminator to create a powerful AI assistant.

## Table of Contents
1. [Groq AI Integration](#groq-ai-integration)
   - [Integration Architecture](#groq-integration-architecture)
   - [API Methods](#groq-api-methods)
   - [Models Used](#groq-models-used)
   - [Configuration](#groq-configuration)
2. [Screenpipe Terminator Integration](#screenpipe-terminator-integration)
   - [Integration Architecture](#screenpipe-integration-architecture)
   - [API Methods](#screenpipe-api-methods)
   - [Automation Tasks](#automation-tasks)
   - [Configuration](#screenpipe-configuration)
3. [Combined Workflow](#combined-workflow)
4. [Extending the Integrations](#extending-the-integrations)

## Groq AI Integration

### Groq Integration Architecture

GroqFlow utilizes the Groq API through the `groqService.ts` service, which provides a clean interface for all Groq-related functionality. The integration follows this flow:

1. User inputs a command (text or voice)
2. Command is sent to Groq API via `groqService`
3. Groq processes the command and returns a response
4. Response is displayed to the user and/or used to trigger automation tasks

The integration supports both synchronous API calls for immediate responses and streaming for real-time feedback.

### Groq API Methods

The `groqService` provides the following key methods:

#### Text Processing
- `processCommand(command: string)`: Process a simple command
- `processChat(messages: GroqMessage[], options?: GroqCompletionOptions)`: Advanced chat processing with options
- `streamChat(messages: GroqMessage[], options?: GroqCompletionOptions)`: Stream responses in real-time
- `processAgentCommand(command: string)`: Process command with agent capabilities (web search/code execution)

#### Voice Processing
- `transcribeAudio(audioBlob: Blob, options?: GroqTranscriptionOptions)`: Convert speech to text
- `textToSpeech(text: string, options?: GroqTextToSpeechOptions)`: Convert text to speech
- `speakText(text: string, options?: GroqTextToSpeechOptions)`: Play text as speech

#### Vision Processing
- `processImageWithText(imageUrl: string, question: string)`: Process an image with a text query

### Groq Models Used

GroqFlow integrates with several Groq models:

| Model Type | Model ID | Use Case |
|------------|----------|----------|
| Chat | llama-3.3-70b-versatile | High-quality responses |
| Chat | llama-3.1-8b-instant | Fast responses |
| Agent | compound-beta | Web search and code execution |
| Speech-to-Text | whisper-large-v3-turbo | Voice transcription |
| Text-to-Speech | playai-tts | Voice responses |
| Vision | meta-llama/llama-4-scout-17b-16e-instruct | Image processing |

### Groq Configuration

The Groq integration is configured via the Settings page:

```typescript
// Sample configuration code
localStorage.setItem("GROQ_API_KEY", groqApiKey);
localStorage.setItem("GROQ_MODEL", groqModel);
localStorage.setItem("GROQ_TTS_VOICE", ttsVoice);

groqService.setApiKey(groqApiKey);
groqService.setModel(groqModel);
```

API calls are made using the Fetch API:

```typescript
const response = await fetch(`${this.baseUrl}/chat/completions`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${this.apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: this.model,
    messages: messages,
    temperature: options.temperature ?? 0.7,
    // ... other parameters
  }),
});
```

## Screenpipe Terminator Integration

### Screenpipe Integration Architecture

GroqFlow connects to the locally installed Screenpipe Terminator agent through the `screenpipeService.ts` service. The integration follows this flow:

1. User or AI requests an automation action
2. Request is sent to Screenpipe agent via JavaScript SDK
3. Terminator agent performs the requested action on the desktop
4. Results are returned to GroqFlow
5. GroqFlow updates the UI with results or triggers follow-up actions

All automation occurs locally on the user's machine, with no data sent to external servers.

### Screenpipe API Methods

The `screenpipeService` provides the following key methods:

#### Core Functionality
- `connect()`: Connect to the local Terminator agent
- `isConnected()`: Check if connected to agent
- `checkAgentInstalled()`: Verify if agent is installed and running

#### Screen Context
- `captureScreen(options?: CaptureOptions)`: Take a screenshot
- `detectOpenApps()`: Get list of running applications
- `getScreenContext()`: Get comprehensive screen context (active app, window, elements)

#### Automation
- `executeTask(task: AutomationTask)`: Execute a defined automation task
- `findElement(selector: string)`: Find a UI element on screen
- `interactWithElement(elementId: string, action: string, parameters?)`: Interact with a UI element

### Automation Tasks

Screenpipe can execute various automation tasks defined by the `AutomationTask` interface:

```typescript
export interface AutomationTask {
  type: 'browser' | 'app' | 'system' | 'email' | 'social' | 'data';
  action: string;
  parameters: Record<string, any>;
  errorHandling?: {
    retries: number;
    fallback?: string;
  };
}
```

Example tasks include:

```typescript
// Open a website
const task = {
  type: "browser",
  action: "open",
  parameters: {
    url: "https://www.youtube.com"
  }
};

// Compose an email
const task = {
  type: "email",
  action: "compose",
  parameters: {
    to: "recipient@example.com",
    subject: "Meeting Agenda",
    body: "Here's the agenda for our upcoming meeting..."
  }
};
```

### Screenpipe Configuration

The Screenpipe integration requires:

1. Installing the Terminator agent on the local machine
2. Connecting to the agent from GroqFlow:

```typescript
// Example connection code
async connect(): Promise<boolean> {
  if (this.connected) return true;
  
  try {
    if (!this.scriptLoaded) {
      await this.loadSDK();
    }
    
    if (!this.terminator) {
      throw new Error("Terminator SDK not available");
    }
    
    const result = await this.terminator.connect();
    this.connected = result.success;
    
    return this.connected;
  } catch (error) {
    this.connected = false;
    throw new Error(`Failed to connect to Screenpipe: ${error}`);
  }
}
```

## Combined Workflow

The power of GroqFlow comes from the combination of Groq AI and Screenpipe Terminator:

1. User issues a voice command: "Email the quarterly report to the team"
2. Voice service captures audio and sends to Groq Whisper for transcription
3. Transcribed text is processed by Groq Llama model to understand intent
4. GroqFlow identifies this as an email task with specific parameters
5. Screenpipe Terminator opens email client and populates fields
6. Screenpipe searches for the quarterly report document
7. Email is drafted and shown to user for review/sending
8. Task completion is reported back to GroqFlow

This workflow combines natural language understanding with desktop automation for a seamless experience.

## Extending the Integrations

### Adding New Groq Models

To add support for new Groq models:

1. Update the model options in the Settings page
2. Add model-specific handling in the `groqService`
3. Test with various prompt types to ensure compatibility

### Adding New Automation Capabilities

To extend Screenpipe automation:

1. Define new task types or actions in the `AutomationTask` interface
2. Implement handler functions in `executeTask()`
3. Create UI for configuring and triggering the new automation
4. Test thoroughly with error handling

### Improving Integration Security

Both integrations prioritize security:

- Groq API keys are stored locally in the browser
- Screenpipe operates entirely locally without cloud connectivity
- Sensitive information detection prevents data leakage
- Users maintain full control over permissions and capabilities

When extending the integrations, maintain these security principles to protect user data and privacy.
