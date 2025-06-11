
import { VoiceServiceOptions } from '../types';

export class CoreVoiceService {
  protected recognition: SpeechRecognition | null = null;
  protected finalTranscript: string = '';
  protected interimTranscript: string = '';
  protected listening: boolean = false;
  protected language: string = 'en-US';
  protected continuous: boolean = true;
  protected interimResults: boolean = true;

  constructor(options: VoiceServiceOptions = {}) {
    this.language = options.language || 'en-US';
    this.continuous = options.continuous !== false;
    this.interimResults = options.interimResults !== false;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    if (this.recognition) {
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = this.interimResults;
      this.recognition.lang = this.language;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        this.listening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        this.finalTranscript += finalTranscript;
        this.interimTranscript = interimTranscript;

        console.log('Interim transcript:', interimTranscript);
        console.log('Final transcript:', this.finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.listening = false;
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.listening = false;
      };
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  isListening(): boolean {
    return this.listening;
  }

  getFinalTranscript(): string {
    return this.finalTranscript;
  }

  getInterimTranscript(): string {
    return this.interimTranscript;
  }

  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}
