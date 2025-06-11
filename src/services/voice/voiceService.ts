
import { voiceCommandService } from './features/voiceCommandService';
import { voicePersonalityService } from './features/voicePersonalityService';
import { BaseVoiceService } from './baseVoiceService';
import { VoiceServiceOptions, VoiceCommand } from './types';
import { groqService } from '../groqService';
import { realtimeDataService } from '../realtimeDataService';

export class VoiceService extends BaseVoiceService {
  private isMuted: boolean = false;

  constructor(options: VoiceServiceOptions = {}) {
    super(options);
  }

  async start(): Promise<void> {
    await super.start();
    
    // Get real-time context for dynamic welcome
    const weatherData = await realtimeDataService.getCurrentWeather();
    const newsData = await realtimeDataService.getLatestNews('technology', 1);
    
    let welcomeMessage = voicePersonalityService.getWelcomeMessage();
    
    // Add dynamic context
    if (weatherData) {
      welcomeMessage += ` The current weather in ${weatherData.location} is ${weatherData.temperature} degrees and ${weatherData.condition.toLowerCase()}.`;
    }
    
    if (newsData.length > 0) {
      welcomeMessage += ` In today's tech news: ${newsData[0].title}`;
    }
    
    await this.speakText(welcomeMessage);
  }

  async processCommand(text: string): Promise<VoiceCommand> {
    voicePersonalityService.updateLastInteraction();
    const command = await voiceCommandService.processCommand(text);
    
    // Add intelligent response based on command
    await this.handleCommandResponse(command);
    
    return command;
  }

  private async handleCommandResponse(command: VoiceCommand): Promise<void> {
    if (this.isMuted) return;

    let response = "";
    
    switch (command.intent) {
      case 'send_email':
        response = `I'll help you draft an email${command.entities.recipient ? ` to ${command.entities.recipient}` : ''}. What would you like to say?`;
        break;
      case 'create_calendar_event':
        response = "I'll schedule that event for you. Let me check your calendar for availability.";
        break;
      case 'analyze_data':
        response = "I'll analyze the data and provide insights. This may take a moment.";
        break;
      case 'take_notes':
        response = `Starting note-taking${command.entities.title ? ` for ${command.entities.title}` : ''}. I'm listening and will organize the information for you.`;
        break;
      case 'open_application':
        response = `Opening ${command.entities.appName || 'the application'} now.`;
        break;
      case 'get_weather':
        const weather = await realtimeDataService.getCurrentWeather();
        response = `The current weather in ${weather.location} is ${weather.temperature} degrees celsius with ${weather.condition.toLowerCase()}. Humidity is at ${weather.humidity}%.`;
        break;
      case 'get_news':
        const news = await realtimeDataService.getLatestNews('technology', 3);
        response = `Here are the latest tech headlines: ${news.map(n => n.title).join('. ')}`;
        break;
      default:
        response = "I understand. Let me process that for you.";
    }

    await this.speakText(response);
  }

  async speakText(text: string): Promise<void> {
    if (this.isMuted) return;

    try {
      // Use Groq TTS first
      await groqService.speakText(text, {
        voice: voiceCommandService.getVoice()
      });
    } catch (error) {
      console.error('Error with Groq TTS, falling back to browser:', error);
      
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = this.language;
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.volume = 0.8;
          
          // Try to find a female voice
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Tessa') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Zira') ||
            voice.lang.includes('en') && voice.name.includes('Google')
          );
          
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
          
          utterance.onend = () => resolve();
          utterance.onerror = (error) => reject(error);
          
          window.speechSynthesis.speak(utterance);
        });
      }
      throw error;
    }
  }

  setVoice(voice: string): void {
    voiceCommandService.setVoice(voice);
  }
  
  getVoice(): string {
    return voiceCommandService.getVoice();
  }

  setPersonalityTrait(trait: 'humor' | 'proactive' | 'formality', value: boolean | string): void {
    voicePersonalityService.setPersonalityTrait(trait, value);
  }

  setWelcomeMessage(message: string): void {
    voicePersonalityService.setWelcomeMessage(message);
  }

  addImportantEvent(date: Date, description: string): void {
    voicePersonalityService.addImportantEvent(date, description);
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSpeechMuted(): boolean {
    return this.isMuted;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
