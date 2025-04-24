
# GroqFlow Integrations Documentation

This document provides technical details about how GroqFlow integrates with Groq AI and Screenpipe Terminator to create a powerful AI assistant.

## Table of Contents
1. [Groq AI Integration](#groq-ai-integration)
   - [Integration Architecture](#groq-integration-architecture)
   - [API Methods](#groq-api-methods)
   - [Models Used](#groq-models-used)
   - [Advanced NLP Features](#advanced-nlp-features)
   - [Configuration](#groq-configuration)
2. [Screenpipe Terminator Integration](#screenpipe-terminator-integration)
   - [Integration Architecture](#screenpipe-integration-architecture)
   - [API Methods](#screenpipe-api-methods)
   - [Automation Tasks](#automation-tasks)
   - [Application Control](#application-control)
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

#### Note Taking
- `generateNotesFromTranscript(transcript: string, options: NoteTakingOptions)`: Create structured notes from meeting/video transcripts

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

### Advanced NLP Features

GroqFlow leverages Groq's advanced NLP capabilities:

1. **Intent Recognition**: Detects user's intentions from commands
2. **Entity Extraction**: Identifies key information like names, dates, and locations
3. **Contextual Understanding**: Maintains conversation history for coherent interactions
4. **Language Generation**: Creates human-like text for emails, reports, and communications
5. **Translation**: Supports multilingual voice commands and responses
6. **Reasoning**: Uses step-by-step reasoning to solve complex problems
7. **Automatic Note Taking**: Transcribes and summarizes meetings/videos into structured notes
8. **Code Generation & Execution**: Writes and runs code to solve computational tasks

### Groq Configuration

The Groq integration is configured via the Settings page, where users can:

1. Add their Groq API key
2. Select preferred language models
3. Choose voice settings for TTS
4. Configure agent behavior

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
- `openApplication(appName: string)`: Open a specific application or website
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

### Application Control

GroqFlow can control various applications through Screenpipe:

1. **Web Browsers**: Open websites, navigate to URLs, fill forms
2. **Email Clients**: Compose emails, read messages, attach files
3. **Productivity Apps**: Create documents, spreadsheets, presentations
4. **Media Apps**: Control YouTube, media players, streaming services
5. **Communication**: Join video calls, send messages
6. **System Apps**: File management, settings control

The `APP_MAPPINGS` object in `screenpipeService.ts` maintains mappings between common application names and their URLs or system commands, enabling intelligent handling of app-opening requests.

### Screenpipe Configuration

The Screenpipe integration requires:

1. Installing the Terminator agent on the local machine
2. Connecting to the agent from GroqFlow through `screenpipeService.connect()`
3. Ensuring proper permissions for screen capture and application control

## Combined Workflow

The power of GroqFlow comes from the combination of Groq AI and Screenpipe Terminator:

1. User issues a voice command: "Take notes for my team meeting"
2. Voice service captures audio and sends to Groq Whisper for transcription
3. Transcribed text is processed by Groq Llama model to understand intent (note-taking)
4. GroqFlow starts recording meeting audio and sends it to Groq for transcription
5. Transcription is processed to generate structured notes
6. Notes are saved and presented to the user
7. If requested, notes can be emailed to the team via Screenpipe automation

This workflow combines natural language understanding with desktop automation for a seamless experience.

Example workflows:

### Opening Applications:
1. User says: "Open YouTube"
2. GroqFlow detects app-opening intent
3. Screenpipe is used to open YouTube in a browser
4. Visual confirmation is provided to the user

### Automatic Note Taking:
1. User says: "Take notes for my meeting with marketing"
2. GroqFlow initiates audio capture
3. Audio is transcribed using Groq Whisper
4. Transcript is summarized using Groq AI
5. Structured notes are generated and saved

### Email Automation:
1. User says: "Email the quarterly report to the team"
2. GroqFlow uses Groq AI to understand the intent
3. Screenpipe opens the email client
4. Email is drafted with appropriate content
5. User reviews before sending

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
