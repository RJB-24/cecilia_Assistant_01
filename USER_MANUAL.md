
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
10. [Troubleshooting](#troubleshooting)

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
- Download from [Screenpipe Documentation](https://docs.screenpi.pe/terminator/getting-started)
- Follow OS-specific installation instructions
- Ensure the agent is running before launching GroqFlow

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

### Command Structure
- Start with "Cecilia" (optional wake word)
- State your command clearly
- Wait for confirmation

### Example Commands
1. Email:
   - "Draft an email to [recipient]"
   - "Send the quarterly report to the team"
   - "Reply to [person]'s email"

2. Calendar:
   - "Schedule a meeting for tomorrow at 2 PM"
   - "Show my calendar for next week"
   - "Cancel my 3 PM appointment"

3. Data Analysis:
   - "Analyze this spreadsheet"
   - "Generate a report from this data"
   - "Calculate the total from column A"

4. Web Navigation:
   - "Open YouTube"
   - "Search for [query]"
   - "Go to [website]"

5. System Control:
   - "Open [application]"
   - "Close all Chrome tabs"
   - "Take a screenshot"

## Desktop Automation

### Prerequisites
- Screenpipe Terminator agent installed and running
- Necessary permissions granted
- Connected status in Settings

### Automation Capabilities
1. Application Control:
   - Launch applications
   - Navigate interfaces
   - Input data
   - Close applications

2. Browser Automation:
   - Navigate websites
   - Fill forms
   - Handle login flows
   - Manage tabs

3. Data Entry:
   - Copy/paste between applications
   - Fill out forms
   - Format documents

4. Error Recovery:
   - Automatic crash recovery
   - Retry mechanisms
   - Error logging

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
