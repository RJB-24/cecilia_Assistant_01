
import { voiceConfigService } from '../nlp/voiceConfigService';
import { commandProcessingService } from './commandProcessingService';
import { voiceRecordingService } from './voiceRecordingService';
import { wakeWordService } from './wakeWordService';
import { VoiceServiceOptions, VoiceCommand } from './types';

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
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent) {
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

  private handleRecognitionError(event: SpeechRecognitionError) {
    console.error('Speech recognition error:', event);
    if (this.onError) {
      this.onError(`Speech recognition error: ${event.error}`);
    }
  }

  private handleRecognitionEnd() {
    if (this.listening) {
      this.recognition?.start();
    } else {
      this.listening = false;
    }
  }

  /**
   * Start voice recognition
   */
  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    try {
      this.finalTranscript = '';
      this.interimTranscript = '';
      this.listening = true;
      this.recognition.start();
      console.log('Voice recognition started');
    } catch (error) {
      this.listening = false;
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  /**
   * Stop voice recognition
   */
  async stop(): Promise<string> {
    if (this.recognition && this.listening) {
      this.listening = false;
      this.recognition.stop();
      console.log('Voice recognition stopped');
    }
    return this.finalTranscript;
  }

  // Delegate to specialized services
  async processCommand(text: string): Promise<VoiceCommand> {
    return commandProcessingService.processCommand(text);
  }

  async startRecordingForNotes(): Promise<MediaStream> {
    return voiceRecordingService.startRecordingForNotes();
  }

  async stopRecordingAndProcessNotes(title: string): Promise<any> {
    return voiceRecordingService.stopRecordingAndProcessNotes(title);
  }

  async speakText(text: string): Promise<void> {
    try {
      await voiceConfigService.textToSpeech(text);
      return Promise.resolve();
    } catch (error) {
      console.error('Error speaking text:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        window.speechSynthesis.speak(utterance);
        return Promise.resolve();
      }
      return Promise.reject(error);
    }
  }

  // Wake word methods delegated to WakeWordService
  setWakeWordEnabled(enabled: boolean): void {
    wakeWordService.setWakeWordEnabled(enabled);
  }

  addWakeWord(word: string): void {
    wakeWordService.addWakeWord(word);
  }

  containsWakeWord(text: string): boolean {
    return wakeWordService.containsWakeWord(text);
  }

  // Status methods
  isListening(): boolean {
    return this.listening;
  }

  isRecordingNotes(): boolean {
    return voiceRecordingService.isRecordingNotes();
  }

  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
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

export const voiceService = new VoiceService();
export default voiceService;
