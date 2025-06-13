
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';

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
      <div className="flex flex-col items-center space-y-4">
        {/* Response Text */}
        <Card className="bg-black/50 backdrop-blur-sm border-white/20 max-w-2xl">
          <CardContent className="p-4">
            <p className="text-white text-center min-h-[2rem] flex items-center justify-center">
              {responseText || 'Waiting for your command...'}
            </p>
          </CardContent>
        </Card>

        {/* Voice Button */}
        <Button
          onClick={onVoiceToggle}
          size="lg"
          className={`w-20 h-20 rounded-full ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white shadow-2xl transform transition-all duration-200 hover:scale-110`}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </Button>

        {/* Quick Actions */}
        <div className="flex space-x-2 text-xs text-white/70">
          <span>Say: "Schedule a meeting" • "Take notes" • "Send email" • "Analyze data"</span>
        </div>
      </div>
    </div>
  );
};

export default AssistantBottomControls;
