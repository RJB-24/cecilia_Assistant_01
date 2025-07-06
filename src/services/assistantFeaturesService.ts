
import { groqService } from './groqService';
import { realtimeDataService } from './realtimeDataService';
import { voiceService } from './voice/voiceService';

export interface AssistantResponse {
  success: boolean;
  message: string;
  data?: any;
  actionTaken?: string;
}

export class AssistantFeaturesService {
  private isInitialized = false;
  private availableModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant', 
    'deepseek-r1-distill-llama-70b',
    'compound-beta',
    'compound-beta-mini'
  ];

  async initialize(): Promise<void> {
    try {
      console.log('Initializing CECILIA Assistant Features...');
      
      // Initialize Groq service
      if (!groqService.isConfigured()) {
        console.warn('Groq API not configured. Some features will be limited.');
      }

      // Test voice capabilities
      if (voiceService.isSupported()) {
        console.log('Voice recognition supported');
      } else {
        console.warn('Voice recognition not supported in this browser');
      }

      this.isInitialized = true;
      console.log('CECILIA Assistant Features initialized successfully');
    } catch (error) {
      console.error('Failed to initialize assistant features:', error);
      throw error;
    }
  }

  async processAdvancedCommand(command: string): Promise<AssistantResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Processing advanced command:', command);

      // Determine intent and route to appropriate handler
      const intent = await this.analyzeIntent(command);
      
      switch (intent) {
        case 'weather':
          return await this.handleWeatherQuery(command);
        
        case 'news':
          return await this.handleNewsQuery(command);
        
        case 'email':
          return await this.handleEmailCommand(command);
        
        case 'schedule':
          return await this.handleScheduleCommand(command);
        
        case 'analysis':
          return await this.handleDataAnalysis(command);
        
        case 'automation':
          return await this.handleAutomationCommand(command);
        
        case 'search':
          return await this.handleWebSearch(command);
        
        default:
          return await this.handleGeneralConversation(command);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: 'I encountered an error processing your request. Please try again.',
        actionTaken: 'error_handling'
      };
    }
  }

  private async analyzeIntent(command: string): Promise<string> {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('weather') || lowerCommand.includes('temperature')) {
      return 'weather';
    }
    if (lowerCommand.includes('news') || lowerCommand.includes('headlines')) {
      return 'news';
    }
    if (lowerCommand.includes('email') || lowerCommand.includes('send message')) {
      return 'email';
    }
    if (lowerCommand.includes('schedule') || lowerCommand.includes('calendar') || lowerCommand.includes('meeting')) {
      return 'schedule';
    }
    if (lowerCommand.includes('analyze') || lowerCommand.includes('data') || lowerCommand.includes('calculate')) {
      return 'analysis';
    }
    if (lowerCommand.includes('open') || lowerCommand.includes('launch') || lowerCommand.includes('automate')) {
      return 'automation';
    }
    if (lowerCommand.includes('search') || lowerCommand.includes('find') || lowerCommand.includes('look up')) {
      return 'search';
    }
    
    return 'conversation';
  }

  private async handleWeatherQuery(command: string): Promise<AssistantResponse> {
    try {
      const weather = await realtimeDataService.getCurrentWeather();
      return {
        success: true,
        message: `Current weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}. Humidity is ${weather.humidity}%, wind speed ${weather.windSpeed} km/h.`,
        data: weather,
        actionTaken: 'weather_query'
      };
    } catch (error) {
      return {
        success: false,
        message: 'I need weather API access to get current conditions. Please configure your weather API key in settings.',
        actionTaken: 'weather_error'
      };
    }
  }

  private async handleNewsQuery(command: string): Promise<AssistantResponse> {
    try {
      const category = this.extractNewsCategory(command);
      const news = await realtimeDataService.getLatestNews(category, 5);
      
      const headlines = news.slice(0, 3).map((article, index) => 
        `${index + 1}. ${article.title}`
      ).join('\n');

      return {
        success: true,
        message: `Here are the latest ${category} headlines:\n${headlines}`,
        data: news,
        actionTaken: 'news_query'
      };
    } catch (error) {
      return {
        success: false,
        message: 'I need news API access to get current headlines. Please configure your news API key in settings.',
        actionTaken: 'news_error'
      };
    }
  }

  private extractNewsCategory(command: string): string {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('tech') || lowerCommand.includes('technology')) return 'technology';
    if (lowerCommand.includes('business') || lowerCommand.includes('finance')) return 'business';
    if (lowerCommand.includes('sports')) return 'sports';
    if (lowerCommand.includes('health')) return 'health';
    if (lowerCommand.includes('science')) return 'science';
    return 'general';
  }

  private async handleEmailCommand(command: string): Promise<AssistantResponse> {
    // Extract email details from command
    const recipient = this.extractEmailRecipient(command);
    const subject = this.extractEmailSubject(command);
    
    return {
      success: true,
      message: `I'll help you compose an email${recipient ? ` to ${recipient}` : ''}${subject ? ` with subject "${subject}"` : ''}. What would you like to say in the message body?`,
      data: { recipient, subject },
      actionTaken: 'email_compose'
    };
  }

  private extractEmailRecipient(command: string): string | null {
    const match = command.match(/to\s+([a-zA-Z@.\s]+)/i);
    return match ? match[1].trim() : null;
  }

  private extractEmailSubject(command: string): string | null {
    const match = command.match(/subject\s+["']?([^"']+)["']?/i);
    return match ? match[1].trim() : null;
  }

  private async handleScheduleCommand(command: string): Promise<AssistantResponse> {
    return {
      success: true,
      message: 'I\'ll help you schedule that event. Please provide the meeting details: date, time, participants, and agenda.',
      actionTaken: 'schedule_assist'
    };
  }

  private async handleDataAnalysis(command: string): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        // Use compound-beta for analysis tasks
        const response = await groqService.processCommand(command, {
          model: 'compound-beta',
          temperature: 0.3
        });
        
        return {
          success: true,
          message: response,
          actionTaken: 'data_analysis'
        };
      } catch (error) {
        return {
          success: false,
          message: 'I encountered an error during analysis. Please check your data format and try again.',
          actionTaken: 'analysis_error'
        };
      }
    } else {
      return {
        success: false,
        message: 'I need Groq API access for advanced data analysis. Please configure your API key.',
        actionTaken: 'analysis_config_needed'
      };
    }
  }

  private async handleAutomationCommand(command: string): Promise<AssistantResponse> {
    return {
      success: true,
      message: 'Automation features are ready. I can help you open applications, manage files, and control system settings. What would you like me to automate?',
      actionTaken: 'automation_ready'
    };
  }

  private async handleWebSearch(command: string): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        // Use compound-beta for web search capabilities
        const response = await groqService.processCommand(command, {
          model: 'compound-beta',
          temperature: 0.5
        });
        
        return {
          success: true,
          message: response,
          actionTaken: 'web_search'
        };
      } catch (error) {
        return {
          success: false,
          message: 'I couldn\'t perform the web search right now. Please try again.',
          actionTaken: 'search_error'
        };
      }
    } else {
      return {
        success: false,
        message: 'Web search requires Groq API access. Please configure your API key for this feature.',
        actionTaken: 'search_config_needed'
      };
    }
  }

  private async handleGeneralConversation(command: string): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        const response = await groqService.processCommand(command, {
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 200
        });
        
        return {
          success: true,
          message: response,
          actionTaken: 'conversation'
        };
      } catch (error) {
        return {
          success: false,
          message: 'I understand your request. How else can I help you today?',
          actionTaken: 'conversation_fallback'
        };
      }
    } else {
      return {
        success: true,
        message: 'I\'m here to help! Please configure the Groq API key in settings to unlock my full conversational capabilities.',
        actionTaken: 'conversation_limited'
      };
    }
  }

  getAvailableModels(): string[] {
    return [...this.availableModels];
  }

  isFeatureInitialized(): boolean {
    return this.isInitialized;
  }
}

export const assistantFeaturesService = new AssistantFeaturesService();
export default assistantFeaturesService;
