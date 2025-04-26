
export interface VoiceServiceOptions {
  language?: string; // 'en-US', 'hi-IN', etc.
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

export interface VoiceRecordingOptions {
  format?: 'wav' | 'mp3' | 'webm';
  quality?: 'high' | 'medium' | 'low';
  maxDuration?: number; // in seconds
}

export interface WakeWordOptions {
  enabled?: boolean;
  customWords?: string[];
  sensitivity?: 'high' | 'medium' | 'low';
}
