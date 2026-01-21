# GroqFlow - AI-Powered Workflow Automation Assistant

GroqFlow is a voice-first AI assistant that acts as a digital employee, autonomously executing tasks such as email drafting, social media management, data analysis, and desktop automation. The assistant leverages Groq's AI capabilities for natural language processing and Screenpipe's Terminator for desktop automation.


## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Installation Guide](#installation-guide)
4. [Setup Instructions](#setup-instructions)
5. [Using GroqFlow](#using-groqflow)
6. [Command Reference](#command-reference)
7. [API Integrations](#api-integrations)
8. [Troubleshooting](#troubleshooting)
9. [Security & Privacy](#security--privacy)
10. [License](#license)

## Features

### Voice-First Interaction
- **Natural Language Commands**: Issue commands in plain language like "Email the Q1 report to the CFO and highlight key metrics."
- **Multilingual Support**: Voice commands in both English and Hindi.
- **Follow-up Context**: The assistant retains context, allowing for follow-up commands such as "Add a chart to slide 3."

### Screen Context Intelligence
- **Live Screen Analysis**: Detects open applications and windows for context-aware assistance.
- **Auto-Error Recovery**: Automatically relaunches crashed applications and replays actions.
- **UI Element Detection**: Identifies buttons, input fields, and other interface elements for interaction.

### Cross-App Automation
- **Social Media Management**: Post to platforms like LinkedIn, Twitter, and Instagram with natural language commands.
- **Email Automation**: Draft, format, and send emails across mail clients.
- **Data Analysis**: Process spreadsheets and generate insights from CSV files.
- **Browser Control**: Open websites, fill forms, and navigate web pages.
- **Application Automation**: Control desktop apps like Word, Excel, and PowerPoint.
- **Calendar Management**: Create events and set reminders.

### AI Agent Capabilities
- **Web Search**: Access real-time information from the internet with Groq's compound-beta model.
- **Code Execution**: Run Python code for data processing and problem-solving.
- **Intelligent Analysis**: Generate insights and summaries from various data sources.

### Security & Privacy
- **Local Processing**: Voice and screen data are processed locally when possible.
- **Automatic Redaction**: Sensitive information is blurred during screen analysis.
- **Configurable Privacy**: Control what the assistant can see and access.

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI with Tailwind CSS
- **State Management**: React Query
- **Voice Processing**: Web Speech API with Groq NLP
- **APIs**:
  - Groq AI for natural language processing
  - Screenpipe's Terminator for desktop automation

## Installation Guide

### System Requirements
- Node.js v16.0.0 or higher
- npm v8.0.0 or higher
- Modern web browser (Chrome recommended for best voice recognition)
- 4GB RAM minimum, 8GB recommended
- Windows 10/11, macOS 10.15+, or Ubuntu 20.04+ for Screenpipe Terminator

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/groqflow.git
   cd groqflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. Install Screenpipe Terminator agent:
   
   **Windows Installation:**
   - Download the Screenpipe Terminator installer from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
   - Run the installer (.exe file) and follow the on-screen instructions
   - Grant necessary permissions when prompted
   - Screenpipe will install as a system service and start automatically
   - Verify installation by checking the system tray for the Screenpipe icon

   **macOS Installation:**
   - Download the macOS .dmg file from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
   - Open the .dmg file and drag the Screenpipe app to your Applications folder
   - Launch Screenpipe from your Applications folder
   - When prompted, grant accessibility permissions (System Preferences → Security & Privacy → Accessibility)
   - Grant screen recording permissions when prompted
   - Screenpipe will run in the background with an icon in your menu bar

   **Linux Installation:**
   - Download the Linux .AppImage or .deb package from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
   - For .AppImage: Make the file executable with `chmod +x Screenpipe-Terminator.AppImage`
   - For .deb package: Install with `sudo dpkg -i screenpipe-terminator.deb`
   - Launch Screenpipe and follow the setup wizard
   - Grant necessary permissions when prompted

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

7. Deploy the `dist` folder to your preferred hosting service.

## Setup Instructions

### Configuring Groq AI

1. Create an account on [Groq Console](https://console.groq.com/) if you don't have one.
2. Generate an API key from your Groq Console dashboard.
3. In GroqFlow, go to the **Settings** tab and select **Groq AI**.
4. Enter your API key and select your preferred model:
   - **Llama 3.3 70B**: Best for complex tasks and reasoning
   - **Llama 3.1 8B**: Faster responses, good for simpler tasks
   - **Compound Beta**: For web search and code execution capabilities
5. Configure your preferred Text-to-Speech voice from available options:
   - For English: Fritz-PlayAI, Arista-PlayAI, Calum-PlayAI, Celeste-PlayAI, and more
   - For Arabic: Ahmad-PlayAI, Amira-PlayAI, Khalid-PlayAI, Nasser-PlayAI
6. Save your settings.

### Connecting Screenpipe Terminator

1. Go to the **Settings** tab and select **Screenpipe Terminator**.
2. Download and install the Terminator agent if not already done.
3. Click "Check Agent Status" to verify the agent is running.
4. Click "Connect to Agent" to establish a connection.
5. Grant necessary permissions when prompted:
   - **Windows**: Allow accessibility and automation permissions
   - **macOS**: Enable screen recording and accessibility features
   - **Linux**: Grant X11 permissions or Wayland access

### General Settings Configuration

1. Navigate to the **Settings** tab and select **General**.
2. Toggle voice interaction on/off based on your preference.
3. Set dark mode preferences.
4. Save your settings.

## Using GroqFlow

### Command Center

The Command Center is your main interface for interacting with Cecilia, the GroqFlow assistant:

1. **Text Commands**:
   - Type your command in the input field and click "Send" or press Enter.
   - Example: "Draft an email to the team about the product launch next week."

2. **Voice Commands**:
   - Click the microphone button and start speaking after the prompt.
   - Speak clearly and naturally.
   - Click the stop button or wait for automatic detection of speech end.
   - Example: "Cecilia, create a social media post about our Q2 results."

3. **Screen Capture**:
   - Click the camera button to capture your screen for context-aware assistance.
   - The assistant will analyze visible applications, windows, and content.
   - Example after screen capture: "Summarize the data in this spreadsheet."

4. **Agent Mode**:
   - Enable the "Agent Mode" checkbox to use Groq's compound-beta model.
   - This allows web search and code execution capabilities.
   - Example: "What's the current weather in Tokyo?" or "Calculate the monthly payment for a $250,000 loan with 5% interest over 30 years."

### Command Response

After processing your command, Cecilia will:

1. Display a text response in the response area.
2. Execute relevant automation tasks if applicable.
3. Provide visual feedback on task status.
4. Allow you to have the response read aloud by clicking the light bulb icon.

## Command Reference

Below are examples of commands you can use with GroqFlow across different categories:

### Email Commands
- "Email the quarterly report to the marketing team."
- "Draft a follow-up email to John about the project status."
- "Send an email to HR about my vacation request."
- "Compose a professional email declining the vendor proposal."

### Browser & Web Commands
- "Open YouTube in a new tab."
- "Search for Italian restaurants near me."
- "Fill out the contact form on this website."
- "Login to my LinkedIn account."
- "Navigate to docs.google.com."

### Social Media Commands
- "Post this image to Instagram with the caption 'Beautiful sunset'."
- "Schedule a tweet for tomorrow at 10 AM."
- "Draft a LinkedIn post about our new product launch."
- "Find trending hashtags for digital marketing."

### Data Analysis Commands
- "Analyze this CSV file and show key trends."
- "Create a chart from the data in this spreadsheet."
- "Calculate the average sales from this report."
- "Extract all email addresses from this document."

### Application Control
- "Open Microsoft Word and create a new document."
- "Save this file to my Desktop."
- "Close all Chrome tabs except the current one."
- "Switch to Photoshop."

### Calendar & Reminder Commands
- "Schedule a meeting with the design team for tomorrow at 2 PM."
- "Set a reminder to call the client at 4 PM."
- "Add a deadline for the project on Friday."
- "Show me my appointments for next week."

### Information Queries (Agent Mode)
- "What's the current weather in New York?"
- "Give me the latest news on artificial intelligence."
- "Who won the most recent Nobel Prize in Physics?"
- "What is the conversion rate between USD and EUR?"

### Computational Tasks (Agent Mode)
- "Calculate the mortgage payment for a $500,000 loan at 4.5% for 30 years."
- "Solve this equation: 3x^2 + 5x - 7 = 0"
- "What's the standard deviation of these numbers: 12, 15, 18, 22, 30?"
- "Convert 500 square feet to square meters."

## API Integrations

### Groq AI Integration

GroqFlow uses Groq's API for various natural language processing tasks:

1. **Text Understanding & Generation**:
   - Processing natural language commands
   - Generating human-like responses
   - Contextual understanding of follow-up queries

2. **Models**:
   - **llama-3.3-70b-versatile**: Most capable model for complex tasks
   - **llama-3.1-8b-instant**: Faster, suitable for simpler tasks
   - **compound-beta**: Agent model with web search capabilities
   - **whisper-large-v3**: Speech-to-text transcription
   - **playai-tts**: Text-to-speech synthesis

3. **Configuration**:
   - API key is stored locally in browser's localStorage
   - Model selection affects response quality and speed
   - Voice selection personalizes the assistant's speech

### Screenpipe Terminator Integration

Screenpipe Terminator enables desktop automation across applications:

1. **Setup Requirements**:
   - Local agent must be installed on your computer
   - No API key required, uses local connection
   - Requires screen recording and accessibility permissions

2. **Capabilities**:
   - **Screen Capture**: Analyze visible content
   - **Element Detection**: Find and interact with UI elements
   - **Application Control**: Launch, close, and control applications
   - **Browser Automation**: Navigate websites and interact with web content
   - **Error Recovery**: Handle application crashes and unexpected states

3. **Limitations**:
   - Works best with common applications and standard interfaces
   - May require specific instructions for custom applications
   - Performance depends on system resources

## Troubleshooting

### Groq API Issues

1. **API Key Not Working**:
   - Verify your API key is correct in Settings
   - Check if your Groq account has available quota
   - Try regenerating your API key in Groq Console

2. **Slow Responses**:
   - Switch to a faster model like llama-3.1-8b-instant
   - Ensure good internet connectivity
   - Try simpler, more concise commands

3. **Incorrect Responses**:
   - Be more specific in your commands
   - Try breaking complex tasks into smaller steps
   - Disable Agent Mode for pure language tasks

### Screenpipe Terminator Issues

1. **Agent Not Connecting**:
   - Verify Terminator agent is running (check system tray)
   - Restart the agent if it's unresponsive
   - Ensure you've granted necessary permissions

2. **Automation Failures**:
   - Use screen capture to provide visual context
   - Be more specific about target applications
   - Try alternate command phrasing
   - Ensure target application is fully loaded before issuing commands

3. **Permission Issues**:
   - Grant accessibility permissions to Terminator
   - Allow screen recording access
   - Check OS-specific security settings

### Voice Recognition Issues

1. **Microphone Not Working**:
   - Check browser permissions for microphone access
   - Use Chrome for best compatibility
   - Speak clearly and at moderate volume
   - Reduce background noise

2. **Speech Not Recognized**:
   - Check if correct language is selected
   - Speak more slowly and clearly
   - Try using text commands as a fallback

## Security & Privacy

### Data Storage

- **API Keys**: Stored in browser localStorage, not sent to any servers except the official API endpoints.
- **Command History**: Stored locally in your browser.
- **Voice Data**: Processed locally and via Groq API, not permanently stored.
- **Screen Captures**: Processed locally and via Screenpipe, not permanently stored.

### Privacy Features

- **Redaction**: Screenpipe can be configured to automatically blur sensitive information.
- **Local Processing**: Screen and voice data are processed locally when possible.
- **Selective Capturing**: Capture only specific areas of the screen when needed.
- **No Cloud Storage**: Your data isn't stored in the cloud beyond the processing needed for AI functionality.

### Best Practices

1. Don't use GroqFlow for highly sensitive information.
2. Regularly clear browser data and localStorage if using on shared computers.
3. Disable screen capture when working with sensitive documents.
4. Review and understand the permissions granted to Screenpipe Terminator.

## License

MIT License

Copyright (c) 2023 Your Organization

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Additional Resources

- [Groq API Documentation](https://console.groq.com/docs/overview)
- [Screenpipe Terminator Documentation](https://docs.screenpi.pe/terminator/getting-started)
- [Project GitHub Repository](https://github.com/yourusername/groqflow)

---

Thank you for using GroqFlow! Your feedback helps us improve.
