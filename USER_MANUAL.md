
# GroqFlow User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Command Center](#command-center)
4. [Task Management](#task-management)
5. [Workflow Automation](#workflow-automation)
6. [Analytics](#analytics)
7. [Settings Configuration](#settings-configuration)
8. [Voice Commands](#voice-commands)
9. [Desktop Automation](#desktop-automation)
10. [Groq AI Integration](#groq-ai-integration)
11. [Screenpipe Integration](#screenpipe-integration)
12. [Troubleshooting](#troubleshooting)

## Getting Started

GroqFlow is a powerful AI assistant that combines voice commands, natural language processing, and desktop automation to help you accomplish tasks efficiently.

### Key Features
- Voice-first interaction with natural language commands
- Cross-application automation
- Real-time screen analysis and context awareness
- Task management and tracking
- Performance analytics
- Multilingual support (English and Hindi)

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

3. Configure environment variables:
Create a `.env` file with:
```
VITE_GROQ_API_KEY=your_groq_api_key
```

4. Install Screenpipe Terminator:
   
   **Detailed Screenpipe Installation Steps**
   
   **Windows:**
   - Download the installer from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
   - Run the installer (.exe file)
   - Follow the on-screen instructions
   - When prompted, grant administrator privileges to complete installation
   - Grant accessibility permissions when prompted
   - The installer will add Screenpipe to your startup programs
   - Verify the installation by looking for the Screenpipe icon in your system tray
   - Right-click the icon to access settings or check status

   **macOS:**
   - Download the macOS .dmg file from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
   - Open the .dmg file
   - Drag the Screenpipe app to your Applications folder
   - Open the app from your Applications folder
   - When prompted, enter your admin password to grant necessary permissions
   - Go to System Preferences → Security & Privacy → Privacy tab:
     - Enable Accessibility permissions for Screenpipe
     - Enable Screen Recording permissions for Screenpipe
     - Enable Automation permissions if prompted
   - Screenpipe will run in the background with an icon in your menu bar
   - Click the menu bar icon to check status or access settings

   **Linux:**
   - Download the appropriate package for your distribution:
     - .AppImage file (universal)
     - .deb package (Debian/Ubuntu)
     - .rpm package (Fedora/RHEL)
   - For .AppImage:
     - Make it executable: `chmod +x Screenpipe-Terminator.AppImage`
     - Run it: `./Screenpipe-Terminator.AppImage`
   - For .deb package:
     - Install with: `sudo dpkg -i screenpipe-terminator.deb`
     - If there are dependencies issues: `sudo apt-get install -f`
   - For .rpm package:
     - Install with: `sudo rpm -i screenpipe-terminator.rpm`
   - Launch Screenpipe and follow the setup wizard
   - Grant necessary X11 permissions or Wayland access when prompted
   - Check status by finding the Screenpipe icon in your system tray

   **Verifying Installation:**
   - In all operating systems, you can verify if Screenpipe is running by:
     - Looking for the icon in system tray/menu bar
     - Opening GroqFlow and going to Settings → Screenpipe → Check Agent Status
     - If installed correctly, you should see "Agent Connected" status

5. Start the application:
```bash
npm run dev
```

## Command Center

The Command Center is your main interface for interacting with Cecilia (the AI assistant).

### Using Text Commands
1. Type your command in the input field
2. Click "Send" or press Enter
3. Wait for Cecilia's response

Example commands:
- "Draft an email to the team about the product launch"
- "Schedule a meeting with marketing for tomorrow at 2 PM"
- "Analyze the sales data in this spreadsheet"

### Using Voice Commands
1. Click the microphone icon
2. Speak your command clearly
3. Wait for the command to be processed
4. Click the stop button or wait for automatic detection

### Screen Capture
1. Click the camera icon to capture your screen
2. The assistant will analyze visible applications and content
3. You can then reference captured content in your commands

### Agent Mode
Enable "Agent Mode" to use advanced features:
- Web search capabilities
- Code execution
- Real-time information gathering

## Task Management

### Creating Tasks
1. Navigate to the Tasks page
2. Click "Add New Task"
3. Fill in:
   - Title
   - Description
   - Priority (optional)
4. Click "Add Task"

### Managing Tasks
- Update task status: Select from Pending, In Progress, Completed, or Failed
- View task details and history
- Filter tasks by status or priority
- Track task completion rates in Analytics

## Workflow Automation

### Email Automation
Commands:
- "Email [person] about [subject]"
- "Draft a follow-up email to [person]"
- "Send the [document] to [person]"

### Browser Automation
Commands:
- "Open [website]"
- "Search for [query]"
- "Fill out this form"
- "Login to [service]"

### Social Media Management
Commands:
- "Post to [platform]"
- "Schedule a tweet for [time]"
- "Share [content] on LinkedIn"

### Calendar Management
Commands:
- "Schedule meeting with [person] for [time]"
- "Add deadline for [project] on [date]"
- "Show my appointments for next week"

## Analytics

The Analytics dashboard provides insights into:
- Task completion rates
- Automation success rates
- Command processing statistics
- Response time metrics
- Usage patterns and trends

### Viewing Analytics
1. Navigate to the Analytics page
2. View real-time metrics
3. Analyze trends using interactive charts
4. Export reports (coming soon)

## Settings Configuration

### Groq AI Settings
1. Navigate to Settings > Groq AI
2. Enter your Groq API key
3. Select preferred model:
   - Llama 3.3 70B (Best quality)
   - Llama 3.1 8B (Faster)
   - Compound Beta (Agent capabilities)
4. Choose text-to-speech voice
5. Save changes

### Screenpipe Configuration
1. Navigate to Settings > Screenpipe Terminator
2. Install Terminator agent if not already done
3. Click "Check Agent Status"
4. Connect to agent
5. Grant necessary permissions

### General Settings
- Toggle voice interaction
- Enable/disable dark mode
- Configure notification preferences

## Voice Commands

### Voice Assistant Features

GroqFlow uses Groq's advanced speech models to provide a comprehensive voice assistant experience:

#### Voice Recognition Capabilities
- **Multilingual Support**: Recognize commands in both English and Hindi
- **Context Awareness**: Understand follow-up questions and maintain conversation context
- **Wake Word**: Optional "Cecilia" wake word to activate voice listening
- **Continuous Listening**: Toggle between push-to-talk and always-listening modes
- **Voice Identification**: Distinguish between different speakers (coming soon)

#### Voice Output Features
- **Natural Text-to-Speech**: Cecilia responds with natural-sounding voice using Groq's PlayAI TTS
- **Voice Customization**: Choose from multiple voice options:
  - **English Voices**: Fritz-PlayAI, Arista-PlayAI, Atlas-PlayAI, Basil-PlayAI, Briggs-PlayAI, Calum-PlayAI, Celeste-PlayAI, Cheyenne-PlayAI, Chip-PlayAI, Cillian-PlayAI, Deedee-PlayAI, Gail-PlayAI, Indigo-PlayAI, Mamaw-PlayAI, Mason-PlayAI, Mikail-PlayAI, Mitch-PlayAI, Quinn-PlayAI, Thunder-PlayAI
  - **Arabic Voices**: Ahmad-PlayAI, Amira-PlayAI, Khalid-PlayAI, Nasser-PlayAI
- **Voice Speed Control**: Adjust speaking rate for faster or slower responses
- **Audio Feedback**: Sound effects for command recognition and completion

### Command Structure
- Start with "Cecilia" (optional wake word)
- State your command clearly
- Wait for confirmation

### Example Voice Commands
1. Email:
   - "Draft an email to [recipient]"
   - "Send the quarterly report to the team"
   - "Reply to [person]'s email"

2. Calendar:
   - "Schedule a meeting for tomorrow at 2 PM"
   - "Show my calendar for next week"
   - "Cancel my 3 PM appointment"

3. Application Control:
   - "Open Spotify"
   - "Launch Microsoft Word"
   - "Open Chrome and go to Gmail"
   - "Open the Photos app"
   - "Start Zoom meeting"
   - "Open Calculator"
   - "Launch Control Panel"
   - "Open File Explorer and go to Downloads folder"
   - "Start PowerPoint presentation"
   - "Open System Settings"

4. System Commands:
   - "Take a screenshot" 
   - "Lock my computer"
   - "Show all open windows"
   - "Increase screen brightness"
   - "Mute the volume"
   - "Show battery status"
   - "Empty the recycle bin"
   - "Show CPU usage"
   - "Check available storage"

5. Complex Application Commands:
   - "Open Excel and create a new spreadsheet"
   - "Open Chrome, go to YouTube, and search for cooking tutorials"
   - "Open Word and start a new document titled 'Project Proposal'"
   - "Open Photoshop and create a new canvas sized 1080 by 1080 pixels"
   - "Open Slack and message John about the meeting"

## Desktop Automation

GroqFlow can control virtually any application on your computer through the Screenpipe Terminator integration. Here's how to use this powerful feature:

### Controlling Applications

1. **Opening Applications:**
   - "Open [application name]" - Opens any installed application
   - "Launch [application name]" - Alternative command for opening applications
   - "Start [application name]" - Another way to open applications

2. **Working with Specific Applications:**
   - **Browsers:**
     - "Open Chrome/Firefox/Edge/Safari"
     - "Open a new browser tab"
     - "Go to [website]"
     - "Search for [query]"
     - "Bookmark this page"
     - "Close the current tab"
     - "Go back/forward"
     - "Refresh the page"

   - **Productivity Apps:**
     - "Open Word/Excel/PowerPoint"
     - "Create a new document/spreadsheet/presentation"
     - "Save this file"
     - "Export as PDF"
     - "Open recent files"
     - "Print this document"
     - "Insert a table/chart/image"

   - **Media Apps:**
     - "Open Spotify/Netflix/YouTube"
     - "Play/pause/skip"
     - "Increase/decrease volume"
     - "Search for [content]"
     - "Open my playlist"
     - "Like this song/video"

   - **Communication Apps:**
     - "Open Slack/Teams/Discord/Zoom"
     - "Start a new meeting"
     - "Join the scheduled meeting"
     - "Send a message to [person/channel]"
     - "Share my screen"
     - "Turn on/off camera"
     - "Mute/unmute microphone"

3. **System Controls:**
   - "Lock my computer"
   - "Log out"
   - "Shut down/restart"
   - "Open Control Panel/System Settings"
   - "Adjust volume/brightness"
   - "Check system information"
   - "Show all open applications"
   - "Take a screenshot"
   - "Empty recycle bin"

4. **File Management:**
   - "Open File Explorer/Finder"
   - "Create a new folder named [name]"
   - "Move/copy file from [location] to [location]"
   - "Delete [file/folder]"
   - "Search for [filename]"
   - "Show recent files"
   - "Open [document type] files"

### Application Automation Examples

1. **Browser Workflow:**
   ```
   "Open Chrome"
   "Go to gmail.com"
   "Compose a new email"
   "Add subject 'Meeting Notes'"
   "Type 'Attached are the notes from today's meeting'"
   "Attach the file from my desktop called 'Meeting Notes.pdf'"
   "Send the email"
   ```

2. **Presentation Preparation:**
   ```
   "Open PowerPoint"
   "Create a new presentation"
   "Add a title slide with 'Quarterly Review'"
   "Add a new slide"
   "Insert a chart from the Excel file 'Q3 Results.xlsx'"
   "Save the presentation as 'Q3 Quarterly Review'"
   ```

3. **System Maintenance:**
   ```
   "Open Control Panel"
   "Go to Programs and Features"
   "Sort by size"
   "Show me the largest programs"
   "Go back"
   "Open System Information"
   "Check disk space"
   ```

### Advanced Control Features

1. **Multi-app Workflows:**
   - Chain commands across different applications
   - Perform complex sequences with a single voice command

2. **Error Recovery:**
   - Automatic error detection and correction
   - Retry mechanisms for failed actions

3. **Screen Context Integration:**
   - "Click the submit button"
   - "Scroll down"
   - "Select that text"
   - "Click on the first search result"

## Groq AI Integration

GroqFlow leverages Groq's powerful AI capabilities to provide intelligent responses and processing. This integration is central to the application's functionality.

### How Groq AI is Used in GroqFlow

#### Natural Language Processing
- **Command Understanding**: Groq AI analyzes your text or voice commands to understand intent, entities, and context
- **Contextual Awareness**: Maintains conversation history to understand follow-up questions
- **Multi-lingual Support**: Processes commands in both English and Hindi

#### AI Models
GroqFlow supports multiple Groq models with different capabilities:
- **Llama 3.3 70B Versatile**: High-quality responses for complex queries
- **Llama 3.1 8B Instant**: Faster responses for simpler queries
- **Compound Beta**: Agent mode with web search and code execution capabilities
- **Whisper Large v3**: Speech-to-text transcription
- **PlayAI TTS**: Text-to-speech for audible responses

#### Agent Mode
When enabled, Agent Mode uses Groq's Compound Beta model to:
- Search the web for real-time information
- Execute code to solve mathematical or programming problems
- Generate data visualizations
- Access current information (news, weather, stocks)

#### Text-to-Speech
- Converts AI responses to natural-sounding speech
- Supports multiple voices (Fritz, Arista, Calum, Celeste, Gail, Quinn)
- Adjustable speech parameters for personalized experience

### Configuration
- Your Groq API key is securely stored in local storage (client-side only)
- No data is sent to external servers except Groq's API
- API key can be updated in Settings > Groq AI
- Model selection allows balancing between response quality and speed

### API Usage
- Each command sent to Groq consumes API tokens
- Token usage is optimized to minimize costs
- Consider using the faster models (Llama 3.1 8B) for routine tasks
- Agent Mode consumes more tokens due to web search and code execution

## Screenpipe Integration

Screenpipe Terminator is the desktop automation engine that powers GroqFlow's ability to interact with your computer. This integration enables true AI-driven workflow automation.

### How Screenpipe is Used in GroqFlow

#### Screen Context Awareness
- **Application Detection**: Identifies which applications are currently running
- **Active Window Analysis**: Determines what you're currently working on
- **UI Element Recognition**: Identifies buttons, fields, and interactive elements
- **Content Analysis**: Can read text and recognize images on screen

#### Cross-Application Automation
Screenpipe enables GroqFlow to perform actions across different applications:

1. **Email Client Automation**:
   - Compose new emails with proper formatting
   - Add attachments and recipients
   - Send or save drafts

2. **Browser Automation**:
   - Open specific websites
   - Fill out web forms
   - Extract data from web pages
   - Handle login flows

3. **Office Suite Integration**:
   - Create and edit documents
   - Update spreadsheets
   - Manage presentations
   - Extract data for analysis

4. **System Control**:
   - Launch or close applications
   - Take screenshots
   - Manage files and folders
   - Control system settings

#### Error Recovery
- Automatic detection of crashed applications
- Action replay for failed attempts
- Fallback mechanisms for common errors

### Screenpipe Terminator Agent
Unlike Groq, Screenpipe requires a local agent installed on your computer:
1. The agent runs locally on your machine (no data sent to cloud)
2. Communicates with GroqFlow via secure local connection
3. Requires permissions to control your desktop
4. Runs as a background process with minimal resource usage

### Installation and Setup
1. Download the Screenpipe Terminator agent from the [official website](https://docs.screenpi.pe/terminator/getting-started)
2. Install following OS-specific instructions
3. Launch the agent before starting GroqFlow
4. In GroqFlow, go to Settings > Screenpipe Terminator
5. Click "Check Agent Status" to verify connection
6. If not connected, click "Connect to Agent"

### Security and Privacy
- All automation happens locally on your machine
- No screenshots or screen data are sent to external servers
- Sensitive information detection prevents accidental data exposure
- You maintain full control over what applications Screenpipe can interact with

### Common Use Cases
1. **Email Workflow Automation**:
   - "Cecilia, email the team with the latest sales report"
   - "Draft a response to John's email about the project timeline"

2. **Web Research Assistant**:
   - "Look up recent studies on renewable energy and summarize the findings"
   - "Open LinkedIn and check my notifications"

3. **Data Processing**:
   - "Extract data from this spreadsheet and create a summary report"
   - "Analyze this CSV file and show me trends"

4. **System Management**:
   - "Clean up my downloads folder and organize by file type"
   - "Check for system updates and install them"

## Troubleshooting

### Common Issues

1. Voice Recognition Problems:
   - Check microphone permissions
   - Use Chrome for best compatibility
   - Speak clearly and at moderate volume
   - Reduce background noise

2. Groq AI Issues:
   - Verify API key
   - Check quota usage
   - Try a different model
   - Check internet connection

3. Screenpipe Problems:
   - Verify agent is running
   - Check permissions
   - Restart agent
   - Reconnect from settings

4. Command Processing Errors:
   - Be more specific
   - Break complex commands into steps
   - Check system status in dashboard
   - Verify service connections

### Getting Help
- Check the system status dashboard
- Review error messages
- Consult documentation
- Contact support through Discord

Remember: GroqFlow continues to improve with updates. Check for new features and improvements regularly.

