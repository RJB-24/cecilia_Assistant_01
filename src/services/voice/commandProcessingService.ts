
import { groqService } from '../groqService';
import { VoiceCommand } from './types';

export class VoiceCommandProcessingService {
  private commandHistory: VoiceCommand[] = [];
  private maxHistorySize = 50;

  async processVoiceCommand(text: string): Promise<VoiceCommand> {
    try {
      let intent = 'unknown';
      const entities: Record<string, any> = {};
      let confidence = 0.8;

      if (groqService.isConfigured()) {
        const response = await groqService.processCommand(
          `Analyze this voice command and extract intent and entities: "${text}"`
        );
        
        ({ intent, entities, confidence } = await this.parseAIResponse(response, text));
      } else {
        ({ intent, entities } = this.fallbackIntentDetection(text));
      }

      const command: VoiceCommand = {
        text,
        confidence,
        intent,
        entities
      };

      this.addToHistory(command);
      return command;
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        text,
        confidence: 0.3,
        intent: 'unknown',
        entities: {}
      };
    }
  }

  private async parseAIResponse(response: string, originalText: string): Promise<{
    intent: string;
    entities: Record<string, any>;
    confidence: number;
  }> {
    let intent = 'unknown';
    const entities: Record<string, any> = {};
    let confidence = 0.9;

    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('email') || lowerResponse.includes('send message')) {
      intent = 'send_email';
      const recipientMatch = response.match(/to:?\s*([a-zA-Z0-9@.\s]+)/i);
      if (recipientMatch) entities.recipient = recipientMatch[1].trim();
    } else if (lowerResponse.includes('calendar') || lowerResponse.includes('schedule')) {
      intent = 'create_calendar_event';
      const dateMatch = response.match(/date:?\s*([^,\n]+)/i);
      if (dateMatch) entities.date = dateMatch[1].trim();
    } else if (lowerResponse.includes('weather')) {
      intent = 'get_weather';
      const locationMatch = response.match(/location:?\s*([^,\n]+)/i);
      if (locationMatch) entities.location = locationMatch[1].trim();
    } else if (lowerResponse.includes('news')) {
      intent = 'get_news';
      const categoryMatch = response.match(/category:?\s*([^,\n]+)/i);
      if (categoryMatch) entities.category = categoryMatch[1].trim();
    } else if (lowerResponse.includes('note') || lowerResponse.includes('transcribe')) {
      intent = 'take_notes';
      const titleMatch = response.match(/title:?\s*([^,\n]+)/i);
      if (titleMatch) entities.title = titleMatch[1].trim();
    } else if (lowerResponse.includes('open') || lowerResponse.includes('launch')) {
      intent = 'open_application';
      const appMatch = response.match(/app:?\s*([^,\n]+)/i);
      if (appMatch) entities.appName = appMatch[1].trim();
    }

    return { intent, entities, confidence };
  }

  private fallbackIntentDetection(text: string): { intent: string; entities: Record<string, any> } {
    const lowerText = text.toLowerCase();
    let intent = 'unknown';
    const entities: Record<string, any> = {};

    if (lowerText.includes('email') || lowerText.includes('send')) {
      intent = 'send_email';
      const emailMatch = text.match(/to\s+([a-zA-Z0-9@.\s]+)/i);
      if (emailMatch) entities.recipient = emailMatch[1].trim();
    } else if (lowerText.includes('weather')) {
      intent = 'get_weather';
      const locationMatch = text.match(/in\s+([a-zA-Z\s]+)/i);
      if (locationMatch) entities.location = locationMatch[1].trim();
    } else if (lowerText.includes('news')) {
      intent = 'get_news';
    } else if (lowerText.includes('schedule') || lowerText.includes('calendar')) {
      intent = 'create_calendar_event';
    } else if (lowerText.includes('note') || lowerText.includes('remember')) {
      intent = 'take_notes';
    } else if (lowerText.includes('open') || lowerText.includes('launch')) {
      intent = 'open_application';
      const appMatch = text.match(/open\s+([a-zA-Z0-9\s]+)/i);
      if (appMatch) entities.appName = appMatch[1].trim();
    }

    return { intent, entities };
  }

  private addToHistory(command: VoiceCommand): void {
    this.commandHistory.unshift(command);
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory = this.commandHistory.slice(0, this.maxHistorySize);
    }
  }

  getCommandHistory(): VoiceCommand[] {
    return [...this.commandHistory];
  }

  clearHistory(): void {
    this.commandHistory = [];
  }

  getLastCommand(): VoiceCommand | null {
    return this.commandHistory[0] || null;
  }
}

export const voiceCommandProcessingService = new VoiceCommandProcessingService();
export default voiceCommandProcessingService;
