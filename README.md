
# GroqFlow - AI-Powered Workflow Automation Assistant

GroqFlow is a voice-first AI assistant that acts as a digital employee, autonomously executing tasks such as email drafting, social media management, data analysis, and proactive reminders. The assistant leverages Groq's AI capabilities for natural language processing and Screenpipe's Terminator for desktop automation.

![GroqFlow Demo](https://picsum.photos/800/400)

---

## Features

- **Voice-First Interaction**: Natural language commands in English and Hindi
- **Screen Context Intelligence**: Live screen analysis and auto-error recovery
- **Cross-App Automation**: Social media management, data analysis, and proactive reminders
- **Security & Privacy**: Local processing and automatic redaction of sensitive information

---

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI with Tailwind CSS
- **State Management**: React Query
- **APIs**:
  - Groq AI for natural language processing
  - Screenpipe's Terminator for desktop automation

---

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Groq API Key ([Get one here](https://console.groq.com))
- Screenpipe Terminator Agent ([Download here](https://docs.screenpi.pe/terminator/getting-started))

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/groqflow.git
   cd groqflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. Install the Screenpipe Terminator agent on your computer by following the instructions at [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started).

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or as shown in your terminal) to access GroqFlow.

---

## Initial Setup

1. After starting the application, go to the **Settings** page.
2. Enter your **Groq API Key** from [Groq Console](https://console.groq.com/).
3. Click **Check Agent Status** to verify if Screenpipe Terminator is installed and running.
4. If Screenpipe Terminator is not detected, download and install it from the link provided.
5. After installing Terminator, click **Connect to Agent** to establish the connection.

---

## Usage Guide

### Voice Commands

- Click the microphone button in the Command Center to start voice interaction.
- Speak commands naturally, e.g.:
  - "Email the Q1 report to the CFO and highlight key metrics."
  - "Schedule a meeting with the marketing team for tomorrow at 10 AM."
  - "Analyze this CSV and send insights to the team."
- The assistant supports English and Hindi language voice commands.

### Text Commands

- Enter commands manually in the command input panel.
- Use natural language phrases similar to voice commands.
- Press enter or click submit to process commands.

### Agent Mode

- Enable "Agent Mode" checkbox to use Groq's compound-beta model with web search and code execution capabilities.
- This allows Cecilia to search the web for real-time information and execute code to solve problems.
- Example: "What's the current weather in Tokyo?" or "Calculate the monthly payment for a $250,000 loan with 5% interest."

### Screen Capture

- Click the camera button to capture your screen for context-aware commands.
- The assistant will use this context to understand what you're working on.

### Command Center Tabs

- **Commands**: Interact with Cecilia via voice or text.
- **Assistant**: AI Assistant features for brainstorming, detailed queries, and drafting.
- **Automation**: Desktop automation controls for cross-app workflows.
- **History**: Command interaction history viewing and replay.

### Task Automation

- GroqFlow integrates with Screenpipe's Terminator to automate desktop tasks.
- Ensure the Screenpipe Terminator agent is installed and running on your machine.
- Use command phrases in the Command Center to trigger automation (e.g., open applications, fill forms).

---

## API Integrations

### Groq AI

Groq provides the natural language processing and chat completions backbone.

- Process chat and voice commands.
- Transcribe audio files.
- Synthesize text-to-speech audio.
- Access vision and reasoning APIs.

For details, see [Groq API docs](https://console.groq.com/docs/overview).

### Screenpipe Terminator

Handles desktop automation and screen capture.

- Controls apps and workflows on your desktop.
- Capture screenshots for contextual commands.
- Auto-error recovery for crashed apps.

For details, see [Screenpipe Terminator JS SDK](https://docs.screenpi.pe/terminator/js-sdk-reference).

---

## Troubleshooting

### Groq API Issues

- Verify your API key is correct in Settings.
- Check if you've exceeded your API rate limits.
- Try selecting a different model if responses are slow.

### Screenpipe Terminator Issues

- Ensure the Terminator agent is installed and running on your computer.
- Check if you're running the latest version of the agent.
- Restart the agent if it's not responding.
- Make sure you allow screen recording permissions when prompted.

### Voice Recognition Issues

- Check if your browser has microphone permissions enabled.
- Try using Chrome for best voice recognition performance.
- Speak clearly and at a moderate pace.

---

## Security & Privacy

- Groq API key is stored locally in your browser's localStorage.
- Voice and screen data are processed locally or securely via APIs.
- No cloud storage for sensitive user audio or screen data.
- Sensitive info in screen captures can be automatically redacted with Screenpipe configuration.

---

## License

MIT License

---

Thank you for using GroqFlow! Your intelligent workflow assistant.
