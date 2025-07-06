
import Groq from 'groq-sdk';

export interface GroqServiceOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface TTSOptions {
  voice?: string;
  model?: string;
}

export class GroqService {
  private client: Groq | null = null;
  private apiKey: string | null = null;
  private configured = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const storedApiKey = localStorage.getItem('groq_api_key') || process.env.GROQ_API_KEY;
    if (storedApiKey) {
      this.setApiKey(storedApiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    this.configured = true;
    localStorage.setItem('groq_api_key', apiKey);
  }

  clearApiKey() {
    this.apiKey = null;
    this.client = null;
    this.configured = false;
    localStorage.removeItem('groq_api_key');
  }

  isConfigured(): boolean {
    return this.configured && this.client !== null;
  }

  isReady(): boolean {
    return this.configured && this.client !== null;
  }

  async processCommand(
    message: string, 
    options: GroqServiceOptions = {}
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Groq service not configured. Please set API key.');
    }

    try {
      const completion = await this.client!.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are CECILIA, an advanced AI assistant. Be helpful, concise, and professional. Provide accurate information and assist with various tasks."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature || 0.7,
        max_completion_tokens: options.max_tokens || 150,
        stream: options.stream || false
      });

      if (options.stream) {
        // Handle streaming response
        return "Streaming response initiated";
      }

      return (completion as any).choices[0]?.message?.content || "I'm here to help, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to process command with Groq API');
    }
  }

  async processAgentCommand(message: string): Promise<string> {
    return this.processWithAgent(message);
  }

  async transcribeAudio(audioFile: File): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Groq service not configured. Please set API key.');
    }

    try {
      const transcription = await this.client!.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3-turbo",
        language: "en",
        response_format: "text"
      });

      return String(transcription);
    } catch (error) {
      console.error('Groq Transcription Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async speakText(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isReady()) {
      throw new Error('Groq service not configured. Please set API key.');
    }

    try {
      const response = await this.client!.audio.speech.create({
        model: options.model || "playai-tts",
        input: text,
        voice: options.voice || "Celeste-PlayAI"
      });

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });
    } catch (error) {
      console.error('Groq TTS Error:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  async processWithAgent(message: string): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Groq service not configured. Please set API key.');
    }

    try {
      const completion = await this.client!.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        model: "compound-beta",
        temperature: 0.5,
        max_completion_tokens: 300
      });

      return (completion as any).choices[0]?.message?.content || "I couldn't process that request with agent capabilities.";
    } catch (error) {
      console.error('Groq Agent Error:', error);
      throw new Error('Failed to process with agent capabilities');
    }
  }

  reconfigure() {
    this.initialize();
  }

  getConfiguration() {
    return {
      isConfigured: this.configured,
      hasApiKey: !!this.apiKey
    };
  }
}

export const groqService = new GroqService();
export default groqService;
