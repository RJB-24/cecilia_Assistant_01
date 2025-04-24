
import { BaseNLPService } from './baseService';
import { NLPMessage, NLPOptions, NLPResult } from './types';

export class ChatService extends BaseNLPService {
  async processText(text: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
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
}
