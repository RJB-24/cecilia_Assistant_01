
export interface VoiceServiceOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface VoiceCommand {
  text: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
}

export interface VoiceResponse {
  success: boolean;
  message?: string;
  data?: any;
}
