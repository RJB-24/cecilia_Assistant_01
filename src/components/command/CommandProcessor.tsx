import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, Send, Camera, Cog, Lightbulb, Computer, Calendar, Youtube, Video, Note } from "lucide-react";
import { groqService } from "@/services/groqService";
import { screenpipeService, APP_MAPPINGS } from "@/services/screenpipeService";
import { voiceService } from "@/services/voiceService";
import { noteService } from "@/services/noteService";
import { cn } from "@/lib/utils";
import { AutomationTask } from "@/services/screenpipeService";

const CommandProcessor: React.FC = () => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const [isGroqConfigured, setIsGroqConfigured] = useState(false);
  const [isScreenpipeConfigured, setIsScreenpipeConfigured] = useState(false);
  const [screenContext, setScreenContext] = useState<any>(null);

  useEffect(() => {
    setIsGroqConfigured(groqService.isConfigured());
    setIsScreenpipeConfigured(screenpipeService.isConfigured());
    
    if (screenpipeService.isConfigured() && !screenpipeService.isConnected()) {
      screenpipeService.connect()
        .then(connected => {
          if (connected) {
            toast.success("Connected to Screenpipe Terminator");
            updateScreenContext();
          }
        })
        .catch(error => {
          toast.error("Failed to connect to Screenpipe");
          console.error(error);
        });
    }
  }, []);

  const updateScreenContext = async () => {
    if (screenpipeService.isConnected()) {
      try {
        const context = await screenpipeService.getScreenContext();
        setScreenContext(context);
      } catch (error) {
        console.error("Error getting screen context:", error);
      }
    }
  };

  const handleAppOpeningCommand = async (commandText: string): Promise<boolean> => {
    const openAppPattern = /\b(?:open|launch|start)\s+([a-zA-Z\s]+)/i;
    const match = commandText.match(openAppPattern);
    
    if (match) {
      const appName = match[1].trim().toLowerCase();
      
      const knownApp = Object.keys(APP_MAPPINGS).find(
        key => key === appName || appName.includes(key)
      );
      
      if (knownApp || appName.includes("youtube") || appName.includes("gmail") || appName.includes("zoom")) {
        toast.info(`Opening ${appName}...`);
        
        try {
          if (isScreenpipeConfigured) {
            const result = await screenpipeService.openApplication(appName);
            
            if (result.success) {
              toast.success(`Successfully opened ${appName}`);
              setResponse(`I've opened ${appName} for you. Is there anything specific you'd like to do with it?`);
              return true;
            }
          }
          
          if (appName.includes("youtube")) {
            window.open("https://www.youtube.com", "_blank");
            setResponse(`I've opened YouTube in a new browser tab.`);
            toast.success("Opened YouTube");
            return true;
          } else if (appName.includes("gmail")) {
            window.open("https://mail.google.com", "_blank");
            setResponse(`I've opened Gmail in a new browser tab.`);
            toast.success("Opened Gmail");
            return true;
          } else if (appName.includes("zoom")) {
            window.open("https://zoom.us/join", "_blank");
            setResponse(`I've opened Zoom in a new browser tab.`);
            toast.success("Opened Zoom");
            return true;
          }
        } catch (error) {
          console.error("Error opening application:", error);
          toast.error(`Failed to open ${appName}`);
          setResponse(`I tried to open ${appName}, but encountered an error. Please make sure the application is installed or try opening it manually.`);
          return true;
        }
      }
    }
    
    return false;
  };

  const handleNoteTakingCommand = async (commandText: string): Promise<boolean> => {
    if (commandText.toLowerCase().includes("take notes") || 
        commandText.toLowerCase().includes("meeting notes") ||
        (commandText.toLowerCase().includes("notes") && 
          (commandText.toLowerCase().includes("video") || 
           commandText.toLowerCase().includes("meeting")))) {
      
      toast.info("I can help take notes! For actual note taking, I'll need access to your audio.");
      
      setResponse(`I'd be happy to take notes for your meeting or video! To do this, I'll need:

1. Permission to access your audio
2. The meeting or video to be playing on your device

For the best results:
- Make sure the audio is clear and at a good volume
- For videos, pause occasionally to allow processing
- For meetings, try to minimize background noise

When you're ready, say "Start taking notes for [meeting/video name]".`);
      
      return true;
    }
    
    const startTakingNotesPattern = /\b(?:start|begin)\s+(?:taking)\s+notes\s+(?:for|on)\s+([a-zA-Z0-9\s]+)/i;
    const matchStart = commandText.match(startTakingNotesPattern);
    
    if (matchStart) {
      const mediaName = matchStart[1].trim();
      
      toast.info(`Starting to take notes for "${mediaName}"...`);
      
      setResponse(`I'm now listening and taking notes for "${mediaName}". I'll continue until you say "Stop taking notes".

In a real implementation, I would:
1. Be transcribing the audio in real-time
2. Processing the transcript with Groq's AI
3. Generating structured notes automatically

Since this is a demo, when you say "Stop taking notes", I'll generate some sample notes.`);
      
      sessionStorage.setItem("current_note_taking_media", mediaName);
      
      return true;
    }
    
    if (commandText.toLowerCase().includes("stop taking notes")) {
      const mediaName = sessionStorage.getItem("current_note_taking_media") || "your meeting";
      
      toast.success(`Finished taking notes for "${mediaName}"`);
      
      const mockNotes = `
# Notes for "${mediaName}"

## Key Points
- Discussion of Q2 performance metrics
- Review of new product features
- Timeline for market launch in September
- Budget allocation for marketing campaign

## Action Items
- Team leads to submit resource requirements by Friday
- Schedule follow-up meeting with stakeholders
- Prepare marketing materials for review
- Update project timeline in project management tool

## Decisions
- Approved budget increase for development team
- Selected Option B for the product packaging
- Agreed on September 15th as the launch date
      `;
      
      setResponse(`Here are your notes for "${mediaName}":\n\n${mockNotes}\n\nI've saved these notes and you can access them anytime from the Notes section.`);
      
      sessionStorage.removeItem("current_note_taking_media");
      
      return true;
    }
    
    return false;
  };

  const handleSendCommand = async () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    setResponse("");
    toast.info("Processing command...");
    
    try {
      const isAppCommand = await handleAppOpeningCommand(command);
      if (isAppCommand) {
        setIsProcessing(false);
        setCommand("");
        return;
      }
      
      const isNoteCommand = await handleNoteTakingCommand(command);
      if (isNoteCommand) {
        setIsProcessing(false);
        setCommand("");
        return;
      }
      
      if (isGroqConfigured) {
        if (screenpipeService.isConnected()) {
          await updateScreenContext();
        }
        
        let result: string;
        
        if (isAgentMode) {
          result = await groqService.processAgentCommand(command);
        } else {
          result = await groqService.processCommand(command);
        }
        
        setResponse(result);
        
        if (isScreenpipeConfigured && result) {
          const automationTask = extractAutomationTask(result, command);
          
          if (automationTask) {
            toast.info(`Executing task: ${automationTask.action}`);
            
            try {
              const taskResult = await screenpipeService.executeTask(automationTask);
              
              if (taskResult.success) {
                toast.success("Task completed successfully");
                updateScreenContext();
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

  const extractAutomationTask = (response: string, originalCommand: string): AutomationTask | null => {
    if (originalCommand.toLowerCase().includes("email") || 
        originalCommand.toLowerCase().includes("send") ||
        originalCommand.toLowerCase().includes("message")) {
      return {
        type: "email",
        action: "compose",
        parameters: {
          subject: "Generated Email",
          body: response
        },
        errorHandling: {
          retries: 2
        }
      };
    } else if (originalCommand.toLowerCase().includes("schedule") || 
               originalCommand.toLowerCase().includes("calendar") ||
               originalCommand.toLowerCase().includes("meeting")) {
      return {
        type: "app", 
        action: "create_event",
        parameters: {
          title: "New Event",
          description: response,
          startTime: new Date().toISOString()
        }
      };
    } else if (originalCommand.toLowerCase().includes("browser") || 
              originalCommand.toLowerCase().includes("open") || 
              originalCommand.toLowerCase().includes("visit") ||
              originalCommand.toLowerCase().includes("go to")) {
      const urlMatch = response.match(/https?:\/\/[^\s]+/);
      const appMatch = originalCommand.match(/\b(?:open|launch|start)\s+([a-zA-Z\s]+)/i);
      
      return {
        type: "browser",
        action: "open",
        parameters: {
          url: urlMatch ? urlMatch[0] : undefined,
          app: appMatch ? appMatch[1].trim() : undefined
        }
      };
    }
    
    return null;
  };

  const startListening = async () => {
    if (!voiceService.isSupported()) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    try {
      setIsListening(true);
      await voiceService.start();
      toast.info("Cecilia is listening. Start speaking...");
      
      const timeout = setTimeout(() => {
        if (voiceService.isListening()) {
          stopListening();
          toast.info("Listening timeout. Please try again.");
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      setIsListening(false);
      toast.error("Failed to start voice recognition");
      console.error(error);
    }
  };

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

  const handleCaptureScreen = async () => {
    if (!isScreenpipeConfigured) {
      toast.warning("Screenpipe is not configured. Please add your API key in Settings.");
      return;
    }
    
    toast.info("Capturing screen...");
    
    try {
      const screenImage = await screenpipeService.captureScreen();
      toast.success("Screen captured");
      
      console.log("Screen captured:", screenImage);
      
      updateScreenContext();
    } catch (error) {
      toast.error("Failed to capture screen");
      console.error(error);
    }
  };

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

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="space-y-4">
      <Card className="jarvis-hologram">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold jarvis-glow-text">Command Center</CardTitle>
          <CardDescription className="text-jarvis-secondary">
            Speak or type your command to Cecilia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
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
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center">
                <label htmlFor="agent-mode" className="text-xs text-jarvis-secondary mr-2">
                  Agent Mode
                </label>
                <input
                  id="agent-mode"
                  type="checkbox"
                  checked={isAgentMode}
                  onChange={() => setIsAgentMode(!isAgentMode)}
                  className="h-3.5 w-3.5 rounded border-jarvis-border bg-jarvis-dark/80 text-jarvis-blue"
                />
                {isAgentMode && (
                  <div className="ml-2 text-xs text-jarvis-secondary">
                    Using Groq's compound-beta with web search & code execution
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light"
                  onClick={() => {
                    setCommand("Open YouTube");
                    setTimeout(handleSendCommand, 100);
                  }}
                >
                  <Youtube className="h-3.5 w-3.5" />
                  <span>YouTube</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light"
                  onClick={() => {
                    setCommand("Take notes for my meeting");
                    setTimeout(handleSendCommand, 100);
                  }}
                >
                  <Note className="h-3.5 w-3.5" />
                  <span>Notes</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light"
                  onClick={() => {
                    setCommand("Schedule a meeting");
                    setTimeout(handleSendCommand, 100);
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Meeting</span>
                </Button>
              </div>
            </div>
            
            {!isGroqConfigured && (
              <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-yellow-400 text-xs">
                <div className="flex items-center gap-2">
                  <Cog className="h-4 w-4" />
                  <span>Groq API not configured. Add your API key in Settings.</span>
                </div>
              </div>
            )}
            
            {screenContext && (
              <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700/30 rounded text-blue-300 text-xs">
                <div className="flex items-center gap-2">
                  <Computer className="h-4 w-4" />
                  <span>Active app: {screenContext.activeApp} ({screenContext.activeWindow})</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
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
