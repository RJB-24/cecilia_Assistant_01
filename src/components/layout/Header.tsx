
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MicIcon, MicOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Header = () => {
  const [isListening, setIsListening] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    groq: "online", // "online", "offline", "connecting"
    terminator: "online",
  });

  const toggleVoiceCommand = () => {
    if (!isListening) {
      setIsListening(true);
      toast.info("Voice command activated. Start speaking...");
      
      // Simulating a timeout to deactivate after 5 seconds
      setTimeout(() => {
        setIsListening(false);
        toast.success("Command processed: Check email for updates");
      }, 5000);
    } else {
      setIsListening(false);
      toast.info("Voice command deactivated");
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            onClick={toggleVoiceCommand}
            variant={isListening ? "destructive" : "secondary"}
            className={cn(
              "relative",
              isListening ? "mic-pulse mic-active" : ""
            )}
          >
            {isListening ? (
              <>
                <MicOffIcon className="mr-2 h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <MicIcon className="mr-2 h-4 w-4" />
                Start Listening
              </>
            )}
          </Button>
          
          <div className="ml-4 text-sm">
            <span>Say "Cecilia, help me with..." to begin</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm flex items-center">
            <span className={`status-indicator status-${apiStatus.groq}`}></span>
            <span>Groq: {apiStatus.groq}</span>
          </div>
          <div className="text-sm flex items-center">
            <span className={`status-indicator status-${apiStatus.terminator}`}></span>
            <span>Terminator: {apiStatus.terminator}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
