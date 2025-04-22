
/**
 * Voice command service for speech recognition and processing
 * Integrates with Groq API for advanced NLP and multilingual support
 */

import { groqService } from './groqService';

export interface VoiceServiceOptions {
  language?: string; // 'en-US', 'hi-IN', etc.
  continuous?: boolean;
  onInterim?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface VoiceCommand {
  text: string;
  confidence: number;
  intent?: string;
  entities?: Record<string, any>;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private listening = false;
  private language: string;
  private continuous: boolean;
  private onInterim?: (text: string) => void;
  private onError?: (error: string) => void;
  private interimTranscript = '';
  private finalTranscript = '';

  constructor(options: VoiceServiceOptions = {}) {
    this.language = options.language || 'en-US';
    this.continuous = options.continuous || false;
    this.onInterim = options.onInterim;
    this.onError = options.onError;
    this.initRecognition();
  }

  private initRecognition() {
    // Browser check with feature detection
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      
      // Prioritize the standard SpeechRecognition API if available, otherwise use the webkit prefixed version
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      // Configure the speech recognition instance
      this.recognition.lang = this.language;
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = Boolean(this.onInterim);
      
      // Handle speech recognition results
      this.recognition.onresult = (event) => {
        this.interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.finalTranscript += event.results[i][0].transcript;
          } else {
            this.interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Call the interim callback if provided
        if (this.onInterim && this.interimTranscript) {
          this.onInterim(this.interimTranscript);
        }
      };
      
      // Handle errors
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        if (this.onError) {
          this.onError(`Speech recognition error: ${event.error}`);
        }
      };
      
      // Handle speech recognition end
      this.recognition.onend = () => {
        if (this.listening) {
          // If we're still supposed to be listening but it ended, restart it
          this.recognition?.start();
        } else {
          this.listening = false;
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  /**
   * Start voice recognition
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      try {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.listening = true;
        this.recognition.start();
        console.log('Voice recognition started');
        resolve();
      } catch (error) {
        this.listening = false;
        console.error('Error starting speech recognition:', error);
        reject(error);
      }
    });
  }

  /**
   * Stop voice recognition and return the final transcript
   */
  stop(): Promise<string> {
    return new Promise((resolve) => {
      if (this.recognition && this.listening) {
        this.listening = false;
        this.recognition.stop();
        console.log('Voice recognition stopped');
        resolve(this.finalTranscript);
      } else {
        resolve(this.finalTranscript);
      }
    });
  }

  /**
   * Process voice command using Groq's NLP capabilities
   */
  async processCommand(text: string): Promise<VoiceCommand> {
    try {
      // Simple intent detection for demo
      let intent = 'unknown';
      const entities: Record<string, any> = {};
      
      // Use Groq API to process the command if API key is configured
      if (groqService.isConfigured()) {
        const response = await groqService.processCommand(text);
        
        // Simple intent parsing from Groq's response
        if (response.toLowerCase().includes('email')) {
          intent = 'send_email';
          
          // Extract potential recipients
          const matches = response.match(/to\s+([a-zA-Z\s]+)/i);
          if (matches && matches[1]) {
            entities.recipient = matches[1].trim();
          }
        } else if (response.toLowerCase().includes('schedule')) {
          intent = 'create_calendar_event';
        } else if (response.toLowerCase().includes('analyze')) {
          intent = 'analyze_data';
        }
        
        return {
          text,
          confidence: 0.95,
          intent,
          entities
        };
      } else {
        // Fallback to simple intent detection if Groq is not configured
        if (text.toLowerCase().includes('email') || text.toLowerCase().includes('send')) {
          intent = 'send_email';
          
          // Extract potential recipients
          const matches = text.match(/to\s+([a-zA-Z\s]+)/i);
          if (matches && matches[1]) {
            entities.recipient = matches[1].trim();
          }
        } else if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('calendar')) {
          intent = 'create_calendar_event';
          
          // Extract potential date/time
          const dateMatches = text.match(/on\s+([a-zA-Z0-9\s,]+)/i);
          if (dateMatches && dateMatches[1]) {
            entities.date = dateMatches[1].trim();
          }
        } else if (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('data')) {
          intent = 'analyze_data';
        }
        
        return {
          text,
          confidence: 0.8, // Lower confidence for the fallback method
          intent,
          entities
        };
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        text,
        confidence: 0.5,
        intent: 'unknown',
        entities: {}
      };
    }
  }
  
  /**
   * Check if voice recognition is currently active
   */
  isListening(): boolean {
    return this.listening;
  }
  
  /**
   * Change the recognition language
   */
  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  /**
   * Check if browser supports speech recognition
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
  }
}

// Singleton instance for app-wide use
export const voiceService = new VoiceService();

export default voiceService;
