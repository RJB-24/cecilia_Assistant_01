
// Application mappings for opening applications from voice commands
export const APP_MAPPINGS = {
  browser: {
    name: 'Web Browser',
    command: 'open-browser',
    keywords: ['chrome', 'firefox', 'edge', 'safari', 'browser', 'web', 'internet']
  },
  email: {
    name: 'Email Client',
    command: 'open-email',
    keywords: ['email', 'mail', 'outlook', 'gmail']
  },
  calendar: {
    name: 'Calendar',
    command: 'open-calendar',
    keywords: ['calendar', 'schedule', 'planner', 'appointments']
  },
  notes: { 
    name: 'Notes',
    command: 'open-notes',
    keywords: ['notes', 'note', 'notepad', 'memo']
  },
  terminal: {
    name: 'Terminal',
    command: 'open-terminal',
    keywords: ['terminal', 'command', 'prompt', 'shell', 'console']
  },
  office: {
    name: 'Office Suite',
    command: 'open-office',
    keywords: ['office', 'word', 'excel', 'powerpoint', 'document']
  }
};
