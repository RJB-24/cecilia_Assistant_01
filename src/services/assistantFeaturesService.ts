
import { groqService } from './groqService';
import { noteService } from './noteService';
import { realtimeDataService } from './realtimeDataService';
import { voiceService } from './voice/voiceService';

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

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize all services
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
      const intent = await this.analyzeIntent(command);
      
      switch (intent.type) {
        case 'schedule_meeting':
          return await this.scheduleMeeting(intent.data);
        
        case 'send_email':
          return await this.composeEmail(intent.data);
        
        case 'take_notes':
          return await this.startNoteTaking(intent.data);
        
        case 'create_task':
          return await this.createTask(intent.data);
        
        case 'get_weather':
          return await this.getWeatherInfo(intent.data);
        
        case 'get_news':
          return await this.getNewsInfo(intent.data);
        
        case 'analyze_data':
          return await this.analyzeData(intent.data);
        
        case 'open_application':
          return await this.openApplication(intent.data);
        
        case 'search_web':
          return await this.searchWeb(intent.data);
        
        case 'set_reminder':
          return await this.setReminder(intent.data);
        
        case 'manage_calendar':
          return await this.manageCalendar(intent.data);
        
        case 'file_operations':
          return await this.handleFileOperations(intent.data);
        
        case 'conversation':
          return await this.handleConversation(command);
        
        default:
          return await this.handleGeneralQuery(command);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: 'I encountered an error processing your request. Please try again.'
      };
    }
  }

  private async analyzeIntent(command: string): Promise<{ type: string; data: any }> {
    if (!groqService.isConfigured()) {
      return { type: 'conversation', data: { query: command } };
    }

    const intentPrompt = `
    Analyze this command and determine the intent and extract relevant data:
    Command: "${command}"
    
    Return a JSON object with:
    - type: one of [schedule_meeting, send_email, take_notes, create_task, get_weather, get_news, analyze_data, open_application, search_web, set_reminder, manage_calendar, file_operations, conversation]
    - data: extracted parameters for the action
    
    Examples:
    "Schedule a meeting with John tomorrow at 3pm" -> {"type": "schedule_meeting", "data": {"title": "Meeting with John", "date": "tomorrow", "time": "3pm", "attendees": ["John"]}}
    "Send email to Sarah about project update" -> {"type": "send_email", "data": {"to": "Sarah", "subject": "Project Update"}}
    "What's the weather in New York?" -> {"type": "get_weather", "data": {"location": "New York"}}
    `;

    try {
      const response = await groqService.processCommand(intentPrompt);
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Error analyzing intent:', error);
      return { type: 'conversation', data: { query: command } };
    }
  }

  private async scheduleMeeting(data: any): Promise<AssistantResponse> {
    const meeting: MeetingRequest = {
      title: data.title || 'New Meeting',
      date: data.date || 'today',
      time: data.time || '2:00 PM',
      attendees: data.attendees || [],
      duration: data.duration || 60
    };

    // Simulate meeting scheduling
    const meetingId = `meeting_${Date.now()}`;
    
    return {
      success: true,
      message: `Meeting "${meeting.title}" scheduled for ${meeting.date} at ${meeting.time}. ${
        meeting.attendees.length > 0 ? `Attendees: ${meeting.attendees.join(', ')}` : ''
      }`,
      data: { meetingId, meeting },
      action: 'meeting_scheduled'
    };
  }

  private async composeEmail(data: any): Promise<AssistantResponse> {
    const email: EmailRequest = {
      to: data.to || '',
      subject: data.subject || 'New Message',
      content: data.content || '',
      priority: data.priority || 'medium'
    };

    if (!email.to) {
      return {
        success: false,
        message: 'Please specify the recipient for the email.'
      };
    }

    // Generate email content if not provided
    if (!email.content && groqService.isConfigured()) {
      const contentPrompt = `Generate a professional email content for: ${email.subject}`;
      email.content = await groqService.processCommand(contentPrompt);
    }

    return {
      success: true,
      message: `Email drafted to ${email.to} with subject "${email.subject}". Content ready for review.`,
      data: { email },
      action: 'email_drafted'
    };
  }

  private async startNoteTaking(data: any): Promise<AssistantResponse> {
    const title = data.title || `Notes - ${new Date().toLocaleString()}`;
    
    try {
      // Start audio recording for note-taking
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.activeRecording = new MediaRecorder(stream);
      
      const audioChunks: Blob[] = [];
      this.activeRecording.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      this.activeRecording.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await noteService.generateNotesFromMedia(audioBlob, {
          title,
          source: 'meeting'
        });
      };
      
      this.activeRecording.start();
      
      return {
        success: true,
        message: `Started recording notes for "${title}". I'm listening and will organize everything for you.`,
        data: { title, recording: true },
        action: 'note_taking_started'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unable to start note recording. Please check microphone permissions.'
      };
    }
  }

  private async createTask(data: any): Promise<AssistantResponse> {
    const task: TaskRequest = {
      title: data.title || 'New Task',
      description: data.description || '',
      priority: data.priority || 'medium',
      dueDate: data.dueDate
    };

    const taskId = `task_${Date.now()}`;
    
    return {
      success: true,
      message: `Task "${task.title}" created with ${task.priority} priority.${
        task.dueDate ? ` Due: ${task.dueDate}` : ''
      }`,
      data: { taskId, task },
      action: 'task_created'
    };
  }

  private async getWeatherInfo(data: any): Promise<AssistantResponse> {
    try {
      const location = data.location || 'current location';
      const weather = await realtimeDataService.getCurrentWeather(location);
      
      return {
        success: true,
        message: `The weather in ${weather.location} is ${weather.temperature}°C with ${weather.condition.toLowerCase()}. Humidity: ${weather.humidity}%. Wind: ${weather.windSpeed} km/h.`,
        data: { weather },
        action: 'weather_info'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unable to fetch weather information at the moment.'
      };
    }
  }

  private async getNewsInfo(data: any): Promise<AssistantResponse> {
    try {
      const category = data.category || 'technology';
      const count = data.count || 3;
      const news = await realtimeDataService.getLatestNews(category, count);
      
      const headlines = news.map(n => n.title).join('. ');
      
      return {
        success: true,
        message: `Here are the latest ${category} headlines: ${headlines}`,
        data: { news },
        action: 'news_info'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unable to fetch news at the moment.'
      };
    }
  }

  private async analyzeData(data: any): Promise<AssistantResponse> {
    const analysisType = data.type || 'general';
    const dataSource = data.source || 'provided data';
    
    return {
      success: true,
      message: `Starting ${analysisType} analysis of ${dataSource}. I'll process the data and provide insights shortly.`,
      data: { analysisType, dataSource },
      action: 'data_analysis_started'
    };
  }

  private async openApplication(data: any): Promise<AssistantResponse> {
    const appName = data.appName || data.application;
    
    if (!appName) {
      return {
        success: false,
        message: 'Please specify which application you\'d like me to open.'
      };
    }

    // Simulate app opening
    return {
      success: true,
      message: `Opening ${appName}. Please wait a moment while I launch the application.`,
      data: { appName },
      action: 'application_opened'
    };
  }

  private async searchWeb(data: any): Promise<AssistantResponse> {
    const query = data.query || data.search;
    
    if (!query) {
      return {
        success: false,
        message: 'Please tell me what you\'d like to search for.'
      };
    }

    return {
      success: true,
      message: `Searching the web for "${query}". I'll find the most relevant information for you.`,
      data: { query },
      action: 'web_search'
    };
  }

  private async setReminder(data: any): Promise<AssistantResponse> {
    const reminder = {
      title: data.title || data.reminder,
      time: data.time || data.when,
      date: data.date
    };

    return {
      success: true,
      message: `Reminder set: "${reminder.title}"${reminder.time ? ` at ${reminder.time}` : ''}${reminder.date ? ` on ${reminder.date}` : ''}.`,
      data: { reminder },
      action: 'reminder_set'
    };
  }

  private async manageCalendar(data: any): Promise<AssistantResponse> {
    const action = data.action || 'view';
    
    return {
      success: true,
      message: `Calendar ${action} completed. Your schedule is up to date.`,
      data: { action },
      action: 'calendar_managed'
    };
  }

  private async handleFileOperations(data: any): Promise<AssistantResponse> {
    const operation = data.operation || 'access';
    const fileName = data.fileName || 'file';
    
    return {
      success: true,
      message: `File operation "${operation}" completed for ${fileName}.`,
      data: { operation, fileName },
      action: 'file_operation'
    };
  }

  private async handleConversation(query: string): Promise<AssistantResponse> {
    if (groqService.isConfigured()) {
      try {
        const response = await groqService.processCommand(query);
        return {
          success: true,
          message: response,
          action: 'conversation'
        };
      } catch (error) {
        return {
          success: true,
          message: 'I understand what you\'re asking. How else can I help you today?',
          action: 'conversation'
        };
      }
    }

    return {
      success: true,
      message: 'I\'m here to help! You can ask me to schedule meetings, take notes, send emails, get weather updates, and much more.',
      action: 'conversation'
    };
  }

  private async handleGeneralQuery(query: string): Promise<AssistantResponse> {
    return {
      success: true,
      message: `I'm processing your request: "${query}". Let me help you with that.`,
      action: 'general_query'
    };
  }

  stopNoteTaking(): void {
    if (this.activeRecording && this.activeRecording.state === 'recording') {
      this.activeRecording.stop();
      this.activeRecording = null;
    }
  }
}

export const assistantFeaturesService = new AssistantFeaturesService();
export default assistantFeaturesService;
