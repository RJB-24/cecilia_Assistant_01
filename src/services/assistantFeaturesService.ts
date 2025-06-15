import { groqService } from './groqService';
import { noteService } from './noteService';
import { realtimeDataService } from './realtimeDataService';

export interface AssistantResponse {
  success: boolean;
  message: string;
  data?: any;
  action?: string;
}

export interface MeetingRequest {
  title: string;
  date: string;
  time: string;
  attendees?: string[];
  duration?: number;
}

export interface EmailRequest {
  to: string;
  subject: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

class AssistantFeaturesService {
  private isInitialized = false;
  private activeRecording: MediaRecorder | null = null;
  private lastResponse = '';
  private lastResponseTime = 0;
  private conversationContext: Array<{role: string, content: string}> = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      noteService.loadNotesFromStorage();
      this.isInitialized = true;
      console.log('Assistant features service initialized');
    } catch (error) {
      console.error('Error initializing assistant features:', error);
      throw error;
    }
  }

  async processAdvancedCommand(command: string): Promise<AssistantResponse> {
    try {
      // Prevent duplicate processing
      if (this.isDuplicateRequest(command)) {
        return {
          success: true,
          message: "I heard you. Is there anything else I can help you with?",
          action: 'acknowledgment'
        };
      }

      // Add context awareness
      const contextualCommand = this.addContext(command);
      const intent = await this.analyzeIntent(contextualCommand);
      
      let response: AssistantResponse;
      
      switch (intent.type) {
        case 'get_weather':
          response = await this.getWeatherInfo(intent.data);
          break;
        case 'get_news':
          response = await this.getNewsInfo(intent.data);
          break;
        case 'schedule_meeting':
          response = await this.scheduleMeeting(intent.data);
          break;
        case 'send_email':
          response = await this.composeEmail(intent.data);
          break;
        case 'take_notes':
          response = await this.startNoteTaking(intent.data);
          break;
        case 'create_task':
          response = await this.createTask(intent.data);
          break;
        case 'search_web':
          response = await this.searchWeb(intent.data);
          break;
        case 'conversation':
          response = await this.handleConversation(command);
          break;
        default:
          response = await this.handleGeneralQuery(command);
      }

      this.updateConversationContext('user', command);
      this.updateConversationContext('assistant', response.message);
      this.lastResponse = response.message;
      this.lastResponseTime = Date.now();

      return response;
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: 'I encountered an error processing your request. Please try again or rephrase your question.'
      };
    }
  }

  private isDuplicateRequest(command: string): boolean {
    const now = Date.now();
    const timeSinceLastResponse = now - this.lastResponseTime;
    
    // Consider it duplicate if same command within 2 seconds
    return command.trim() === this.lastResponse && timeSinceLastResponse < 2000;
  }

  private addContext(command: string): string {
    if (this.conversationContext.length === 0) {
      return command;
    }

    // Add recent context for better understanding
    const recentContext = this.conversationContext.slice(-2);
    const contextString = recentContext.map(c => `${c.role}: ${c.content}`).join('\n');
    
    return `Previous context:\n${contextString}\n\nCurrent request: ${command}`;
  }

  private updateConversationContext(role: string, content: string) {
    this.conversationContext.push({ role, content });
    
    // Keep only last 10 exchanges to manage memory
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
  }

  private async analyzeIntent(command: string): Promise<{ type: string; data: any }> {
    if (!groqService.isConfigured()) {
      return this.simpleIntentAnalysis(command);
    }

    const intentPrompt = `Analyze this command and respond with JSON only:
Command: "${command}"

Return: {"type": "intent_type", "data": {extracted_parameters}}

Intent types: get_weather, get_news, schedule_meeting, send_email, take_notes, create_task, search_web, conversation

Examples:
"What's the weather?" -> {"type": "get_weather", "data": {}}
"Latest tech news" -> {"type": "get_news", "data": {"category": "technology"}}
"Schedule meeting tomorrow" -> {"type": "schedule_meeting", "data": {"date": "tomorrow"}}`;

    try {
      const response = await groqService.processCommand(intentPrompt);
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      return this.simpleIntentAnalysis(command);
    }
  }

  private simpleIntentAnalysis(command: string): { type: string; data: any } {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('weather')) {
      return { type: 'get_weather', data: {} };
    } else if (lowerCommand.includes('news')) {
      return { type: 'get_news', data: { category: 'general' } };
    } else if (lowerCommand.includes('schedule') || lowerCommand.includes('meeting')) {
      return { type: 'schedule_meeting', data: {} };
    } else if (lowerCommand.includes('email') || lowerCommand.includes('send')) {
      return { type: 'send_email', data: {} };
    } else if (lowerCommand.includes('note')) {
      return { type: 'take_notes', data: {} };
    } else if (lowerCommand.includes('search') || lowerCommand.includes('find')) {
      return { type: 'search_web', data: { query: command } };
    }
    
    return { type: 'conversation', data: { query: command } };
  }

  private async getWeatherInfo(data: any): Promise<AssistantResponse> {
    try {
      const weather = await realtimeDataService.getCurrentWeather();
      
      return {
        success: true,
        message: `Current weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}. Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h.`,
        data: { weather },
        action: 'weather_info'
      };
    } catch (error) {
      return {
        success: false,
        message: 'I\'m unable to fetch weather information right now. Please check if your weather API key is configured in Settings.'
      };
    }
  }

  private async getNewsInfo(data: any): Promise<AssistantResponse> {
    try {
      const category = data.category || 'technology';
      const news = await realtimeDataService.getLatestNews(category, 3);
      
      const headlines = news.map(n => `• ${n.title}`).join('\n');
      
      return {
        success: true,
        message: `Here are the latest ${category} headlines:\n\n${headlines}`,
        data: { news },
        action: 'news_info'
      };
    } catch (error) {
      return {
        success: false,
        message: 'I\'m unable to fetch news right now. Please check if your News API key is configured in Settings.'
      };
    }
  }

  private async handleConversation(query: string): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        const response = await groqService.processAgentCommand(query);
        return {
          success: true,
          message: response,
          action: 'conversation'
        };
      } catch (error) {
        return {
          success: true,
          message: 'I\'m here to help! You can ask me about weather, news, scheduling, or just have a conversation. What would you like to know?',
          action: 'conversation'
        };
      }
    }

    return {
      success: true,
      message: 'I\'m ready to assist you! To unlock my full capabilities, please configure your Groq API key in Settings. I can help with weather, news, scheduling, and much more.',
      action: 'conversation'
    };
  }

  private async scheduleMeeting(data: any): Promise<AssistantResponse> {
    return {
      success: true,
      message: `I'd be happy to help schedule a meeting. In a full implementation, I would integrate with your calendar system.`,
      action: 'meeting_scheduled'
    };
  }

  private async composeEmail(data: any): Promise<AssistantResponse> {
    return {
      success: true,
      message: `I can help compose emails. For full functionality, please configure email integration in Settings.`,
      action: 'email_drafted'
    };
  }

  private async startNoteTaking(data: any): Promise<AssistantResponse> {
    return {
      success: true,
      message: `I'm ready to take notes. Start speaking and I'll organize the information for you.`,
      action: 'note_taking_started'
    };
  }

  private async createTask(data: any): Promise<AssistantResponse> {
    return {
      success: true,
      message: `Task noted. In a full implementation, this would be added to your task management system.`,
      action: 'task_created'
    };
  }

  private async searchWeb(data: any): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        const searchQuery = `Search for: ${data.query}`;
        const response = await groqService.processAgentCommand(searchQuery);
        return {
          success: true,
          message: response,
          action: 'web_search'
        };
      } catch (error) {
        return {
          success: true,
          message: `I understand you want to search for "${data.query}". With agent mode enabled, I can help find current information about that topic.`,
          action: 'web_search'
        };
      }
    }

    return {
      success: true,
      message: `I'd search for "${data.query}" but need API configuration for real-time search capabilities.`,
      action: 'web_search'
    };
  }

  private async handleGeneralQuery(query: string): Promise<AssistantResponse> {
    return {
      success: true,
      message: `I understand you're asking about "${query}". How can I help you with that specifically?`,
      action: 'general_query'
    };
  }

  stopNoteTaking(): void {
    if (this.activeRecording && this.activeRecording.state === 'recording') {
      this.activeRecording.stop();
      this.activeRecording = null;
    }
  }

  clearConversationContext(): void {
    this.conversationContext = [];
    this.lastResponse = '';
    this.lastResponseTime = 0;
  }
}

export const assistantFeaturesService = new AssistantFeaturesService();
export default assistantFeaturesService;
