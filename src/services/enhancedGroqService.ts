import { groqService } from './groqService';
import { nlpService } from './nlp';

export interface AdvancedAICapabilities {
  reasoning: boolean;
  vision: boolean;
  speech: boolean;
  codeGeneration: boolean;
  dataAnalysis: boolean;
  multimodal: boolean;
}

export interface AIProcessingResult {
  response: string;
  confidence: number;
  capabilities: string[];
  processingTime: number;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
}

class EnhancedGroqService {
  private capabilities: AdvancedAICapabilities = {
    reasoning: true,
    vision: true,
    speech: true,
    codeGeneration: true,
    dataAnalysis: true,
    multimodal: true
  };

  async processAdvancedQuery(
    query: string, 
    options: {
      useReasoning?: boolean;
      includeImages?: string[];
      requireCode?: boolean;
      dataContext?: any[];
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<AIProcessingResult> {
    const startTime = Date.now();
    
    try {
      let response: string;
      let usedCapabilities: string[] = [];

      // Use reasoning model for complex queries
      if (options.useReasoning || this.requiresReasoning(query)) {
        response = await this.processWithReasoning(query, options);
        usedCapabilities.push('reasoning');
      }
      // Use vision for image analysis
      else if (options.includeImages && options.includeImages.length > 0) {
        response = await this.processWithVision(query, options.includeImages);
        usedCapabilities.push('vision');
      }
      // Use agent capabilities for complex tasks
      else if (this.requiresAgentCapabilities(query)) {
        response = await this.processWithAgent(query, options);
        usedCapabilities.push('agent', 'tools');
      }
      // Standard chat processing
      else {
        response = await this.processWithChat(query, options);
        usedCapabilities.push('chat');
      }

      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(response, query);

      return {
        response,
        confidence,
        capabilities: usedCapabilities,
        processingTime,
        tokens: this.estimateTokens(query, response)
      };
    } catch (error) {
      console.error('Error in enhanced AI processing:', error);
      throw error;
    }
  }

  private async processWithReasoning(query: string, options: any): Promise<string> {
    // Use deepseek-r1 or qwen-qwq for reasoning tasks
    const reasoningPrompt = `
    Think step by step about this query and provide a detailed, logical response:
    
    Query: ${query}
    
    Please:
    1. Break down the problem
    2. Consider multiple approaches
    3. Provide a clear, well-reasoned solution
    4. Explain your reasoning
    `;

    const result = await nlpService.processText(reasoningPrompt, {
      temperature: options.temperature || 0.3,
      maxTokens: options.maxTokens || 2048
    });

    return result.text || '';
  }

  private async processWithVision(query: string, images: string[]): Promise<string> {
    if (images.length === 0) {
      throw new Error('No images provided for vision processing');
    }

    // Use the first image for now, can be extended for multiple images
    const result = await nlpService.processImageWithText(images[0], query);
    return result.text || '';
  }

  private async processWithAgent(query: string, options: any): Promise<string> {
    // Use compound-beta for agent capabilities
    const result = await nlpService.processAgentCommand(query, {
      temperature: options.temperature || 0.5
    });

    return result.text || '';
  }

  private async processWithChat(query: string, options: any): Promise<string> {
    const result = await nlpService.processText(query, {
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 1024
    });

    return result.text || '';
  }

  private requiresReasoning(query: string): boolean {
    const reasoningKeywords = [
      'analyze', 'compare', 'solve', 'calculate', 'prove', 'explain why',
      'step by step', 'reasoning', 'logic', 'problem', 'solution',
      'strategy', 'plan', 'approach', 'method'
    ];

    return reasoningKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private requiresAgentCapabilities(query: string): boolean {
    const agentKeywords = [
      'search', 'find information', 'current', 'latest', 'real-time',
      'execute', 'run code', 'calculate', 'compute', 'analyze data',
      'web search', 'browse', 'lookup'
    ];

    return agentKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private calculateConfidence(response: string, query: string): number {
    // Simple confidence calculation based on response characteristics
    let confidence = 0.5;

    // Longer, more detailed responses tend to be more confident
    if (response.length > 200) confidence += 0.2;
    if (response.length > 500) confidence += 0.1;

    // Responses with specific details
    if (response.includes('specifically') || response.includes('exactly')) {
      confidence += 0.1;
    }

    // Responses that acknowledge uncertainty
    if (response.includes('might') || response.includes('possibly')) {
      confidence -= 0.1;
    }

    return Math.min(0.95, Math.max(0.1, confidence));
  }

  private estimateTokens(input: string, output: string): {
    input: number;
    output: number;
    total: number;
  } {
    // Rough estimation: ~4 characters per token
    const inputTokens = Math.ceil(input.length / 4);
    const outputTokens = Math.ceil(output.length / 4);
    
    return {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    };
  }

  async generateCode(prompt: string, language: string = 'typescript'): Promise<string> {
    const codePrompt = `
    Generate ${language} code for the following request:
    ${prompt}
    
    Requirements:
    - Write clean, production-ready code
    - Include proper error handling
    - Add TypeScript types if applicable
    - Include comments for complex logic
    - Follow best practices
    `;

    return await this.processAdvancedQuery(codePrompt, {
      useReasoning: true,
      temperature: 0.2
    }).then(result => result.response);
  }

  async analyzeData(data: any[], analysisType: string): Promise<string> {
    const analysisPrompt = `
    Perform ${analysisType} analysis on the following data:
    ${JSON.stringify(data, null, 2)}
    
    Please provide:
    - Key insights and patterns
    - Statistical summary
    - Recommendations based on findings
    - Visualization suggestions if applicable
    `;

    return await this.processAdvancedQuery(analysisPrompt, {
      useReasoning: true,
      dataContext: data,
      temperature: 0.3
    }).then(result => result.response);
  }

  getCapabilities(): AdvancedAICapabilities {
    return { ...this.capabilities };
  }

  async testCapabilities(): Promise<{ [key: string]: boolean }> {
    const tests = {
      reasoning: async () => {
        const result = await this.processAdvancedQuery('Solve: 2+2*3', { useReasoning: true });
        return result.response.includes('8') || result.response.includes('order of operations');
      },
      
      chat: async () => {
        const result = await this.processAdvancedQuery('Hello, how are you?');
        return result.response.length > 10;
      },
      
      agent: async () => {
        try {
          const result = await this.processAdvancedQuery('What is the current time?');
          return result.capabilities.includes('agent');
        } catch {
          return false;
        }
      }
    };

    const results: { [key: string]: boolean } = {};
    
    for (const [capability, test] of Object.entries(tests)) {
      try {
        results[capability] = await test();
      } catch (error) {
        console.error(`Error testing ${capability}:`, error);
        results[capability] = false;
      }
    }

    return results;
  }
}

export const enhancedGroqService = new EnhancedGroqService();
export default enhancedGroqService;
