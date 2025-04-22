
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

const CommandInput = () => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Command Center</CardTitle>
        <CardDescription>
          Type or speak your command to Cecilia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Type 'Cecilia, help me with...' to begin"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendCommand();
            }}
            disabled={isProcessing}
          />
          <Button 
            variant="outline"
            size="icon"
            type="button"
            disabled={isProcessing}
            className="bg-white"
          >
            <MicIcon className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSendCommand}
            disabled={!command.trim() || isProcessing}
            className="bg-groqflow-navy hover:bg-groqflow-navy/80"
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
