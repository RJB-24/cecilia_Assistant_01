
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MicIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CommandInput = () => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    toast.info("Processing command...");
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Command processed: "${command}"`);
      setCommand("");
      setIsProcessing(false);
    }, 1500);
  };
  
  const toggleVoiceCommand = () => {
    if (!isListening) {
      setIsListening(true);
      toast.info("Cecilia is listening. Start speaking...");
      setTimeout(() => {
        setIsListening(false);
        const mockCommand = "Email the Q1 report to the CFO";
        setCommand(mockCommand);
        toast.success(`Cecilia heard: ${mockCommand}`);
      }, 3000);
    } else {
      setIsListening(false);
      toast.info("Cecilia stopped listening.");
    }
  };

  return (
    <Card className="jarvis-hologram">
      <CardHeader>
        <CardTitle className="text-xl font-bold jarvis-glow-text">Command Center</CardTitle>
        <CardDescription className="text-jarvis-secondary">
          Type or speak your command to Cecilia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Cecilia, help me with..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-jarvis-dark/80 border-jarvis-border text-jarvis-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendCommand();
            }}
            disabled={isProcessing || isListening}
          />
          <Button 
            variant="outline"
            size="icon"
            type="button"
            onClick={toggleVoiceCommand}
            className={cn(
              "relative bg-jarvis-dark/80 border-jarvis-primary/30 hover:bg-jarvis-blue/20",
              isListening ? "mic-pulse mic-active" : ""
            )}
          >
            <MicIcon className={cn("h-4 w-4", isListening ? "text-groqflow-error" : "")} />
          </Button>
          <Button 
            onClick={handleSendCommand}
            disabled={!command.trim() || isProcessing}
            className="bg-jarvis-blue hover:bg-jarvis-sky text-white"
          >
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandInput;
