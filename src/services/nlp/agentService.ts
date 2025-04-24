
import { BaseNLPService } from './baseService';
import { NLPConfig, NLPOptions, NLPResult, NLPTool, NLPMessage } from './types';
import { ChatService } from './chatService';

export class AgentService extends BaseNLPService {
  private chatService: ChatService;
  private toolExecutors: Record<string, (params: any) => Promise<any>> = {};

  constructor(config?: Partial<NLPConfig>) {
    super(config);
    this.chatService = new ChatService(config);
    this.registerDefaultTools();
  }

  private registerDefaultTools() {
    // Register built-in tool executors
    this.toolExecutors["web_search"] = async (params) => {
      console.log("Executing web search with params:", params);
      // In production: would make an actual search API call
      return { results: [`Simulated search result for: ${params.query}`] };
    };

    this.toolExecutors["execute_code"] = async (params) => {
      console.log("Executing code with params:", params.code);
      // In production: would use a secure execution environment
      return { result: "Executed code successfully", output: "Simulated execution output" };
    };
  }

  /**
   * Register a custom tool executor function
   * @param toolName The name of the tool as defined in your tool definitions
   * @param executor Function that executes the tool given parameters
   */
  registerToolExecutor(toolName: string, executor: (params: any) => Promise<any>) {
    this.toolExecutors[toolName] = executor;
    console.log(`Registered custom tool executor for: ${toolName}`);
  }

  /**
   * Process a command using the agent capability with tools
   */
  async processAgentCommand(command: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    const originalModel = this.config.model;
    this.config.model = this.MODELS.agent.full;
    
    // Define default tools if none provided
    const tools: NLPTool[] = options?.tools || [
      {
        type: 'function',
        function: {
          name: 'web_search',
          description: 'Search the web for up-to-date information',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query'
              }
            },
            required: ['query']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'execute_code',
          description: 'Execute Python code to perform calculations or data processing',
          parameters: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The Python code to execute'
              }
            },
            required: ['code']
          }
        }
      }
    ];

    try {
      // Set up system message to guide agent behavior
      const messages: NLPMessage[] = [
        {
          role: 'system',
          content: options?.systemPrompt || 
            "You are an intelligent assistant with access to tools. Use these tools when necessary to provide accurate and helpful responses. Think step-by-step and ensure you understand the user's request fully before executing any actions."
        },
        {
          role: 'user',
          content: command
        }
      ];

      // Process with reasoning steps visible
      const reasoningFormat = options?.reasoningFormat || 'raw';
      
      const result = await this.chatService.processMessages(messages, {
        ...options,
        tools,
        toolChoice: options?.toolChoice || 'auto',
        reasoningFormat
      });

      // Handle tool calls if present
      if (result.actions && result.actions.length > 0) {
        try {
          const actionResults = await this.executeToolActions(result.actions);
          result.toolResults = actionResults;
        } catch (toolError) {
          console.error("Error executing tool actions:", toolError);
          result.toolError = toolError instanceof Error ? toolError.message : String(toolError);
        }
      }

      this.config.model = originalModel;
      return result;
    } catch (error) {
      this.config.model = originalModel;
      console.error('Error processing agent command:', error);
      throw error;
    }
  }

  /**
   * Process multiple turns of conversation with the agent
   */
  async processAgentConversation(messages: NLPMessage[], options?: Partial<NLPOptions>): Promise<NLPResult> {
    const originalModel = this.config.model;
    this.config.model = this.MODELS.agent.full;

    try {
      // Add system message if not present
      if (!messages.some(msg => msg.role === 'system')) {
        messages.unshift({
          role: 'system',
          content: options?.systemPrompt || 
            "You are an intelligent assistant with access to tools. Use these tools when necessary to provide accurate and helpful responses."
        });
      }

      // Define default tools
      const tools = options?.tools || [
        {
          type: 'function',
          function: {
            name: 'web_search',
            description: 'Search the web for information',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'The search query' }
              },
              required: ['query']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'execute_code',
            description: 'Execute Python code',
            parameters: {
              type: 'object',
              properties: {
                code: { type: 'string', description: 'The Python code to execute' }
              },
              required: ['code']
            }
          }
        }
      ];

      const result = await this.chatService.processMessages(messages, {
        ...options,
        tools,
        toolChoice: options?.toolChoice || 'auto',
        reasoningFormat: options?.reasoningFormat || 'raw'
      });

      // Handle tool calls if present
      if (result.actions && result.actions.length > 0) {
        try {
          const actionResults = await this.executeToolActions(result.actions);
          result.toolResults = actionResults;
        } catch (toolError) {
          console.error("Error executing tool actions:", toolError);
          result.toolError = toolError instanceof Error ? toolError.message : String(toolError);
        }
      }

      this.config.model = originalModel;
      return result;
    } catch (error) {
      this.config.model = originalModel;
      console.error('Error processing agent conversation:', error);
      throw error;
    }
  }

  /**
   * Execute tool actions returned by the agent
   */
  private async executeToolActions(actions: Array<{type: string; parameters: Record<string, any>}>): Promise<any[]> {
    const results = [];
    
    for (const action of actions) {
      if (action.type === 'function' && action.parameters.name) {
        const toolName = action.parameters.name;
        const executor = this.toolExecutors[toolName];
        
        if (executor) {
          try {
            const result = await executor(action.parameters.arguments || {});
            results.push({ 
              tool: toolName, 
              success: true, 
              result 
            });
          } catch (error) {
            results.push({ 
              tool: toolName, 
              success: false, 
              error: error instanceof Error ? error.message : String(error)
            });
          }
        } else {
          results.push({ 
            tool: toolName, 
            success: false, 
            error: `No executor registered for tool: ${toolName}`
          });
        }
      }
    }
    
    return results;
  }
}
