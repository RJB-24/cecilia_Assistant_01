
import { groqService } from '../groqService';
import { VoiceCommand } from './types';

export class CommandProcessingService {
  /**
   * Process voice command using Groq's NLP capabilities
   */
  async processCommand(text: string): Promise<VoiceCommand> {
    try {
      let intent = 'unknown';
      const entities: Record<string, any> = {};
      
      if (groqService.isConfigured()) {
        const response = await groqService.processCommand(text);
        return this.parseGroqResponse(response, text);
      } else {
        return this.fallbackProcessing(text);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        text,
        confidence: 0.5,
        intent: 'unknown',
        entities: {}
      };
    }
  }

  private parseGroqResponse(response: string, originalText: string): VoiceCommand {
    let intent = 'unknown';
    const entities: Record<string, any> = {};

    if (response.toLowerCase().includes('email')) {
      intent = 'send_email';
      const matches = response.match(/to\s+([a-zA-Z\s]+)/i);
      if (matches && matches[1]) {
        entities.recipient = matches[1].trim();
      }
    } else if (response.toLowerCase().includes('schedule')) {
      intent = 'create_calendar_event';
    } else if (response.toLowerCase().includes('analyze')) {
      intent = 'analyze_data';
    } else if (response.toLowerCase().includes('note') || response.toLowerCase().includes('transcribe')) {
      intent = 'take_notes';
      const titleMatches = response.match(/for\s+([a-zA-Z0-9\s]+)/i);
      if (titleMatches && titleMatches[1]) {
        entities.title = titleMatches[1].trim();
      }
    } else if (response.toLowerCase().includes('open') || response.toLowerCase().includes('launch') || response.toLowerCase().includes('start')) {
      intent = 'open_application';
      const appMatches = response.match(/open\s+([a-zA-Z0-9\s]+)/i);
      if (appMatches && appMatches[1]) {
        entities.appName = appMatches[1].trim();
      }
    }

    return {
      text: originalText,
      confidence: 0.95,
      intent,
      entities
    };
  }

  private fallbackProcessing(text: string): VoiceCommand {
    let intent = 'unknown';
    const entities: Record<string, any> = {};
    
    if (text.toLowerCase().includes('email') || text.toLowerCase().includes('send')) {
      intent = 'send_email';
      const matches = text.match(/to\s+([a-zA-Z\s]+)/i);
      if (matches && matches[1]) {
        entities.recipient = matches[1].trim();
      }
    } else if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('calendar')) {
      intent = 'create_calendar_event';
      const dateMatches = text.match(/on\s+([a-zA-Z0-9\s,]+)/i);
      if (dateMatches && dateMatches[1]) {
        entities.date = dateMatches[1].trim();
      }
    } else if (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('data')) {
      intent = 'analyze_data';
    } else if (text.toLowerCase().includes('note') || text.toLowerCase().includes('transcribe')) {
      intent = 'take_notes';
      const titleMatches = text.match(/for\s+([a-zA-Z0-9\s]+)/i);
      if (titleMatches && titleMatches[1]) {
        entities.title = titleMatches[1].trim();
      }
    } else if (text.toLowerCase().includes('open') || text.toLowerCase().includes('launch')) {
      intent = 'open_application';
      const appMatches = text.match(/open\s+([a-zA-Z0-9\s]+)/i);
      if (appMatches && appMatches[1]) {
        entities.appName = appMatches[1].trim();
      }
    }

    return {
      text,
      confidence: 0.8,
      intent,
      entities
    };
  }
}

export const commandProcessingService = new CommandProcessingService();
export default commandProcessingService;
