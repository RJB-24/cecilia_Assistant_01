
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Home, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <h1 className="text-4xl font-bold text-white tracking-wider drop-shadow-lg">
            {assistantName}
          </h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isListening ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 
              isSpeaking ? 'bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50' : 
              'bg-cyan-400 shadow-lg shadow-cyan-400/50'
            }`} />
            <span className="text-sm text-white/80 font-medium">
              {isListening ? 'Listening...' : 
               isSpeaking ? 'Speaking...' : 
               'Ready'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className={`text-white hover:bg-white/20 transition-all duration-200 ${
              isMuted ? 'bg-red-500/20 text-red-300' : 'hover:text-cyan-300'
            }`}
            title={isMuted ? 'Unmute voice responses' : 'Mute voice responses'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-cyan-300 transition-all duration-200"
              title="Go to main dashboard"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-cyan-300 transition-all duration-200"
              title="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssistantTopBar;
