
import { voiceCommandService } from './features/voiceCommandService';
import { voicePersonalityService } from './features/voicePersonalityService';
import { BaseVoiceService } from './baseVoiceService';
import { VoiceServiceOptions, VoiceCommand } from './types';
import { groqService } from '../groqService';

export class VoiceService extends BaseVoiceService {
  constructor(options: VoiceServiceOptions = {}) {
    super(options);
  }

  async start(): Promise<void> {
    await super.start();
    await this.speakText(voicePersonalityService.getWelcomeMessage());
  }

  async processCommand(text: string): Promise<VoiceCommand> {
    voicePersonalityService.updateLastInteraction();
    return voiceCommandService.processCommand(text);
  }

  async speakText(text: string): Promise<void> {
    try {
      await groqService.speakText(text, {
        voice: voiceCommandService.getVoice()
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error with Groq TTS, falling back to browser:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Karen') ||
          voice.name.includes('Tessa') ||
          voice.name.includes('Victoria')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        return Promise.resolve();
      }
      return Promise.reject(error);
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
}

export const voiceService = new VoiceService();
export default voiceService;
