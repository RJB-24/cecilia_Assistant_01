
import { NLPConfig, NLPMessage, NLPOptions, NLPResult } from './types';
import { ChatService } from './chatService';
import { VisionService } from './visionService';
import { SpeechService } from './speechService';
import { AgentService } from './agentService';
import { BatchService } from './batchService';
import { BaseNLPService } from './baseService';

export class NLPService extends BaseNLPService {
  private chatService: ChatService;
  private visionService: VisionService;
  private speechService: SpeechService;
  private agentService: AgentService;
  private batchService: BatchService;

  constructor(config?: Partial<NLPConfig>) {
    super(config);
    this.chatService = new ChatService(config);
    this.visionService = new VisionService(config);
    this.speechService = new SpeechService(config);
    this.agentService = new AgentService(config);
    this.batchService = new BatchService(config);
  }

  configure(apiKey: string, config?: Partial<NLPConfig>): void {
    super.configure(apiKey, config);
    this.chatService.configure(apiKey, config);
    this.visionService.configure(apiKey, config);
    this.speechService.configure(apiKey, config);
    this.agentService.configure(apiKey, config);
    this.batchService.configure(apiKey, config);
  }

  // Delegate methods to specific services
  async processText(text: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    return this.chatService.processText(text, options);
  }

  async* streamChat(messages: NLPMessage[], options?: Partial<NLPOptions>): AsyncGenerator<string, void, unknown> {
    yield* this.chatService.streamChat(messages, options);
  }

  async processImageWithText(imageUrl: string, question: string): Promise<NLPResult> {
    return this.visionService.processImageWithText(imageUrl, question);
  }

  async transcribeAudio(audioBlob: Blob, options?: Partial<NLPOptions>): Promise<string> {
    return this.speechService.transcribeAudio(audioBlob, options);
  }

  async textToSpeech(text: string, options?: Partial<NLPOptions>): Promise<ArrayBuffer> {
    return this.speechService.textToSpeech(text, options);
  }

  async processAgentCommand(command: string, options?: Partial<NLPOptions>): Promise<NLPResult> {
    return this.agentService.processAgentCommand(command, options);
  }

  async submitBatch(jobs: any[], options?: { window?: string }): Promise<any> {
    return this.batchService.submitBatch(jobs, options);
  }
}

// Export singleton instance
export const nlpService = new NLPService();
export default nlpService;

// Re-export types
export * from './types';
