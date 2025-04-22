
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, Send, Camera, Cog, Lightbulb } from "lucide-react";
import { groqService } from "@/services/groqService";
import { screenpipeService } from "@/services/screenpipeService";
import { voiceService } from "@/services/voiceService";
import { cn } from "@/lib/utils";
import { AutomationTask } from "@/services/screenpipeService";

const CommandProcessor: React.FC = () => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const [isGroqConfigured, setIsGroqConfigured] = useState(false);
  const [isScreenpipeConfigured, setIsScreenpipeConfigured] = useState(false);

  // Check if services are configured
  useEffect(() => {
    setIsGroqConfigured(groqService.isConfigured());
    setIsScreenpipeConfigured(screenpipeService.isConfigured());
    
    // Attempt to connect to Screenpipe if configured
    if (screenpipeService.isConfigured() && !screenpipeService.isConnected()) {
      screenpipeService.connect()
        .then(connected => {
          if (connected) {
            toast.success("Connected to Screenpipe Terminator");
          }
        })
        .catch(error => {
          toast.error("Failed to connect to Screenpipe");
          console.error(error);
        });
    }
  }, []);

  // Handle command submission
  const handleSendCommand = async () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    setResponse("");
    toast.info("Processing command...");
    
    try {
      // Process command with Groq
      if (isGroqConfigured) {
        const result = await groqService.processCommand(command);
        setResponse(result);
        
        // Attempt to execute automation task if Screenpipe is configured
        if (isScreenpipeConfigured && result) {
          // Extract potential automation task from the response
          const automationTask = extractAutomationTask(result, command);
          
          if (automationTask) {
            toast.info(`Executing task: ${automationTask.action}`);
            
            try {
              const taskResult = await screenpipeService.executeTask(automationTask);
              
              if (taskResult.success) {
                toast.success("Task completed successfully");
              } else {
                toast.error(`Task failed: ${taskResult.error}`);
              }
            } catch (error) {
              toast.error("Failed to execute task");
              console.error(error);
            }
          }
        }
      } else {
        // Fallback if Groq is not configured
        setResponse(`I'd process "${command}" with Groq API, but it's not configured yet. Please add your Groq API key in Settings.`);
        toast.warning("Groq API not configured");
      }
    } catch (error) {
      console.error("Error processing command:", error);
      setResponse(`Sorry, I encountered an error while processing your command: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Error processing command");
    } finally {
      setIsProcessing(false);
      setCommand("");
    }
  };
  
  // Extract potential automation task from AI response
  const extractAutomationTask = (response: string, originalCommand: string): AutomationTask | null => {
    // Simple heuristic to detect potential tasks
    if (originalCommand.toLowerCase().includes("email")) {
      return {
        type: "email",
        action: "compose",
        parameters: {
          subject: "Generated Email",
          body: response
        }
      };
    } else if (originalCommand.toLowerCase().includes("schedule") || originalCommand.toLowerCase().includes("calendar")) {
      return {
        type: "app", // Changed from "calendar" to "app" to match the type definition
        action: "create_event",
        parameters: {
          title: "New Event",
          description: response,
          startTime: new Date().toISOString()
        }
      };
    } else if (originalCommand.toLowerCase().includes("browser") || originalCommand.toLowerCase().includes("open")) {
      const urlMatch = response.match(/https?:\/\/[^\s]+/);
      return {
        type: "browser",
        action: "open",
        parameters: {
          url: urlMatch ? urlMatch[0] : "https://www.google.com"
        }
      };
    }
    
    return null;
  };
  
  // Start voice recognition
  const startListening = async () => {
    if (!voiceService.isSupported()) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    try {
      setIsListening(true);
      await voiceService.start();
      toast.info("Cecilia is listening. Start speaking...");
      
      // Timeout after 10 seconds of listening if no speech is detected
      const timeout = setTimeout(() => {
        if (voiceService.isListening()) {
          stopListening();
          toast.info("Listening timeout. Please try again.");
        }
      }, 10000);
      
      // Clean up timeout on unmount
      return () => clearTimeout(timeout);
    } catch (error) {
      setIsListening(false);
      toast.error("Failed to start voice recognition");
      console.error(error);
    }
  };
  
  // Stop voice recognition
  const stopListening = async () => {
    if (isListening) {
      try {
        const transcript = await voiceService.stop();
        setIsListening(false);
        
        if (transcript) {
          setCommand(transcript);
          toast.success(`Voice command: "${transcript}"`);
        } else {
          toast.info("No speech detected");
        }
      } catch (error) {
        setIsListening(false);
        toast.error("Error stopping voice recognition");
        console.error(error);
      }
    }
  };
  
  // Capture screen with Screenpipe
  const handleCaptureScreen = async () => {
    if (!isScreenpipeConfigured) {
      toast.warning("Screenpipe is not configured. Please add your API key in Settings.");
      return;
    }
    
    toast.info("Capturing screen...");
    
    try {
      const screenImage = await screenpipeService.captureScreen();
      toast.success("Screen captured");
      
      // In a real implementation, you might want to process or display the captured screen
      console.log("Screen captured:", screenImage);
    } catch (error) {
      toast.error("Failed to capture screen");
      console.error(error);
    }
  };
  
  // Text-to-speech using Groq API
  const speakResponse = async () => {
    if (!isGroqConfigured || !response || isSpeaking) {
      return;
    }
    
    try {
      setIsSpeaking(true);
      toast.info("Speaking response...");
      
      await groqService.speakText(response);
      
      setIsSpeaking(false);
    } catch (error) {
      setIsSpeaking(false);
      toast.error("Failed to speak response");
      console.error(error);
    }
  };
  
  // Scroll to bottom of response when it changes
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="space-y-4">
      {/* Command Input */}
      <Card className="jarvis-hologram">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold jarvis-glow-text">Command Center</CardTitle>
          <CardDescription className="text-jarvis-secondary">
            Speak or type your command to Cecilia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Cecilia, help me with..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-jarvis-dark/80 border-jarvis-border text-jarvis-light"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendCommand();
              }}
              disabled={isProcessing || isListening}
            />
            <Button 
              variant="outline"
              size="icon"
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "relative bg-jarvis-dark/80 border-jarvis-primary/30 hover:bg-jarvis-blue/20",
                isListening ? "mic-pulse mic-active" : ""
              )}
              disabled={isProcessing}
            >
              {isListening ? <StopCircle className="h-4 w-4 text-groqflow-error" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline"
              size="icon"
              type="button"
              onClick={handleCaptureScreen}
              className="bg-jarvis-dark/80 border-jarvis-primary/30 hover:bg-jarvis-blue/20"
              disabled={isProcessing || isListening || !isScreenpipeConfigured}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendCommand}
              disabled={!command.trim() || isProcessing || isListening}
              className="bg-jarvis-blue hover:bg-jarvis-sky text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
          
          {!isGroqConfigured && (
            <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-yellow-400 text-xs">
              <div className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                <span>Groq API not configured. Add your API key in Settings.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Response Display */}
      {response && (
        <Card className="jarvis-hologram">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold jarvis-glow-text">Cecilia's Response</CardTitle>
              {isGroqConfigured && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={speakResponse}
                  disabled={!response || isSpeaking}
                  className="h-8 w-8"
                >
                  <Lightbulb className="h-4 w-4 text-jarvis-primary" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              ref={responseRef}
              className="bg-jarvis-dark/70 border border-jarvis-border/30 rounded-md p-3 max-h-[300px] overflow-y-auto"
            >
              <Textarea 
                value={response}
                className="bg-transparent border-0 resize-none w-full min-h-[100px] text-jarvis-light focus-visible:ring-0 focus-visible:ring-offset-0"
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-xs text-jarvis-secondary">
              {isSpeaking ? (
                <span className="flex items-center">
                  <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Speaking...
                </span>
              ) : (
                isProcessing ? "Processing..." : "Ready"
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CommandProcessor;
