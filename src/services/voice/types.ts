
export interface VoiceServiceOptions {
  language?: string;
  continuous?: boolean;
  onInterim?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface VoiceCommand {
  text: string;
  confidence: number;
  intent?: string;
  entities?: Record<string, any>;
}
