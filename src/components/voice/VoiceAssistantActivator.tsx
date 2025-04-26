
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
import { voiceService } from "@/services/voice/voiceService";

interface VoiceAssistantActivatorProps {
  autoActivate?: boolean;
}

const VoiceAssistantActivator: React.FC<VoiceAssistantActivatorProps> = ({ 
  autoActivate = true 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Check if voice recognition is supported
    const supported = voiceService.isSupported();
    setIsLoading(false);
    
    if (supported && autoActivate) {
      activateVoiceAssistant();
    }
  }, [autoActivate]);

  const activateVoiceAssistant = async () => {
    if (!voiceService.isSupported()) {
      toast.error("Voice recognition is not supported in your browser");
      return;
    }
    
    try {
      setIsLoading(true);
      await voiceService.start();
      setIsListening(true);
      toast.success("Voice assistant activated");
    } catch (error) {
      toast.error(`Failed to activate voice assistant: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateVoiceAssistant = async () => {
    try {
      setIsLoading(true);
      await voiceService.stop();
      setIsListening(false);
      toast.info("Voice assistant deactivated");
    } catch (error) {
      toast.error(`Error deactivating voice assistant: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (!isMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      toast.info("Voice responses muted");
    } else {
      toast.info("Voice responses unmuted");
      voiceService.speakText("Voice responses are now unmuted");
    }
  };

  return (
    <Card className="jarvis-hologram pulse-subtle">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {isListening ? "Assistant Listening" : "Assistant Inactive"}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-8 h-8 p-0 rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-jarvis-dark/40'}`} 
            onClick={toggleMute}
            disabled={isLoading}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className={isListening ? "bg-red-600 hover:bg-red-700" : "bg-jarvis-blue hover:bg-jarvis-sky"}
            onClick={isListening ? deactivateVoiceAssistant : activateVoiceAssistant}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : isListening ? (
              <><MicOff className="h-4 w-4 mr-1" /> Deactivate</>
            ) : (
              <><Mic className="h-4 w-4 mr-1" /> Activate</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistantActivator;
