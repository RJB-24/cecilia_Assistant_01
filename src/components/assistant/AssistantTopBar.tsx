
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Home, Volume2, VolumeX } from 'lucide-react';

interface AssistantTopBarProps {
  assistantName: string;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

const AssistantTopBar: React.FC<AssistantTopBarProps> = ({
  assistantName,
  isListening,
  isSpeaking,
  isMuted,
  onToggleMute
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            {assistantName}
          </h1>
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-green-400 animate-pulse' : 
            isSpeaking ? 'bg-orange-400 animate-pulse' : 
            'bg-blue-400'
          }`} />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.href = '/lab'}
          >
            <Home />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.href = '/settings'}
          >
            <Settings />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantTopBar;
