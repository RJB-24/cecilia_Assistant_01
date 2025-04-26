// Application mappings for opening applications from voice commands
export const APP_MAPPINGS = {
  // Browsers
  browser: {
    name: 'Web Browser',
    command: 'open-browser',
    keywords: ['chrome', 'firefox', 'edge', 'safari', 'browser', 'web', 'internet']
  },
  chrome: {
    name: 'Google Chrome',
    command: 'chrome',
    keywords: ['chrome', 'google chrome', 'browser']
  },
  firefox: {
    name: 'Firefox',
    command: 'firefox',
    keywords: ['firefox', 'mozilla', 'firefox browser']
  },
  edge: {
    name: 'Microsoft Edge',
    command: 'msedge',
    keywords: ['edge', 'microsoft edge', 'edge browser']
  },
  safari: {
    name: 'Safari',
    command: 'safari',
    keywords: ['safari', 'apple browser', 'safari browser']
  },
  
  // Productivity
  email: {
    name: 'Email Client',
    command: 'open-email',
    keywords: ['email', 'mail', 'outlook', 'gmail']
  },
  outlook: {
    name: 'Microsoft Outlook',
    command: 'outlook',
    keywords: ['outlook', 'microsoft outlook', 'email', 'mail']
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
  word: {
    name: 'Microsoft Word',
    command: 'winword',
    keywords: ['word', 'microsoft word', 'document', 'doc']
  },
  excel: {
    name: 'Microsoft Excel',
    command: 'excel',
    keywords: ['excel', 'microsoft excel', 'spreadsheet']
  },
  powerpoint: {
    name: 'Microsoft PowerPoint',
    command: 'powerpnt',
    keywords: ['powerpoint', 'microsoft powerpoint', 'presentation', 'slides']
  },
  
  // Development
  terminal: {
    name: 'Terminal',
    command: 'open-terminal',
    keywords: ['terminal', 'command', 'prompt', 'shell', 'console']
  },
  vscode: {
    name: 'Visual Studio Code',
    command: 'code',
    keywords: ['vscode', 'visual studio code', 'code editor', 'vs code']
  },
  
  // Communication
  slack: {
    name: 'Slack',
    command: 'slack',
    keywords: ['slack', 'slack app', 'chat']
  },
  teams: {
    name: 'Microsoft Teams',
    command: 'teams',
    keywords: ['teams', 'microsoft teams', 'meeting']
  },
  zoom: {
    name: 'Zoom',
    command: 'zoom',
    keywords: ['zoom', 'zoom meeting', 'video call']
  },
  discord: {
    name: 'Discord',
    command: 'discord',
    keywords: ['discord', 'chat', 'gaming']
  },
  
  // Media
  spotify: {
    name: 'Spotify',
    command: 'spotify',
    keywords: ['spotify', 'music', 'streaming']
  },
  netflix: {
    name: 'Netflix',
    command: 'netflix',
    browserUrl: 'https://netflix.com',
    keywords: ['netflix', 'streaming', 'movies', 'shows']
  },
  youtube: {
    name: 'YouTube',
    command: 'youtube',
    browserUrl: 'https://youtube.com',
    keywords: ['youtube', 'videos', 'streaming']
  },
  
  // System Tools
  settings: {
    name: 'Settings',
    command: 'open-settings',
    keywords: ['settings', 'system settings', 'preferences', 'control panel']
  },
  calculator: {
    name: 'Calculator',
    command: 'calc',
    keywords: ['calculator', 'calc', 'math']
  },
  explorer: {
    name: 'File Explorer',
    command: 'explorer',
    keywords: ['explorer', 'file explorer', 'files', 'documents', 'folder']
  },
  
  // Others
  camera: {
    name: 'Camera',
    command: 'camera',
    keywords: ['camera', 'webcam', 'photo']
  },
  photos: {
    name: 'Photos',
    command: 'photos',
    keywords: ['photos', 'gallery', 'images', 'pictures']
  }
};

// Helper function to find app mappings by keyword
export const findAppByKeyword = (keyword: string): typeof APP_MAPPINGS[keyof typeof APP_MAPPINGS] | null => {
  const loweredKeyword = keyword.toLowerCase();
  
  // Direct mapping check
  const directMatch = Object.values(APP_MAPPINGS).find(
    app => app.name.toLowerCase() === loweredKeyword || app.command.toLowerCase() === loweredKeyword
  );
  
  if (directMatch) return directMatch;
  
  // Keyword check
  for (const app of Object.values(APP_MAPPINGS)) {
    if (app.keywords.some(k => loweredKeyword.includes(k))) {
      return app;
    }
  }
  
  return null;
};

export default APP_MAPPINGS;
