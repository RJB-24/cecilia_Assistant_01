/**
 * Groq API Integration Service
 * 
 * This service provides functions to interact with Groq's AI features:
 * - Natural language processing
 * - Chat completions
 * - Voice transcription (speech-to-text)
 * - Text-to-speech
 */

export interface GroqConfig {
  apiKey: string;
  model?: string;
}

export interface GroqMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

export interface GroqCompletionOptions {
  temperature?: number;
  maxCompletionTokens?: number;
  stream?: boolean;
  responseFormat?: { type: string };
}

export interface GroqTranscriptionOptions {
  language?: string;
  prompt?: string;
  responseFormat?: string;
  timestampGranularities?: string[];
}

export interface GroqTextToSpeechOptions {
  voice?: string;
  responseFormat?: string;
}

export interface GroqCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finishReason?: string;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class GroqService {
  private apiKey: string;
  private model: string;
  private baseUrl = "https://api.groq.com/openai/v1";
  private defaultChatModel = "llama-3.3-70b-versatile";
  private defaultWhisperModel = "whisper-large-v3-turbo";
  private defaultTTSModel = "playai-tts";
  private defaultTTSVoice = "Fritz-PlayAI";

  constructor(config: GroqConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || this.defaultChatModel;
  }

  /**
   * Process a chat completion request with Groq API
   */
  async processChat(
    messages: GroqMessage[],
    options: GroqCompletionOptions = {}
  ): Promise<GroqCompletionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.stream ? this.model : this.model,
          messages: messages,
          temperature: options.temperature ?? 0.7,
          max_completion_tokens: options.maxCompletionTokens ?? 1024,
          stream: options.stream ?? false,
          response_format: options.responseFormat,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error (${response.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      return data as GroqCompletionResponse;
    } catch (error) {
      console.error("Error processing chat with Groq:", error);
      throw new Error(`Failed to process chat: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process a simple natural language command
   */
  async processCommand(command: string): Promise<string> {
    try {
      const messages: GroqMessage[] = [
        { role: "system", content: "You are Cecilia, a helpful AI assistant." },
        { role: "user", content: command }
      ];
      
      const result = await this.processChat(messages);
      return result.choices[0]?.message.content || "";
    } catch (error) {
      console.error("Error processing command with Groq:", error);
      throw new Error(`Failed to process command: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement voice transcription (speech-to-text) using Groq's Whisper model
   */
  async transcribeAudio(audioBlob: Blob, options: GroqTranscriptionOptions = {}): Promise<string> {
    try {
      // Create form data for the audio file
      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("model", this.defaultWhisperModel);
      
      if (options.language) {
        formData.append("language", options.language);
      }
      
      if (options.prompt) {
        formData.append("prompt", options.prompt);
      }
      
      if (options.responseFormat) {
        formData.append("response_format", options.responseFormat);
      }
      
      if (options.timestampGranularities) {
        options.timestampGranularities.forEach(granularity => {
          formData.append("timestamp_granularities[]", granularity);
        });
      }

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error (${response.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Error transcribing audio with Groq:", error);
      throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Convert text to speech using Groq's TTS model
   */
  async textToSpeech(text: string, options: GroqTextToSpeechOptions = {}): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.defaultTTSModel,
          input: text,
          voice: options.voice || this.defaultTTSVoice,
          response_format: options.responseFormat || "wav",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error (${response.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error("Error generating speech with Groq:", error);
      throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Play text-to-speech audio
   */
  async speakText(text: string, options: GroqTextToSpeechOptions = {}): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text, options);
      const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = (err) => {
          URL.revokeObjectURL(audioUrl);
          reject(err);
        };
        audio.play();
      });
    } catch (error) {
      console.error("Error speaking text with Groq:", error);
      throw new Error(`Failed to speak text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Update model
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey) && this.apiKey !== "YOUR_GROQ_API_KEY";
  }
}

// Export an instance with placeholder API key
// In production, load this from environment variables or secure storage
export const groqService = new GroqService({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY",
  model: "llama-3.3-70b-versatile",
});
