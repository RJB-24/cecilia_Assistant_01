
/**
 * Voice Configuration Service for Groq TTS Integration
 * Provides configuration and utilities for voice synthesis and recognition
 */

import { BaseNLPService } from './baseService';
import { NLPOptions } from './types';

export interface VoiceConfig {
  voice: string;
  speed: number;
  language: string;
  volume: number;
  autoPlay: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  previewText: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
}

export class VoiceConfigService extends BaseNLPService {
  // Available English voices from Groq's PlayAI TTS
  private englishVoices: VoiceProfile[] = [
    { id: 'Arista-PlayAI', name: 'Arista', description: 'Professional female voice', previewText: 'Hello, I am Arista, your professional assistant.', language: 'en-US', gender: 'female' },
    { id: 'Atlas-PlayAI', name: 'Atlas', description: 'Authoritative male voice', previewText: 'Hello, I am Atlas, ready to assist you.', language: 'en-US', gender: 'male' },
    { id: 'Basil-PlayAI', name: 'Basil', description: 'Friendly male voice', previewText: 'Hello, I am Basil, happy to help you today.', language: 'en-US', gender: 'male' },
    { id: 'Briggs-PlayAI', name: 'Briggs', description: 'Mature male voice', previewText: 'Hello, I am Briggs, at your service.', language: 'en-US', gender: 'male' },
    { id: 'Calum-PlayAI', name: 'Calum', description: 'Young male voice', previewText: 'Hello, I am Calum, let me know how I can help.', language: 'en-US', gender: 'male' },
    { id: 'Celeste-PlayAI', name: 'Celeste', description: 'Warm female voice', previewText: 'Hello, I am Celeste, how can I assist you today?', language: 'en-US', gender: 'female' },
    { id: 'Cheyenne-PlayAI', name: 'Cheyenne', description: 'Energetic female voice', previewText: 'Hello, I am Cheyenne, excited to work with you!', language: 'en-US', gender: 'female' },
    { id: 'Chip-PlayAI', name: 'Chip', description: 'Cheerful male voice', previewText: 'Hello, I am Chip, ready for anything you need!', language: 'en-US', gender: 'male' },
    { id: 'Cillian-PlayAI', name: 'Cillian', description: 'Calm male voice', previewText: 'Hello, I am Cillian, here to assist you.', language: 'en-US', gender: 'male' },
    { id: 'Deedee-PlayAI', name: 'Deedee', description: 'Lively female voice', previewText: 'Hello, I am Deedee, let\'s get things done!', language: 'en-US', gender: 'female' },
    { id: 'Fritz-PlayAI', name: 'Fritz', description: 'Default assistant voice', previewText: 'Hello, I am Fritz, your personal assistant.', language: 'en-US', gender: 'male' },
    { id: 'Gail-PlayAI', name: 'Gail', description: 'Clear female voice', previewText: 'Hello, I am Gail, ready to assist you today.', language: 'en-US', gender: 'female' },
    { id: 'Indigo-PlayAI', name: 'Indigo', description: 'Neutral voice', previewText: 'Hello, I am Indigo, how may I help you?', language: 'en-US', gender: 'neutral' },
    { id: 'Mamaw-PlayAI', name: 'Mamaw', description: 'Warm grandmother-like voice', previewText: 'Hello, I am Mamaw, here to help you, dear.', language: 'en-US', gender: 'female' },
    { id: 'Mason-PlayAI', name: 'Mason', description: 'Confident male voice', previewText: 'Hello, I am Mason, ready to assist you.', language: 'en-US', gender: 'male' },
    { id: 'Mikail-PlayAI', name: 'Mikail', description: 'Thoughtful male voice', previewText: 'Hello, I am Mikail, how can I help you today?', language: 'en-US', gender: 'male' },
    { id: 'Mitch-PlayAI', name: 'Mitch', description: 'Reliable male voice', previewText: 'Hello, I am Mitch, at your service.', language: 'en-US', gender: 'male' },
    { id: 'Quinn-PlayAI', name: 'Quinn', description: 'Versatile voice', previewText: 'Hello, I am Quinn, ready to assist you.', language: 'en-US', gender: 'neutral' },
    { id: 'Thunder-PlayAI', name: 'Thunder', description: 'Bold male voice', previewText: 'Hello, I am Thunder, ready for any challenge!', language: 'en-US', gender: 'male' }
  ];

  // Available Arabic voices from Groq's PlayAI TTS
  private arabicVoices: VoiceProfile[] = [
    { id: 'Ahmad-PlayAI', name: 'Ahmad', description: 'Professional Arabic male voice', previewText: 'مرحبا، أنا أحمد، مساعدك الشخصي.', language: 'ar', gender: 'male' },
    { id: 'Amira-PlayAI', name: 'Amira', description: 'Clear Arabic female voice', previewText: 'مرحبا، أنا أميرة، كيف يمكنني مساعدتك اليوم؟', language: 'ar', gender: 'female' },
    { id: 'Khalid-PlayAI', name: 'Khalid', description: 'Calm Arabic male voice', previewText: 'مرحبا، أنا خالد، في خدمتك.', language: 'ar', gender: 'male' },
    { id: 'Nasser-PlayAI', name: 'Nasser', description: 'Authoritative Arabic male voice', previewText: 'مرحبا، أنا ناصر، مساعدك الموثوق به.', language: 'ar', gender: 'male' }
  ];

  private defaultConfig: VoiceConfig = {
    voice: 'Fritz-PlayAI',
    speed: 1.0,
    language: 'en-US',
    volume: 1.0,
    autoPlay: true
  };

  private currentConfig: VoiceConfig;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isPlaying: boolean = false;

  constructor() {
    super();
    this.currentConfig = this.loadConfig();
  }

  /**
   * Load voice configuration from local storage or use defaults
   */
  private loadConfig(): VoiceConfig {
    try {
      const savedConfig = localStorage.getItem('voiceConfig');
      if (savedConfig) {
        return JSON.parse(savedConfig);
      }
    } catch (error) {
      console.warn('Failed to load voice configuration:', error);
    }
    return { ...this.defaultConfig };
  }

  /**
   * Save voice configuration to local storage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem('voiceConfig', JSON.stringify(this.currentConfig));
    } catch (error) {
      console.error('Failed to save voice configuration:', error);
    }
  }

  /**
   * Get current voice configuration
   */
  getConfig(): VoiceConfig {
    return { ...this.currentConfig };
  }

  /**
   * Update voice configuration
   */
  updateConfig(config: Partial<VoiceConfig>): VoiceConfig {
    this.currentConfig = { ...this.currentConfig, ...config };
    this.saveConfig();
    return { ...this.currentConfig };
  }

  /**
   * Get all available voices
   */
  getAllVoices(): VoiceProfile[] {
    return [...this.englishVoices, ...this.arabicVoices];
  }

  /**
   * Get voices filtered by language
   */
  getVoicesByLanguage(language: string): VoiceProfile[] {
    if (language.startsWith('ar')) {
      return [...this.arabicVoices];
    } else {
      return [...this.englishVoices];
    }
  }

  /**
   * Get voice profile by ID
   */
  getVoiceById(id: string): VoiceProfile | undefined {
    return [...this.englishVoices, ...this.arabicVoices].find(voice => voice.id === id);
  }

  /**
   * Generate speech from text using Groq's API
   */
  async textToSpeech(text: string, options?: Partial<NLPOptions>): Promise<AudioBuffer | null> {
    this.checkConfiguration();
    
    const voiceId = options?.voice || this.currentConfig.voice;
    
    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.MODELS.tts,
          input: text,
          voice: voiceId,
          response_format: 'wav'
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const audioData = await response.arrayBuffer();
      
      // Auto-play if enabled
      if (this.currentConfig.autoPlay) {
        await this.playAudio(audioData);
      }
      
      return this.decodeAudio(audioData);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Play an audio buffer with the current configuration settings
   */
  async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (this.isPlaying) {
      this.stopAllAudio();
    }
    
    try {
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Apply current configuration
      audio.volume = this.currentConfig.volume;
      audio.playbackRate = this.currentConfig.speed;
      
      // Track playback state
      this.isPlaying = true;
      audio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      this.isPlaying = false;
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  /**
   * Decode an array buffer into an audio buffer
   */
  private async decodeAudio(audioData: ArrayBuffer): Promise<AudioBuffer | null> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return await audioContext.decodeAudioData(audioData);
    } catch (error) {
      console.error('Error decoding audio data:', error);
      return null;
    }
  }

  /**
   * Stop all currently playing audio
   */
  stopAllAudio(): void {
    if (!this.isPlaying) return;
    
    // Create a new audio context to stop any ongoing audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContext.close();
    
    this.isPlaying = false;
  }

  /**
   * Generate a spoken preview of a voice
   */
  async previewVoice(voiceId: string): Promise<void> {
    const voice = this.getVoiceById(voiceId);
    if (!voice) {
      throw new Error(`Voice with ID ${voiceId} not found`);
    }
    
    await this.textToSpeech(voice.previewText, { voice: voiceId });
  }

  /**
   * Check if the browser supports speech synthesis
   */
  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Get default voice for a language
   */
  getDefaultVoiceForLanguage(language: string): string {
    if (language.startsWith('ar')) {
      return 'Ahmad-PlayAI'; // Default Arabic voice
    } else {
      return 'Fritz-PlayAI'; // Default English voice
    }
  }
}

// Export singleton instance
export const voiceConfigService = new VoiceConfigService();
export default voiceConfigService;
