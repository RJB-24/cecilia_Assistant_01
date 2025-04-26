
import { CoreVoiceService } from './core/coreVoiceService';

export class BaseVoiceService extends CoreVoiceService {
  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    try {
      this.finalTranscript = '';
      this.interimTranscript = '';
      this.listening = true;
      this.recognition.start();
      console.log('Voice recognition started');
    } catch (error) {
      this.listening = false;
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  async stop(): Promise<string> {
    if (this.recognition && this.listening) {
      this.listening = false;
      this.recognition.stop();
      console.log('Voice recognition stopped');
    }
    return this.finalTranscript;
  }
}
