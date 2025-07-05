
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Sparkles } from 'lucide-react';

interface AssistantBottomControlsProps {
  isListening: boolean;
  responseText: string;
  onVoiceToggle: () => void;
}

const AssistantBottomControls: React.FC<AssistantBottomControlsProps> = ({
  isListening,
  responseText,
  onVoiceToggle
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
      <div className="flex flex-col items-center space-y-6">
        {/* Response Text Display */}
        <Card className="bg-black/40 backdrop-blur-lg border border-cyan-400/30 max-w-4xl shadow-2xl shadow-cyan-400/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-center min-h-[3rem]">
              {responseText ? (
                <p className="text-white text-center text-lg leading-relaxed">
                  {responseText}
                </p>
              ) : (
                <div className="flex items-center space-x-2 text-white/60">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span className="text-lg">Ready to assist you...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voice Control Button */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={onVoiceToggle}
            size="lg"
            className={`w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse shadow-red-500/50' 
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-cyan-500/50'
            }`}
            disabled={false}
          >
            {isListening ? <MicOff size={36} /> : <Mic size={36} />}
          </Button>

          {/* Status indicator */}
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium">
              {isListening ? 'Click to stop listening' : 'Click to start voice command'}
            </p>
          </div>
        </div>

        {/* Quick Command Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl text-xs text-white/50">
          <span className="bg-white/10 px-3 py-1 rounded-full">"What's the weather?"</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">"Schedule a meeting"</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">"Take notes"</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">"Send an email"</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">"Analyze data"</span>
        </div>
      </div>
    </div>
  );
};

export default AssistantBottomControls;
