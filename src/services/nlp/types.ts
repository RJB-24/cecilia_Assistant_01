
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
  systemPrompt?: string;
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
  toolResults?: Array<{
    tool: string;
    success: boolean;
    result?: any;
    error?: string;
  }>;
  toolError?: string;
}
