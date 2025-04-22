
# GroqFlow - AI-Powered Workflow Automation Assistant

GroqFlow is a voice-first AI assistant that acts as a digital employee, autonomously executing tasks such as email drafting, social media management, data analysis, and proactive reminders. The assistant leverages Groq's AI capabilities for natural language processing and Screenpipe's Terminator for desktop automation.

## Features

- **Voice-First Interaction**: Natural language commands in multiple languages
- **Screen Context Intelligence**: Live screen analysis and auto-error recovery
- **Cross-App Automation**: Social media management, data analysis, and proactive reminders
- **Security & Privacy**: Local processing and automatic redaction of sensitive information

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI with Tailwind CSS
- **State Management**: React Query
- **APIs**:
  - Groq AI for natural language processing
  - Screenpipe's Terminator for desktop automation

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Groq API Key ([Get one here](https://console.groq.com))
- Screenpipe API Key ([Get one here](https://docs.screenpi.pe/))

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/groqflow.git
   cd groqflow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_SCREENPIPE_API_KEY=your_screenpipe_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Integration

### Groq AI Integration

The application uses Groq's API for natural language processing. You'll need to replace the placeholder API key in `src/services/groqService.ts` with your actual Groq API key.

For proper integration, refer to the [Groq API documentation](https://console.groq.com/docs/quickstart).

Example usage:
```typescript
import { groqService } from "@/services/groqService";

// Process a command
const result = await groqService.processCommand("Draft an email to the team about the upcoming meeting");

// Transcribe audio
const audioBlob = await recordAudio();
const transcription = await groqService.transcribeAudio(audioBlob);
```

### Screenpipe Integration

Screenpipe's Terminator is used for desktop automation tasks. Replace the placeholder API key in `src/services/screenpipeService.ts` with your actual Screenpipe API key.

For proper integration, refer to the [Screenpipe SDK Reference](https://docs.screenpi.pe/sdk-reference).

Example usage:
```typescript
import { screenpipeService } from "@/services/screenpipeService";

// Capture screen
const screenImage = await screenpipeService.captureScreen();

// Execute an automation task
await screenpipeService.executeTask("openWebBrowser", { url: "https://example.com" });
```

## Application Structure

- `/src/components`: UI components
  - `/layout`: Layout components (Sidebar, Header, MainLayout)
  - `/dashboard`: Dashboard-specific components
  - `/ui`: Shadcn UI components
- `/src/pages`: Application pages (Index, Tasks, Settings)
- `/src/services`: API services (groqService, screenpipeService)
- `/src/lib`: Utility functions

## Scaling the Application

To scale the application for production use, consider the following:

1. **Backend Integration**: Add a proper backend server (Node.js/Express) for processing sensitive operations and storing data securely.

2. **Database**: Implement a database solution (MongoDB, PostgreSQL) for storing user preferences, task history, and workflow templates.

3. **Authentication**: Add user authentication and authorization to secure the application.

4. **WebSocket Support**: Implement WebSocket connections for real-time updates and notifications.

5. **Error Handling**: Enhance error handling and implement proper logging mechanisms.

6. **Testing**: Add comprehensive unit and integration tests to ensure reliability.

7. **CI/CD Pipeline**: Set up continuous integration and deployment pipelines.

## Security Considerations

- Store API keys securely and never expose them in client-side code.
- Implement proper authentication and authorization.
- Use HTTPS for all communication.
- Implement rate limiting for API calls.
- Regularly audit dependencies for security vulnerabilities.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
