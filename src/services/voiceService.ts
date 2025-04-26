/**
 * Voice command service for speech recognition and processing
 * Integrates with Groq API for advanced NLP and multilingual support
 */

import { groqService } from './groqService';
import { noteService } from './noteService';
import { voiceConfigService } from './nlp/voiceConfigService';
import '../lib/types'; // Import the types to make them available
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionError } from '../lib/types';

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
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
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
      this.recognition.onerror = (event: SpeechRecognitionError) => {
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
   * Start recording audio for note-taking
   * Returns a MediaStream that can be used for visualization or further processing
   */
  async startRecordingForNotes(): Promise<MediaStream> {
    if (this.isRecordingForNotes) {
      throw new Error('Already recording for notes');
    }
    
    try {
      // Request audio permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder
      this.audioRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      // Listen for dataavailable event to collect audio chunks
      this.audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.audioRecorder.start(1000); // Collect data in 1-second chunks
      this.isRecordingForNotes = true;
      
      console.log('Started recording audio for notes');
      return stream;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw new Error(`Failed to start recording: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Stop recording audio and process notes using Groq AI
   */
  async stopRecordingAndProcessNotes(title: string): Promise<any> {
    if (!this.isRecordingForNotes || !this.audioRecorder) {
      throw new Error('Not currently recording for notes');
    }
    
    return new Promise((resolve, reject) => {
      // Set up the onstop handler before stopping
      this.audioRecorder!.onstop = async () => {
        try {
          // Create a blob from the audio chunks
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // In a real implementation, this would send the audio to Groq for transcription and note generation
          // For now, we'll simulate this process
          console.log('Processing audio for notes, size:', audioBlob.size);
          
          // Use noteService to generate notes from media
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
      
      // Stop the recorder - this will trigger the onstop handler
      this.audioRecorder!.stop();
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
        
        // Enhanced intent parsing from Groq's response
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
        } else if (response.toLowerCase().includes('note') || 
                  response.toLowerCase().includes('transcribe')) {
          intent = 'take_notes';
          
          // Extract meeting or video title if available
          const titleMatches = response.match(/for\s+([a-zA-Z0-9\s]+)/i);
          if (titleMatches && titleMatches[1]) {
            entities.title = titleMatches[1].trim();
          }
        } else if (response.toLowerCase().includes('open') || 
                  response.toLowerCase().includes('launch') || 
                  response.toLowerCase().includes('start')) {
          intent = 'open_application';
          
          // Extract app name if available
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
        } else if (text.toLowerCase().includes('note') || text.toLowerCase().includes('transcribe')) {
          intent = 'take_notes';
          
          // Extract meeting or video title if available
          const titleMatches = text.match(/for\s+([a-zA-Z0-9\s]+)/i);
          if (titleMatches && titleMatches[1]) {
            entities.title = titleMatches[1].trim();
          }
        } else if (text.toLowerCase().includes('open') || text.toLowerCase().includes('launch')) {
          intent = 'open_application';
          
          // Extract app name if available
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
  
  /**
   * Speak text using the configured voice
   */
  async speakText(text: string): Promise<void> {
    try {
      await voiceConfigService.textToSpeech(text);
      return Promise.resolve();
    } catch (error) {
      console.error('Error speaking text:', error);
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        window.speechSynthesis.speak(utterance);
        return Promise.resolve();
      }
      return Promise.reject(error);
    }
  }

  /**
   * Enable or disable wake word detection
   */
  setWakeWordEnabled(enabled: boolean): void {
    this.isWakeWordEnabled = enabled;
  }

  /**
   * Add a custom wake word
   */
  addWakeWord(word: string): void {
    if (!this.wakeWords.includes(word.toLowerCase())) {
      this.wakeWords.push(word.toLowerCase());
    }
  }

  /**
   * Check if text contains a wake word
   */
  containsWakeWord(text: string): boolean {
    if (!this.isWakeWordEnabled) return true;
    
    const lowerText = text.toLowerCase();
    return this.wakeWords.some(word => lowerText.includes(word));
  }
  
  /**
   * Check if voice recognition is currently active
   */
  isListening(): boolean {
    return this.listening;
  }
  
  /**
   * Check if currently recording for notes
   */
  isRecordingNotes(): boolean {
    return this.isRecordingForNotes;
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

  /**
   * Get current language
   */
  getLanguage(): string {
    return this.language;
  }

  /**
   * Toggle continuous listening mode
   */
  setContinuousMode(enabled: boolean): void {
    this.continuous = enabled;
    if (this.recognition) {
      this.recognition.continuous = enabled;
    }
  }
}

// Singleton instance for app-wide use
export const voiceService = new VoiceService();

export default voiceService;
