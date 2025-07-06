
import { voiceCommandService } from './features/voiceCommandService';
import { voicePersonalityService } from './features/voicePersonalityService';
import { BaseVoiceService } from './baseVoiceService';
import { VoiceServiceOptions, VoiceCommand } from './types';
import { groqService } from '../groqService';
import { realtimeDataService } from '../realtimeDataService';

export class VoiceService extends BaseVoiceService {
  private isMuted: boolean = false;
  private isCurrentlySpeaking: boolean = false;
  private currentModel: string = 'llama-3.3-70b-versatile';

  constructor(options: VoiceServiceOptions = {}) {
    super(options);
  }

  async start(): Promise<void> {
    await super.start();
  }

  async processCommand(text: string): Promise<VoiceCommand> {
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
            response = `Current weather: ${weather.temperature}°C, ${weather.condition}. Humidity ${weather.humidity}%.`;
          } catch (error) {
            response = "I need weather API configuration to get current conditions.";
          }
          break;

        case 'get_news':
          try {
            const news = await realtimeDataService.getLatestNews('general', 3);
            response = `Latest headlines: ${news.map(n => n.title).slice(0, 2).join('. ')}`;
          } catch (error) {
            response = "I need news API access to get current headlines.";
          }
          break;

        case 'send_email':
          response = `I'll help you compose an email${command.entities.recipient ? ` to ${command.entities.recipient}` : ''}. What would you like to say?`;
          break;

        case 'create_calendar_event':
          response = "I'll help you schedule that event. Please provide the details.";
          break;

        case 'take_notes':
          response = `Starting note-taking session${command.entities.title ? ` for ${command.entities.title}` : ''}. Go ahead.`;
          break;

        case 'open_application':
          response = `Opening ${command.entities.appName || 'the application'} now.`;
          break;

        case 'analyze_data':
          response = "I'm ready to analyze your data. Please share the dataset or specify the analysis type.";
          break;

        default:
          if (groqService.isConfigured()) {
            try {
              response = await groqService.processCommand(command.text, {
                model: this.currentModel,
                temperature: 0.7,
                max_tokens: 150
              });
              if (response.length > 200) {
                response = response.substring(0, 200) + "...";
              }
            } catch (error) {
              response = "I understand. How else can I assist you?";
            }
          } else {
            response = "Please configure the Groq API key in settings for full conversational capabilities.";
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
      if (groqService.isConfigured()) {
        try {
          await groqService.speakText(text, {
            voice: voiceCommandService.getVoice(),
            model: 'playai-tts'
          });
          return;
        } catch (error) {
          console.error('Groq TTS error, using browser TTS:', error);
        }
      }
      
      if ('speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = this.language;
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.volume = 0.8;
          
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
    } finally {
      this.isCurrentlySpeaking = false;
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
      this.isCurrentlySpeaking = false;
    }
  }

  isSpeechMuted(): boolean {
    return this.isMuted;
  }

  setModel(model: string): void {
    this.currentModel = model;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  refreshConfiguration(): void {
    groqService.reconfigure();
  }
}

export const voiceService = new VoiceService();
export default voiceService;
