
import { NLPConfig } from './types';

export const DEFAULT_CONFIG: NLPConfig = {
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 1024
};

export class BaseNLPService {
  protected apiKey: string | null = null;
  protected config: NLPConfig;
  protected baseUrl = 'https://api.groq.com/openai/v1';

  // Model IDs for different capabilities
  protected readonly MODELS = {
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

  configure(apiKey: string, config?: Partial<NLPConfig>): void {
    this.apiKey = apiKey;
    if (config) {
      this.config = { ...this.config, ...config };
    }
    console.log('NLP Service configured with model:', this.config.model);
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  getConfiguration(): { configured: boolean; model: string } {
    return {
      configured: this.isConfigured(),
      model: this.config.model || 'unknown'
    };
  }

  protected checkConfiguration(): void {
    if (!this.apiKey) {
      throw new Error('NLP Service not configured, missing API key');
    }
  }
}
