
import { VoiceServiceOptions } from '../types';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionError } from '../../../lib/types';

export class CoreVoiceService {
  protected recognition: SpeechRecognition | null = null;
  protected listening = false;
  protected language: string;
  protected continuous: boolean;
  protected onInterim?: (text: string) => void;
  protected onError?: (error: string) => void;
  protected interimTranscript = '';
  protected finalTranscript = '';
  protected isInitialized: boolean = false;

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
      
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      
      this.recognition.lang = this.language;
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = Boolean(this.onInterim);
      
      this.recognition.onresult = this.handleRecognitionResult.bind(this);
      this.recognition.onerror = this.handleRecognitionError.bind(this);
      this.recognition.onend = this.handleRecognitionEnd.bind(this);
      this.recognition.onaudiostart = () => console.log('Audio recording started');
      this.recognition.onaudioend = () => console.log('Audio recording ended');
      this.recognition.onsoundstart = () => console.log('Sound detected');
      this.recognition.onsoundend = () => console.log('Sound ended');
      this.recognition.onspeechstart = () => console.log('Speech started');
      this.recognition.onspeechend = () => console.log('Speech ended');
      this.recognition.onnomatch = () => console.log('No speech was recognized');

      this.isInitialized = true;
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  protected handleRecognitionResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        this.finalTranscript += event.results[i][0].transcript;
      } else {
        this.interimTranscript += event.results[i][0].transcript;
      }
    }
    
    if (this.onInterim && this.interimTranscript) {
      this.onInterim(this.interimTranscript);
    }
  }

  protected handleRecognitionError(event: SpeechRecognitionError) {
    console.error('Speech recognition error:', event);
    if (this.onError) {
      this.onError(`Speech recognition error: ${event.error}`);
    }
  }

  protected handleRecognitionEnd() {
    if (this.listening) {
      this.recognition?.start();
    } else {
      this.listening = false;
    }
  }

  isListening(): boolean {
    return this.listening;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
  }

  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  getLanguage(): string {
    return this.language;
  }

  setContinuousMode(enabled: boolean): void {
    this.continuous = enabled;
    if (this.recognition) {
      this.recognition.continuous = enabled;
    }
  }
}

export const coreVoiceService = new CoreVoiceService();
export default coreVoiceService;
