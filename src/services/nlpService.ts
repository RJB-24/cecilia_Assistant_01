/**
 * Comprehensive NLP Service for Groq AI Integration
 * 
 * Features:
 * - Chat Completions (synchronous and streaming)
 * - Voice Processing (speech-to-text, text-to-speech)
 * - Vision Processing (image analysis)
 * - Reasoning Capabilities
 * - Agentic Tools (web search, code execution)
 * - Batch Processing
 * 
 * Supported Models:
 * - Chat: llama-3.3-70b-versatile, llama-3.1-8b-instant
 * - Agent: compound-beta, compound-beta-mini
 * - Speech: whisper-large-v3, whisper-large-v3-turbo, distil-whisper-large-v3-en
 * - TTS: playai-tts (multi-voice)
 * - Vision: meta-llama/llama-4-scout-17b-16e-instruct
 */

export interface NLPConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface NLPMessage {
  role: 'system' | 'assistant' | 'user';
  content: string | NLPContent[];
}

export interface NLPContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface NLPTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface NLPOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: { type: string };
  tools?: NLPTool[];
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  reasoningFormat?: 'parsed' | 'raw' | 'hidden';
  language?: string;
  voice?: string;
}

export interface NLPResult {
  text: string;
  tokens?: number;
  processingTime?: number;
  intent?: string;
  entities?: Record<string, any>;
  reasoning?: string;
  actions?: Array<{
    type: string;
    parameters: Record<string, any>;
  }>;
}

const DEFAULT_CONFIG: NLPConfig = {
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 1024
};

export class NLPService {
  private apiKey: string | null = null;
  private config: NLPConfig;
  private baseUrl = 'https://api.groq.com/openai/v1';

  // Model IDs for different capabilities
  private readonly MODELS = {
    chat: {
      versatile: 'llama-3.3-70b-versatile',
      fast: 'llama-3.1-8b-instant'
    },
    agent: {
      full: 'compound-beta',
      mini: 'compound-beta-mini'
    },
    speech: {
      transcription: 'whisper-large-v3',
      fast: 'whisper-large-v3-turbo',
      english: 'distil-whisper-large-v3-en'
    },
    tts: 'playai-tts',
    vision: 'meta-llama/llama-4-scout-17b-16e-instruct'
  };
  
  constructor(config?: Partial<NLPConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (config?.apiKey) {
      this.apiKey = config.apiKey;
    }
  }

  /**
   * Configure the NLP service
   * @param apiKey - Groq API key
   * @param config - Optional configuration parameters
   */
  configure(apiKey: string, config?: Partial<NLPConfig>): void {
    this.apiKey = apiKey;
    if (config) {
      this.config = { ...this.config, ...config };
    }
    console.log('NLP Service configured with model:', this.config.model);
  }

  /**
   * Process text with standard chat completion
   * @param text - Input text to process
   * @param options - Processing options
   */
  async processText(text: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'user', content: text }
          ],
          temperature: options?.temperature ?? this.config.temperature,
          max_completion_tokens: options?.maxTokens ?? this.config.maxTokens,
          stream: options?.stream ?? false,
          response_format: options?.responseFormat,
          tools: options?.tools,
          tool_choice: options?.toolChoice,
          reasoning_format: options?.reasoningFormat
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return {
        text: content,
        tokens: data.usage?.total_tokens,
        processingTime: Date.now(),
        intent: this.detectIntent(content),
        entities: this.extractEntities(content),
        reasoning: data.choices[0]?.message?.reasoning
      };
    } catch (error) {
      console.error('Error processing text:', error);
      throw error;
    }
  }

  /**
   * Stream chat completions for real-time responses
   * @param messages - Array of conversation messages
   * @param options - Streaming options
   */
  async* streamChat(messages: NLPMessage[], options?: Partial<NLPOptions>): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: options?.temperature ?? this.config.temperature,
          max_completion_tokens: options?.maxTokens ?? this.config.maxTokens,
          stream: true
        })
      });

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) yield content;
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      throw error;
    }
  }

  /**
   * Process image with text query using vision capabilities
   * @param imageUrl - URL of the image to analyze
   * @param question - Text query about the image
   */
  async processImageWithText(imageUrl: string, question: string): Promise<NLPResult> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    const originalModel = this.config.model;
    this.config.model = this.MODELS.vision;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: question },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.config.model = originalModel;

      return {
        text: data.choices[0]?.message?.content || '',
        tokens: data.usage?.total_tokens,
        processingTime: Date.now()
      };
    } catch (error) {
      this.config.model = originalModel;
      console.error('Error processing image:', error);
      throw error;
    }
  }

  /**
   * Convert speech to text using Whisper model
   * @param audioBlob - Audio data to transcribe
   * @param options - Transcription options
   */
  async transcribeAudio(audioBlob: Blob, options?: Partial<NLPOptions>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', this.MODELS.speech.transcription);
    
    if (options?.language) {
      formData.append('language', options.language);
    }

    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using Groq TTS
   * @param text - Text to convert to speech
   * @param options - TTS options including voice selection
   */
  async textToSpeech(text: string, options?: Partial<NLPOptions>): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.MODELS.tts,
          input: text,
          voice: options?.voice || 'Fritz-PlayAI',
          response_format: 'wav'
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Process commands with agentic capabilities (web search and code execution)
   * @param command - User command to process
   * @param options - Processing options
   */
  async processAgentCommand(command: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    const originalModel = this.config.model;
    this.config.model = this.MODELS.agent.full;

    try {
      const result = await this.processText(command, {
        ...options,
        tools: [
          {
            type: 'function',
            function: {
              name: 'web_search',
              description: 'Search the web for information',
              parameters: {
                query: { type: 'string' }
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'execute_code',
              description: 'Execute Python code',
              parameters: {
                code: { type: 'string' }
              }
            }
          }
        ],
        toolChoice: 'auto'
      });

      this.config.model = originalModel;
      return result;
    } catch (error) {
      this.config.model = originalModel;
      console.error('Error processing agent command:', error);
      throw error;
    }
  }

  /**
   * Submit batch processing jobs
   * @param jobs - Array of processing jobs
   * @param options - Batch processing options
   */
  async submitBatch(jobs: any[], options?: { window?: string }): Promise<any> {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }

    try {
      const fileContent = jobs.map(job => JSON.stringify(job)).join('\n');
      const fileBlob = new Blob([fileContent], { type: 'application/jsonl' });
      const formData = new FormData();
      formData.append('purpose', 'batch');
      formData.append('file', fileBlob);

      const fileResponse = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!fileResponse.ok) {
        throw new Error(`File upload error: ${fileResponse.statusText}`);
      }

      const fileData = await fileResponse.json();
      
      const batchResponse = await fetch(`${this.baseUrl}/batches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_file_id: fileData.id,
          endpoint: '/v1/chat/completions',
          completion_window: options?.window || '24h'
        })
      });

      if (!batchResponse.ok) {
        throw new Error(`Batch creation error: ${batchResponse.statusText}`);
      }

      return await batchResponse.json();
    } catch (error) {
      console.error('Error submitting batch:', error);
      throw error;
    }
  }

  /**
   * Detect intent from text using simple keyword matching
   * @private
   */
  private detectIntent(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('email') || lowerText.includes('send')) {
      return 'send_email';
    } else if (lowerText.includes('schedule') || lowerText.includes('calendar')) {
      return 'create_calendar_event';
    } else if (lowerText.includes('analyze') || lowerText.includes('data')) {
      return 'analyze_data';
    }
    
    return 'unknown';
  }

  /**
   * Extract entities from text using simple pattern matching
   * @private
   */
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    const dateMatch = text.match(/on\s+([a-zA-Z0-9\s,]+)/i);
    if (dateMatch) {
      entities.date = dateMatch[1].trim();
    }
    
    const recipientMatch = text.match(/to\s+([a-zA-Z\s]+)/i);
    if (recipientMatch) {
      entities.recipient = recipientMatch[1].trim();
    }
    
    return entities;
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Get current configuration
   */
  getConfiguration(): { configured: boolean; model: string } {
    return {
      configured: this.isConfigured(),
      model: this.config.model || 'unknown'
    };
  }
}

// Export singleton instance
export const nlpService = new NLPService();
export default nlpService;
