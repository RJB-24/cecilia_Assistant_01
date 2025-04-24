
import { BaseNLPService } from './baseService';
import { NLPOptions, NLPResult } from './types';
import { ChatService } from './chatService';

export class AgentService extends BaseNLPService {
  private chatService: ChatService;

  constructor(config?: Partial<NLPConfig>) {
    super(config);
    this.chatService = new ChatService(config);
  }

  async processAgentCommand(command: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    const originalModel = this.config.model;
    this.config.model = this.MODELS.agent.full;

    try {
      const result = await this.chatService.processText(command, {
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
}
