
import { VoiceServiceOptions } from './types';

export class BaseVoiceService {
  protected recognition: SpeechRecognition | null = null;
  protected listening = false;
  protected language: string;
  protected continuous: boolean;
  protected onInterim?: (text: string) => void;
  protected onError?: (error: string) => void;
  protected interimTranscript = '';
  protected finalTranscript = '';
  protected lastProcessedCommand = '';
  protected lastProcessedTime = 0;
  protected isProcessing = false;

  constructor(options: VoiceServiceOptions = {}) {
    this.language = options.language || 'en-US';
    this.continuous = options.continuous || false;
    this.onInterim = options.onInterim;
    this.onError = options.onError;
    this.initRecognition();
  }

  protected initRecognition() {
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      this.recognition.lang = this.language;
      this.recognition.continuous = false; // Set to false to avoid repetition
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          this.finalTranscript = finalTranscript.trim();
        }
        
        if (interimTranscript && this.onInterim) {
          this.onInterim(interimTranscript);
        }
      };
      
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.listening = false;
        if (this.onError) {
          this.onError(`Speech recognition error: ${event.error}`);
        }
      };
      
      this.recognition.onend = () => {
        this.listening = false;
      };
    }
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    if (this.listening) {
      return; // Already listening
    }

    return new Promise((resolve, reject) => {
      try {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.listening = true;
        this.recognition!.start();
        resolve();
      } catch (error) {
        this.listening = false;
        reject(error);
      }
    });
  }

  async stop(): Promise<string> {
    return new Promise((resolve) => {
      if (this.recognition && this.listening) {
        this.listening = false;
        this.recognition.stop();
        
        // Wait a bit for final results
        setTimeout(() => {
          const result = this.finalTranscript;
          this.finalTranscript = '';
          resolve(result);
        }, 100);
      } else {
        resolve(this.finalTranscript);
      }
    });
  }

  isListening(): boolean {
    return this.listening;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
  }

  // Prevent command repetition
  protected shouldProcessCommand(command: string): boolean {
    const now = Date.now();
    const timeSinceLastCommand = now - this.lastProcessedTime;
    
    // Don't process if it's the same command within 3 seconds
    if (command === this.lastProcessedCommand && timeSinceLastCommand < 3000) {
      return false;
    }
    
    // Don't process if we're already processing
    if (this.isProcessing) {
      return false;
    }
    
    this.lastProcessedCommand = command;
    this.lastProcessedTime = now;
    return true;
  }

  protected setProcessing(processing: boolean) {
    this.isProcessing = processing;
  }
}
