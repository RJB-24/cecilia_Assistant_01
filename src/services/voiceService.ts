/**
 * Voice command service for speech recognition and processing
 * Integrates with Groq API for advanced NLP and multilingual support
 */

import { groqService } from './groqService';
import { noteService } from './noteService';
import { voiceConfigService } from './nlp/voiceConfigService';
import '../lib/types';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionError } from '../lib/types';

export interface VoiceServiceOptions {
  language?: string;
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
  private audioRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  private isRecordingForNotes = false;
  private wakeWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
  private isWakeWordEnabled = true;

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
      
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
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
      };
      
      this.recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event);
        if (this.onError) {
          this.onError(`Speech recognition error: ${event.error}`);
        }
      };
      
      this.recognition.onend = () => {
        if (this.listening) {
          this.recognition?.start();
        } else {
          this.listening = false;
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

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

  async startRecordingForNotes(): Promise<MediaStream> {
    if (this.isRecordingForNotes) {
      throw new Error('Already recording for notes');
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.audioRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.audioRecorder.start(1000);
      this.isRecordingForNotes = true;
      
      console.log('Started recording audio for notes');
      return stream;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw new Error(`Failed to start recording: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  async stopRecordingAndProcessNotes(title: string): Promise<any> {
    if (!this.isRecordingForNotes || !this.audioRecorder) {
      throw new Error('Not currently recording for notes');
    }
    
    return new Promise((resolve, reject) => {
      this.audioRecorder!.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          console.log('Processing audio for notes, size:', audioBlob.size);
          
          const notes = await noteService.generateNotesFromMedia(audioBlob, {
            title,
            format: 'outline'
          });
          
          this.isRecordingForNotes = false;
          this.audioChunks = [];
          this.audioRecorder = null;
          
          resolve(notes);
        } catch (error) {
          console.error('Error processing notes:', error);
          reject(error);
        }
      };
      
      this.audioRecorder!.stop();
    });
  }

  async processCommand(text: string): Promise<VoiceCommand> {
    try {
      let intent = 'unknown';
      const entities: Record<string, any> = {};
      
      if (groqService.isConfigured()) {
        const response = await groqService.processCommand(text);
        
        if (response.toLowerCase().includes('email')) {
          intent = 'send_email';
          
          const matches = response.match(/to\s+([a-zA-Z\s]+)/i);
          if (matches && matches[1]) {
            entities.recipient = matches[1].trim();
          }
        } else if (response.toLowerCase().includes('schedule')) {
          intent = 'create_calendar_event';
        } else if (response.toLowerCase().includes('analyze')) {
          intent = 'analyze_data';
        } else if (response.toLowerCase().includes('note') || 
                  response.toLowerCase().includes('transcribe')) {
          intent = 'take_notes';
          
          const titleMatches = response.match(/for\s+([a-zA-Z0-9\s]+)/i);
          if (titleMatches && titleMatches[1]) {
            entities.title = titleMatches[1].trim();
          }
        } else if (response.toLowerCase().includes('open') || 
                  response.toLowerCase().includes('launch') || 
                  response.toLowerCase().includes('start')) {
          intent = 'open_application';
          
          const appMatches = response.match(/open\s+([a-zA-Z0-9\s]+)/i);
          if (appMatches && appMatches[1]) {
            entities.appName = appMatches[1].trim();
          }
        }
        
        return {
          text,
          confidence: 0.95,
          intent,
          entities
        };
      } else {
        if (text.toLowerCase().includes('email') || text.toLowerCase().includes('send')) {
          intent = 'send_email';
          
          const matches = text.match(/to\s+([a-zA-Z\s]+)/i);
          if (matches && matches[1]) {
            entities.recipient = matches[1].trim();
          }
        } else if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('calendar')) {
          intent = 'create_calendar_event';
          
          const dateMatches = text.match(/on\s+([a-zA-Z0-9\s,]+)/i);
          if (dateMatches && dateMatches[1]) {
            entities.date = dateMatches[1].trim();
          }
        } else if (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('data')) {
          intent = 'analyze_data';
        } else if (text.toLowerCase().includes('note') || text.toLowerCase().includes('transcribe')) {
          intent = 'take_notes';
          
          const titleMatches = text.match(/for\s+([a-zA-Z0-9\s]+)/i);
          if (titleMatches && titleMatches[1]) {
            entities.title = titleMatches[1].trim();
          }
        } else if (text.toLowerCase().includes('open') || text.toLowerCase().includes('launch')) {
          intent = 'open_application';
          
          const appMatches = text.match(/open\s+([a-zA-Z0-9\s]+)/i);
          if (appMatches && appMatches[1]) {
            entities.appName = appMatches[1].trim();
          }
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

  setWakeWordEnabled(enabled: boolean): void {
    this.isWakeWordEnabled = enabled;
  }

  addWakeWord(word: string): void {
    if (!this.wakeWords.includes(word.toLowerCase())) {
      this.wakeWords.push(word.toLowerCase());
    }
  }

  containsWakeWord(text: string): boolean {
    if (!this.isWakeWordEnabled) return true;
    
    const lowerText = text.toLowerCase();
    return this.wakeWords.some(word => lowerText.includes(word));
  }
  
  isListening(): boolean {
    return this.listening;
  }
  
  isRecordingNotes(): boolean {
    return this.isRecordingForNotes;
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
