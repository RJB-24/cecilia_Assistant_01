
/**
 * Groq API Integration Service
 * 
 * This service provides functions to interact with Groq's AI features:
 * - Natural language processing
 * - Chat completions
 * - Voice transcription (speech-to-text)
 * - Text-to-speech
 * - Vision capabilities
 * - Reasoning capabilities
 * - Agentic tooling
 */

export interface GroqConfig {
  apiKey: string;
  model?: string;
}

export interface GroqMessage {
  role: 'system' | 'assistant' | 'user';
  content: string | GroqMessageContent[];
}

export interface GroqMessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface GroqTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
    strict?: boolean;
  };
}

export interface GroqCompletionOptions {
  temperature?: number;
  maxCompletionTokens?: number;
  stream?: boolean;
  responseFormat?: { type: string };
  top_p?: number;
  stop?: string | string[] | null;
  seed?: number;
  tools?: GroqTool[];
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  reasoning_format?: 'parsed' | 'raw' | 'hidden';
}

export interface GroqTranscriptionOptions {
  language?: string;
  prompt?: string;
  responseFormat?: string;
  timestampGranularities?: string[];
  temperature?: number;
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
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finishReason?: string;
    reasoning?: string;
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GroqStreamCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finishReason?: string;
  }>;
}

// Type for stream processing
type StreamParser = TransformStream<Uint8Array, GroqStreamCompletionResponse>;

export class GroqService {
  private apiKey: string;
  private model: string;
  private baseUrl = "https://api.groq.com/openai/v1";
  private defaultChatModel = "llama-3.3-70b-versatile";
  private defaultWhisperModel = "whisper-large-v3-turbo";
  private defaultTTSModel = "playai-tts";
  private defaultTTSVoice = "Fritz-PlayAI";
  private defaultVisionModel = "meta-llama/llama-4-scout-17b-16e-instruct";
  private defaultAgentModel = "compound-beta";

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
          top_p: options.top_p ?? 1.0,
          stop: options.stop || null,
          seed: options.seed,
          tools: options.tools,
          tool_choice: options.toolChoice,
          reasoning_format: options.reasoning_format,
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
   * Stream chat completion responses from Groq API
   */
  async streamChat(
    messages: GroqMessage[],
    options: GroqCompletionOptions = {}
  ): Promise<ReadableStream<GroqStreamCompletionResponse> | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: options.temperature ?? 0.7,
          max_completion_tokens: options.maxCompletionTokens ?? 1024,
          stream: true,
          response_format: options.responseFormat,
          top_p: options.top_p ?? 1.0,
          stop: options.stop || null,
          tools: options.tools,
          tool_choice: options.toolChoice,
          reasoning_format: options.reasoning_format,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error (${response.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      // Transform the response stream to handle SSE
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error("Failed to get response stream reader");
      }
      
      return new ReadableStream<GroqStreamCompletionResponse>({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value);
              const lines = chunk.split("\n").filter(line => line.trim() !== "");
              
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);
                  if (data === "[DONE]") {
                    break;
                  }
                  
                  try {
                    const parsedData = JSON.parse(data);
                    controller.enqueue(parsedData);
                  } catch (e) {
                    console.error("Error parsing SSE data:", e);
                  }
                }
              }
            }
          } catch (error) {
            controller.error(error);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        }
      });
    } catch (error) {
      console.error("Error streaming chat with Groq:", error);
      throw new Error(`Failed to stream chat: ${error instanceof Error ? error.message : String(error)}`);
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
   * Process commands with agentic capabilities (web search and code execution)
   */
  async processAgentCommand(command: string): Promise<string> {
    try {
      const messages: GroqMessage[] = [
        { role: "system", content: "You are Cecilia, a helpful AI assistant with web search and code execution capabilities." },
        { role: "user", content: command }
      ];
      
      const originalModel = this.model;
      this.model = this.defaultAgentModel;
      
      const result = await this.processChat(messages, {
        temperature: 0.7,
        maxCompletionTokens: 1024
      });
      
      // Reset model to original
      this.model = originalModel;
      
      return result.choices[0]?.message.content || "";
    } catch (error) {
      console.error("Error processing agent command with Groq:", error);
      throw new Error(`Failed to process agent command: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process image with vision capabilities
   */
  async processImageWithText(imageUrl: string, question: string): Promise<string> {
    try {
      const messages: GroqMessage[] = [
        { 
          role: "user", 
          content: [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ];
      
      const originalModel = this.model;
      this.model = this.defaultVisionModel;
      
      const result = await this.processChat(messages, {
        temperature: 0.7,
        maxCompletionTokens: 1024
      });
      
      // Reset model to original
      this.model = originalModel;
      
      return result.choices[0]?.message.content || "";
    } catch (error) {
      console.error("Error processing image with Groq:", error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : String(error)}`);
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

      if (options.temperature !== undefined) {
        formData.append("temperature", options.temperature.toString());
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
   * Submit a batch job to Groq API
   */
  async submitBatch(batchJobs: any[], options: { completionWindow?: string } = {}): Promise<any> {
    try {
      const fileContent = batchJobs.map(job => JSON.stringify(job)).join('\n');
      const fileBlob = new Blob([fileContent], { type: 'application/jsonl' });
      const formData = new FormData();
      formData.append('purpose', 'batch');
      formData.append('file', fileBlob);

      // Upload file
      const fileResponse = await fetch(`${this.baseUrl}/files`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!fileResponse.ok) {
        const errorData = await fileResponse.json();
        throw new Error(`Groq API file upload error (${fileResponse.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      const fileData = await fileResponse.json();
      const fileId = fileData.id;

      // Create batch
      const batchResponse = await fetch(`${this.baseUrl}/batches`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input_file_id: fileId,
          endpoint: '/v1/chat/completions',
          completion_window: options.completionWindow || '24h'
        })
      });

      if (!batchResponse.ok) {
        const errorData = await batchResponse.json();
        throw new Error(`Groq API batch creation error (${batchResponse.status}): ${errorData.error?.message || "Unknown error"}`);
      }

      return await batchResponse.json();
    } catch (error) {
      console.error("Error submitting batch to Groq:", error);
      throw new Error(`Failed to submit batch: ${error instanceof Error ? error.message : String(error)}`);
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
