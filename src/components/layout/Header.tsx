
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MicIcon, MicOffIcon, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Header = () => {
  const [isListening, setIsListening] = useState(false);
  
  const toggleVoiceCommand = () => {
    if (!isListening) {
      setIsListening(true);
      toast.info("AI Assistant is listening...");
      setTimeout(() => {
        setIsListening(false);
        toast.success("Command processed successfully");
      }, 3000);
    } else {
      setIsListening(false);
      toast.info("Stopped listening");
    }
  };
  
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">
            AI Assistant
          </h1>
          <Button
            onClick={toggleVoiceCommand}
            variant={isListening ? "destructive" : "secondary"}
            size="sm"
            className={cn(
              "relative transition-all duration-300",
              isListening ? "animate-pulse" : ""
            )}
          >
            {isListening ? (
              <>
                <MicOffIcon className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <MicIcon className="h-4 w-4 mr-2" />
                Voice
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link to="/notifications">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
