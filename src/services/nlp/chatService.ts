
import { BaseNLPService } from './baseService';
import { NLPMessage, NLPOptions, NLPResult } from './types';

export class ChatService extends BaseNLPService {
  async processText(text: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    return this.processMessages([{ role: 'user', content: text }], options);
  }

  async processMessages(messages: NLPMessage[], options?: Partial<NLPOptions>): Promise<NLPResult> {
    this.checkConfiguration();

    try {
      const startTime = Date.now();

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
          stream: options?.stream ?? false,
          response_format: options?.responseFormat,
          tools: options?.tools,
          tool_choice: options?.toolChoice,
          reasoning_format: options?.reasoningFormat
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message;
      const content = message?.content || '';
      const processingTime = Date.now() - startTime;

      // Extract tool calls if present
      const toolCalls = message?.tool_calls || [];
      const actions = toolCalls.map((tool: any) => {
        if (tool.type === 'function') {
          let parsedArguments = {};
          try {
            parsedArguments = JSON.parse(tool.function.arguments);
          } catch (e) {
            console.error("Failed to parse tool arguments:", e);
          }

          return {
            type: 'function',
            parameters: {
              name: tool.function.name,
              arguments: parsedArguments
            }
          };
        }
        return null;
      }).filter(Boolean);

      // Extract reasoning if available based on format
      let reasoning = undefined;
      if (options?.reasoningFormat === 'parsed' && message?.reasoning) {
        reasoning = message.reasoning;
      } else if (options?.reasoningFormat === 'raw') {
        // Extract reasoning from <thinking> tags if present
        const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
        if (thinkingMatch) {
          reasoning = thinkingMatch[1].trim();
        }
      }

      return {
        text: content,
        tokens: data.usage?.total_tokens,
        processingTime,
        intent: this.detectIntent(content),
        entities: this.extractEntities(content),
        actions: actions.length > 0 ? actions : undefined,
        reasoning
      };
    } catch (error) {
      console.error('Error processing messages:', error);
      throw error;
    }
  }

  async* streamChat(messages: NLPMessage[], options?: Partial<NLPOptions>): AsyncGenerator<string, void, unknown> {
    this.checkConfiguration();

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
      }

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

  private detectIntent(text: string): string {
    // Detect intent from text using keywords
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('email') || lowerText.includes('send')) {
      return 'send_email';
    } else if (lowerText.includes('schedule') || lowerText.includes('calendar')) {
      return 'create_calendar_event';
    } else if (lowerText.includes('analyze') || lowerText.includes('data')) {
      return 'analyze_data';
    } else if (lowerText.includes('reminder') || lowerText.includes('remind me')) {
      return 'set_reminder';
    } else if (lowerText.includes('search') || lowerText.includes('find')) {
      return 'search';
    } else if (lowerText.includes('open') || lowerText.includes('launch')) {
      return 'open_application';
    }
    
    return 'general_query';
  }

  private extractEntities(text: string): Record<string, any> {
    // Extract entities from text using regex patterns
    const entities: Record<string, any> = {};
    
    // Date patterns
    const datePatterns = [
      /on\s+([a-zA-Z0-9\s,]+)/i,
      /at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?/i
    ];
    
    // Check for dates
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.date = entities.date ? `${entities.date}, ${match[1].trim()}` : match[1].trim();
      }
    }
    
    // Check for people/recipients
    const recipientPatterns = [
      /to\s+([a-zA-Z\s]+)/i,
      /with\s+([a-zA-Z\s]+)/i,
      /for\s+([a-zA-Z\s]+)/i
    ];
    
    for (const pattern of recipientPatterns) {
      const match = text.match(pattern);
      if (match) {
        const possibleName = match[1].trim();
        // Filter out common phrases that aren't likely to be names
        if (!['me', 'you', 'my', 'your', 'the'].includes(possibleName.toLowerCase())) {
          entities.person = entities.person ? `${entities.person}, ${possibleName}` : possibleName;
        }
      }
    }
    
    // Extract locations
    const locationMatch = text.match(/in\s+([a-zA-Z\s,]+)/i);
    if (locationMatch) {
      entities.location = locationMatch[1].trim();
    }
    
    // Extract URLs
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    if (urlMatch) {
      entities.urls = urlMatch;
    }
    
    return entities;
  }
}
