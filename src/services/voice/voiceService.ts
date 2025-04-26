/**
 * Voice command service for speech recognition and processing
 * Integrates with Groq API for advanced NLP and multilingual support
 */

import { groqService } from '../groqService';
import { noteService } from '../noteService';
import { voiceConfigService } from '../nlp/voiceConfigService';
import '../../lib/types'; // Import the types to make them available

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
  private importantEvents: Array<{date: Date, description: string}> = [];

  constructor(options: VoiceServiceOptions = {}) {
    this.language = options.language || 'en-US';
    this.continuous = options.continuous || false;
    this.onInterim = options.onInterim;
    this.onError = options.onError;
    this.initRecognition();
    this.loadImportantEvents();
    this.setupIdleReminders();
  }

  private loadImportantEvents() {
    // In a real app, these would come from calendar APIs or user configuration
    this.importantEvents = [
      { 
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        description: "Project deadline"
      },
      { 
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        description: "Team meeting"
      }
    ];
  }

  private setupIdleReminders() {
    // Check every 5 minutes if the user has been idle for more than 30 minutes
    this.idleReminderInterval = window.setInterval(() => {
      const idleTimeMinutes = (Date.now() - this.lastInteractionTime) / (1000 * 60);
      
      if (idleTimeMinutes > 30 && Math.random() < 0.3) {
        // 30% chance to remind the user after 30 minutes of inactivity
        this.speakText("It's been a while since we've interacted. Is there anything I can help you with?");
      }
    }, 5 * 60 * 1000);
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

  private async handleRecognitionResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        this.finalTranscript += event.results[i][0].transcript;
        
        const text = event.results[i][0].transcript.toLowerCase();
        if (this.containsWakeWord(text)) {
          const command = text.replace(/cecilia|assistant|hey cecilia|ok cecilia/gi, '').trim();
          if (command) {
            await this.processCommand(command);
            this.lastInteractionTime = Date.now(); // Update last interaction time
          }
        }
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
   * Start voice recognition with greeting
   */
  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    try {
      this.finalTranscript = '';
      this.interimTranscript = '';
      this.listening = true;
      
      // Check for important events and add to welcome message if needed
      let greeting = this.welcomeMessage;
      const upcomingEvent = this.getUpcomingEvent();
      if (upcomingEvent) {
        greeting += ` By the way, I should remind you that you have ${upcomingEvent.description} coming up in ${this.getDaysUntilEvent(upcomingEvent)} days.`;
      }
      
      // Occasionally add a joke to be more human-like
      if (this.personalityTraits.humor && Math.random() < 0.2) {
        greeting += " " + this.getRandomJoke();
      }
      
      await this.speakText(greeting);
      
      this.recognition.start();
      console.log('Voice recognition started');
      
    } catch (error) {
      this.listening = false;
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  private getUpcomingEvent() {
    if (this.importantEvents.length === 0) return null;
    
    // Sort events by date and get the closest one
    const sortedEvents = [...this.importantEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedEvents[0];
  }
  
  private getDaysUntilEvent(event: {date: Date, description: string}) {
    const diffTime = Math.abs(event.date.getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getRandomJoke() {
    const jokes = [
      "I tried to make a reservation at the library, but they were all booked.",
      "Why don't scientists trust atoms? Because they make up everything!",
      "I'm reading a book about anti-gravity. It's impossible to put down.",
      "Time flies like an arrow. Fruit flies like a banana.",
      "I'd tell you a chemistry joke, but I'm afraid I wouldn't get a reaction."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
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
    const command = await commandProcessingService.processCommand(text);
    
    // After processing, respond with a voice confirmation
    const responseTexts = {
      'send_email': "I'll draft that email for you right away.",
      'create_calendar_event': "I've added that event to your calendar.",
      'analyze_data': "I'm analyzing that data for you now.",
      'take_notes': "I'll start taking notes for you.",
      'open_application': `Opening ${command.entities?.appName || 'the application'} now.`,
      'unknown': "I'm not sure how to do that yet, but I'm learning."
    };
    
    const responseText = responseTexts[command.intent || 'unknown'] || "I'll take care of that for you.";
    await this.speakText(responseText);
    
    return command;
  }

  async startRecordingForNotes(): Promise<MediaStream> {
    return voiceRecordingService.startRecordingForNotes();
  }

  async stopRecordingAndProcessNotes(title: string): Promise<any> {
    return voiceRecordingService.stopRecordingAndProcessNotes(title);
  }

  /**
   * Enhanced text-to-speech with Groq integration
   */
  async speakText(text: string): Promise<void> {
    try {
      await voiceConfigService.textToSpeech(text);
      return Promise.resolve();
    } catch (error) {
      console.error('Error with Groq TTS, falling back to browser:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
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

  // Personality customization
  setPersonalityTrait(trait: 'humor' | 'proactive' | 'formality', value: boolean | string): void {
    if (trait === 'formality' && typeof value === 'string') {
      this.personalityTraits.formality = value;
    } else if (trait !== 'formality' && typeof value === 'boolean') {
      this.personalityTraits[trait] = value;
    }
  }

  // Method to update welcome message
  setWelcomeMessage(message: string): void {
    this.welcomeMessage = message;
  }

  // Method to add important events
  addImportantEvent(date: Date, description: string): void {
    this.importantEvents.push({ date, description });
  }
}

// Singleton instance for app-wide use
export const voiceService = new VoiceService();

export default voiceService;
