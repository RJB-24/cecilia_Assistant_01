
import { BaseNLPService } from './baseService';
import { NLPResult } from './types';

export class VisionService extends BaseNLPService {
  async processImageWithText(imageUrl: string, question: string): Promise<NLPResult> {
    this.checkConfiguration();

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
}
