
# GroqFlow - AI-Powered Workflow Automation Assistant

GroqFlow is a voice-first AI assistant that acts as a digital employee, autonomously executing tasks such as email drafting, social media management, data analysis, and proactive reminders. The assistant leverages Groq's AI capabilities for natural language processing and Screenpipe's Terminator for desktop automation.

---

## Features

- **Voice-First Interaction**: Natural language commands in multiple languages
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
- Screenpipe API Key ([Get one here](https://docs.screenpi.pe/))

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
   VITE_SCREENPIPE_API_KEY=your_screenpipe_api_key
   ```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or as shown in your terminal) to access GroqFlow.

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

### Command Center Tabs

- **Commands**: Interact with Cecilia via voice or text.
- **Assistant**: Planned AI Assistant features for brainstorming, detailed queries, and drafting.
- **Automation**: Planned desktop automation controls for cross-app workflows.
- **History**: Planned command interaction history viewing and replay.

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

## Configuration

- API keys must be set in `.env` as `VITE_GROQ_API_KEY` and `VITE_SCREENPIPE_API_KEY`.
- The app reads keys at runtime for secure API communication.
- Customizing assistant voice and language settings can be done via settings page (planned).

---

## Security & Privacy

- Voice and screen data are processed locally or securely via APIs.
- No cloud storage for sensitive user audio or screen data.
- Sensitive info in screen captures is automatically redacted.

---

## Future Enhancements

- AI Assistant capabilities (task drafting, brainstorming).
- Full desktop automation workflows with error handling.
- Interactive workflow editor with drag-and-drop.
- User interaction history and analytics.
- Notification center and system status overview.
- Multi-language support enhancements.

---

## Contributing

Contributions are welcome! Please submit issues or pull requests.

---

## License

MIT License

---

Thank you for using GroqFlow! Your intelligent workflow assistant.

