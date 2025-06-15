import { voiceCommandService } from './features/voiceCommandService';
import { voicePersonalityService } from './features/voicePersonalityService';
import { BaseVoiceService } from './baseVoiceService';
import { VoiceServiceOptions, VoiceCommand } from './types';
import { groqService } from '../groqService';
import { realtimeDataService } from '../realtimeDataService';

export class VoiceService extends BaseVoiceService {
  private isMuted: boolean = false;
  private isCurrentlySpeaking: boolean = false;

  constructor(options: VoiceServiceOptions = {}) {
    super(options);
  }

  async start(): Promise<void> {
    await super.start();
  }

  async processCommand(text: string): Promise<VoiceCommand> {
    // Check for command repetition
    if (!this.shouldProcessCommand(text)) {
      return {
        text,
        confidence: 0.5,
        intent: 'duplicate',
        entities: {}
      };
    }

    this.setProcessing(true);
    
    try {
      voicePersonalityService.updateLastInteraction();
      const command = await voiceCommandService.processCommand(text);
      
      // Add intelligent response based on command
      await this.handleCommandResponse(command);
      
      return command;
    } finally {
      this.setProcessing(false);
    }
  }

  private async handleCommandResponse(command: VoiceCommand): Promise<void> {
    if (this.isMuted || this.isCurrentlySpeaking || command.intent === 'duplicate') return;

    let response = "";
    
    try {
      switch (command.intent) {
        case 'get_weather':
          try {
            const weather = await realtimeDataService.getCurrentWeather();
            response = `Current weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}. Humidity is ${weather.humidity}%.`;
          } catch (error) {
            response = "I need a weather API key to get current weather information.";
          }
          break;

        case 'get_news':
          try {
            const news = await realtimeDataService.getLatestNews('technology', 2);
            response = `Latest tech news: ${news.map(n => n.title).slice(0, 2).join('. ')}`;
          } catch (error) {
            response = "I need a news API key to get current headlines.";
          }
          break;

        case 'send_email':
          response = `I'll help you with email${command.entities.recipient ? ` to ${command.entities.recipient}` : ''}. What would you like to say?`;
          break;

        case 'create_calendar_event':
          response = "I'll help you schedule that. What's the meeting about?";
          break;

        case 'take_notes':
          response = `Starting note-taking${command.entities.title ? ` for ${command.entities.title}` : ''}. Go ahead, I'm listening.`;
          break;

        case 'open_application':
          response = `Opening ${command.entities.appName || 'the application'}.`;
          break;

        default:
          // Use Groq for conversational responses
          if (groqService.isConfigured()) {
            try {
              response = await groqService.processCommand(command.text);
              // Keep responses concise for voice
              if (response.length > 200) {
                response = response.substring(0, 200) + "...";
              }
            } catch (error) {
              response = "I understand. How else can I help you?";
            }
          } else {
            response = "I understand. Please configure the Groq API key for full conversation capabilities.";
          }
      }

      await this.speakText(response);
    } catch (error) {
      console.error('Error handling command response:', error);
    }
  }

  async speakText(text: string): Promise<void> {
    if (this.isMuted || this.isCurrentlySpeaking) return;

    this.isCurrentlySpeaking = true;
    
    try {
      // Try Groq TTS first if configured
      if (groqService.isConfigured()) {
        try {
          await groqService.speakText(text, {
            voice: voiceCommandService.getVoice()
          });
          return;
        } catch (error) {
          console.error('Groq TTS error, falling back to browser:', error);
        }
      }
      
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = this.language;
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.volume = 0.8;
          
          // Try to find a good voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Zira') ||
            (voice.lang.includes('en') && voice.name.includes('Google'))
          );
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          utterance.onend = () => {
            this.isCurrentlySpeaking = false;
            resolve();
          };
          utterance.onerror = (error) => {
            this.isCurrentlySpeaking = false;
            reject(error);
          };
          
          window.speechSynthesis.speak(utterance);
        });
      }
      
      throw new Error('No TTS available');
    } catch (error) {
      this.isCurrentlySpeaking = false;
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  setVoice(voice: string): void {
    voiceCommandService.setVoice(voice);
  }
  
  getVoice(): string {
    return voiceCommandService.getVoice();
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

  // Additional method to refresh API configuration
  refreshConfiguration(): void {
    groqService.reconfigure();
  }
}

export const voiceService = new VoiceService();
export default voiceService;
