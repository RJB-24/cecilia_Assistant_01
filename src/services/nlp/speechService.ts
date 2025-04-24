
import { BaseNLPService } from './baseService';
import { NLPOptions } from './types';

export class SpeechService extends BaseNLPService {
  async transcribeAudio(audioBlob: Blob, options?: Partial<NLPOptions>): Promise<string> {
    this.checkConfiguration();

    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', this.MODELS.speech.transcription);
    
    if (options?.language) {
      formData.append('language', options.language);
    }

    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async textToSpeech(text: string, options?: Partial<NLPOptions>): Promise<ArrayBuffer> {
    this.checkConfiguration();

    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.MODELS.tts,
          input: text,
          voice: options?.voice || 'Fritz-PlayAI',
          response_format: 'wav'
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }
}
