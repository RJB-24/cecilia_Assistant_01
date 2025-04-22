
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
      toast.info("Cecilia is listening. Start speaking...");
      setTimeout(() => {
        setIsListening(false);
        toast.success("Cecilia processed your command: Check email for updates");
      }, 5000);
    } else {
      setIsListening(false);
      toast.info("Cecilia stopped listening.");
    }
  };
  
  return (
    <header className="bg-jarvis-dark/80 border-b border-jarvis-border px-8 py-4 shadow-jarvis-glow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold tracking-wider text-jarvis-primary jarvis-glow-text drop-shadow-md">
            CECILIA
            <span className="ml-4 text-base font-mono tracking-wide text-jarvis-secondary">
              <span className="hidden sm:inline">– Your Workflow AI</span>
            </span>
          </h1>
          <Button
            onClick={toggleVoiceCommand}
            variant={isListening ? "destructive" : "secondary"}
            className={cn(
              "relative ml-8 px-6 py-2 text-md font-bold rounded-jarvis shadow-jarvis-glow bg-jarvis-blue/60 hover:bg-jarvis-sky/80 border border-jarvis-primary/30 transition-all duration-300",
              isListening ? "mic-pulse mic-active" : ""
            )}
          >
            {isListening ? (
              <>
                <MicOffIcon className="mr-2 h-5 w-5 jarvis-glow-text" />
                Stop Listening
              </>
            ) : (
              <>
                <MicIcon className="mr-2 h-5 w-5 jarvis-glow-text" />
                Start Listening
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-sm flex items-center">
            <span className={`status-indicator status-${apiStatus.groq} mr-2`}></span>
            <span className="text-jarvis-secondary">Groq: <span className="font-semibold">{apiStatus.groq}</span></span>
          </div>
          <div className="text-sm flex items-center">
            <span className={`status-indicator status-${apiStatus.terminator} mr-2`}></span>
            <span className="text-jarvis-secondary">Terminator: <span className="font-semibold">{apiStatus.terminator}</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
