
import Groq from 'groq-sdk';

export interface GroqServiceOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

class GroqService {
  private client: Groq | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        this.client = new Groq({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
        this.isConfigured = true;
        console.log('Groq client initialized successfully');
      } catch (error) {
        console.error('Error initializing Groq client:', error);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
  }

  private getApiKey(): string | null {
    // Try localStorage first (for development)
    const localKey = localStorage.getItem('VITE_GROQ_API_KEY');
    if (localKey) return localKey;

    // Fallback to environment variable
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    if (envKey) return envKey;

    return null;
  }

  public reconfigure() {
    this.initializeClient();
  }

  isConfigured(): boolean {
    return this.isConfigured && this.client !== null;
  }

  async processCommand(command: string, options: GroqServiceOptions = {}): Promise<string> {
    if (!this.isConfigured || !this.client) {
      throw new Error('Groq API is not configured. Please add your API key in Settings.');
    }

    try {
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are CECILIA, a helpful AI assistant. Provide concise, friendly responses. Avoid repeating yourself. Give practical, actionable answers."
          },
          {
            role: "user",
            content: command
          }
        ],
        model: options.model || "llama-3.3-70b-versatile",
        temperature: options.temperature || 0.7,
        max_completion_tokens: options.maxTokens || 1024,
      });

      return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to process command with Groq API');
    }
  }

  async processAgentCommand(command: string, options: GroqServiceOptions = {}): Promise<string> {
    if (!this.isConfigured || !this.client) {
      throw new Error('Groq API is not configured. Please add your API key in Settings.');
    }

    try {
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are CECILIA, an advanced AI assistant with real-time capabilities. You can search the web, execute code, and help with various tasks. Provide helpful, concise responses and take action when appropriate."
          },
          {
            role: "user",
            content: command
          }
        ],
        model: "compound-beta", // Use agent model for enhanced capabilities
        temperature: options.temperature || 0.5,
        max_completion_tokens: options.maxTokens || 1024,
      });

      return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('Groq Agent API error:', error);
      // Fallback to regular model if agent model fails
      return this.processCommand(command, options);
    }
  }

  async speakText(text: string, options: { voice?: string } = {}): Promise<void> {
    if (!this.isConfigured || !this.client) {
      throw new Error('Groq API is not configured');
    }

    try {
      const response = await this.client.audio.speech.create({
        model: "playai-tts",
        input: text,
        voice: options.voice || "Celeste-PlayAI",
        response_format: "wav"
      });

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play();
      });
      
      URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }
}

export const groqService = new GroqService();
export default groqService;
