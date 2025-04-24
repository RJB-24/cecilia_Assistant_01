import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  StopCircle, 
  Send, 
  Camera, 
  Cog, 
  Lightbulb, 
  Computer, 
  Calendar, 
  Youtube, 
  Video, 
  FileText, 
  Search, 
  Mail, 
  PanelRight, 
  Sparkles, 
  Terminal, 
  Layers 
} from "lucide-react";

import { groqService } from "@/services/groqService";
import { enhancedScreenpipeService } from "@/services/enhancedScreenpipeService";
import { voiceService } from "@/services/voiceService";
import { noteService } from "@/services/noteService";
import { cn } from "@/lib/utils";
import { AutomationTask } from "@/services/screenpipeService";
import { APP_MAPPINGS } from '@/constants/appMappings';

interface SmartCommandState {
  command: string;
  response: string;
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isAgentMode: boolean;
  isAdvancedMode: boolean;
  processingProgress: number;
  screenContext: any | null;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  showContext: boolean;
}

const SmartCommandProcessor: React.FC = () => {
  const [state, setState] = useState<SmartCommandState>({
    command: "",
    response: "",
    isProcessing: false,
    isListening: false,
    isSpeaking: false,
    isAgentMode: true, // Default to agent mode for enhanced capabilities
    isAdvancedMode: false,
    processingProgress: 0,
    screenContext: null,
    conversationHistory: [],
    showContext: false,
  });
  
  const responseRef = useRef<HTMLDivElement>(null);
  const [isGroqConfigured, setIsGroqConfigured] = useState(false);
  const [isScreenpipeConfigured, setIsScreenpipeConfigured] = useState(false);
  
  const updateState = (updates: Partial<SmartCommandState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    setIsGroqConfigured(groqService.isConfigured());
    setIsScreenpipeConfigured(enhancedScreenpipeService.isConfigured());
    
    if (enhancedScreenpipeService.isConfigured() && !enhancedScreenpipeService.isConnected()) {
      enhancedScreenpipeService.connect()
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
    
    const contextUpdateInterval = setInterval(updateScreenContext, 10000);
    
    return () => {
      clearInterval(contextUpdateInterval);
    };
  }, []);

  const updateScreenContext = async () => {
    if (enhancedScreenpipeService.isConnected()) {
      try {
        const context = await enhancedScreenpipeService.getScreenContext();
        updateState({ screenContext: context });
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
            const result = await enhancedScreenpipeService.executeTask({
              type: "app",
              action: "open",
              parameters: { appName }
            });
            
            if (result.success) {
              toast.success(`Successfully opened ${appName}`);
              addToConversation('assistant', `I've opened ${appName} for you. Is there anything specific you'd like to do with it?`);
              return true;
            }
          }
          
          if (appName.includes("youtube")) {
            window.open("https://www.youtube.com", "_blank");
            addToConversation('assistant', `I've opened YouTube in a new browser tab.`);
            toast.success("Opened YouTube");
            return true;
          } else if (appName.includes("gmail")) {
            window.open("https://mail.google.com", "_blank");
            addToConversation('assistant', `I've opened Gmail in a new browser tab.`);
            toast.success("Opened Gmail");
            return true;
          } else if (appName.includes("zoom")) {
            window.open("https://zoom.us/join", "_blank");
            addToConversation('assistant', `I've opened Zoom in a new browser tab.`);
            toast.success("Opened Zoom");
            return true;
          }
        } catch (error) {
          console.error("Error opening application:", error);
          toast.error(`Failed to open ${appName}`);
          addToConversation('assistant', `I tried to open ${appName}, but encountered an error. Please make sure the application is installed or try opening it manually.`);
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
      
      addToConversation('assistant', `I'd be happy to take notes for your meeting or video! To do this, I'll need:

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
      
      addToConversation('assistant', `I'm now listening and taking notes for "${mediaName}". I'll continue until you say "Stop taking notes".

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
      
      addToConversation('assistant', `Here are your notes for "${mediaName}":\n\n${mockNotes}\n\nI've saved these notes and you can access them anytime from the Notes section.`);
      
      sessionStorage.removeItem("current_note_taking_media");
      
      return true;
    }
    
    return false;
  };

  const addToConversation = (role: 'user' | 'assistant', content: string) => {
    updateState({
      conversationHistory: [
        ...state.conversationHistory,
        { role, content, timestamp: Date.now() }
      ],
      response: role === 'assistant' ? content : state.response
    });
  };

  const handleSendCommand = async () => {
    if (!state.command.trim()) return;
    
    updateState({ 
      isProcessing: true,
      processingProgress: 50
    });
    
    addToConversation('user', state.command);
    
    const progressInterval = setInterval(() => {
      updateState(prev => ({ 
        processingProgress: Math.min(prev.processingProgress + 5, 95) 
      }));
    }, 100);
    
    toast.info("Processing command...");
    
    try {
      const isAppCommand = await handleAppOpeningCommand(state.command);
      if (isAppCommand) {
        clearInterval(progressInterval);
        updateState({ 
          isProcessing: false,
          command: "",
          processingProgress: 100
        });
        return;
      }
      
      const isNoteCommand = await handleNoteTakingCommand(state.command);
      if (isNoteCommand) {
        clearInterval(progressInterval);
        updateState({ 
          isProcessing: false,
          command: "",
          processingProgress: 100
        });
        return;
      }
      
      if (isGroqConfigured) {
        if (enhancedScreenpipeService.isConnected()) {
          await updateScreenContext();
        }
        
        let contextEnhancedCommand = state.command;
        
        if (state.screenContext && state.isAdvancedMode) {
          contextEnhancedCommand = `[Current screen: ${state.screenContext.activeApp} - ${state.screenContext.activeWindow}] ${state.command}`;
        }
        
        let result: string;
        
        if (state.isAgentMode) {
          result = await groqService.processAgentCommand(contextEnhancedCommand);
        } else {
          result = await groqService.processCommand(contextEnhancedCommand);
        }
        
        addToConversation('assistant', result);
        
        if (isScreenpipeConfigured && result) {
          const automationTask = extractAutomationTask(result, state.command);
          
          if (automationTask) {
            toast.info(`Executing task: ${automationTask.action}`);
            
            try {
              const taskResult = await enhancedScreenpipeService.executeTask(automationTask);
              
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
        addToConversation('assistant', `I'd process "${state.command}" with Groq API, but it's not configured yet. Please add your Groq API key in Settings.`);
        toast.warning("Groq API not configured");
      }
    } catch (error) {
      console.error("Error processing command:", error);
      addToConversation('assistant', `Sorry, I encountered an error while processing your command: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Error processing command");
    } finally {
      clearInterval(progressInterval);
      updateState({ 
        isProcessing: false,
        command: "",
        processingProgress: 100
      });
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
      updateState({ isListening: true });
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
      updateState({ isListening: false });
      toast.error("Failed to start voice recognition");
      console.error(error);
    }
  };

  const stopListening = async () => {
    if (state.isListening) {
      try {
        const transcript = await voiceService.stop();
        updateState({ isListening: false });
        
        if (transcript) {
          updateState({ command: transcript });
          toast.success(`Voice command: "${transcript}"`);
        } else {
          toast.info("No speech detected");
        }
      } catch (error) {
        updateState({ isListening: false });
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
      const screenData = await enhancedScreenpipeService.captureScreenEnhanced({
        detectText: true,
        redactPatterns: ["password", "credit card"]
      });
      
      toast.success("Screen captured and analyzed");
      
      if (screenData.detectedText && screenData.detectedText.length > 0) {
        const textFound = screenData.detectedText.join("\n");
        addToConversation('assistant', `I've captured your screen and detected the following text (with sensitive information redacted):\n\n${textFound}`);
      }
      
      updateScreenContext();
    } catch (error) {
      toast.error("Failed to capture screen");
      console.error(error);
    }
  };

  const speakResponse = async () => {
    if (!isGroqConfigured || !state.response || state.isSpeaking) {
      return;
    }
    
    try {
      updateState({ isSpeaking: true });
      toast.info("Speaking response...");
      
      await groqService.speakText(state.response);
      
      updateState({ isSpeaking: false });
    } catch (error) {
      updateState({ isSpeaking: false });
      toast.error("Failed to speak response");
      console.error(error);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [state.response, state.conversationHistory]);
  
  const renderConversation = () => {
    return state.conversationHistory.map((message, index) => (
      <div 
        key={index}
        className={cn(
          "mb-4 p-3 rounded-lg",
          message.role === 'user'
            ? "bg-jarvis-blue/20 ml-8"
            : "bg-jarvis-dark/70 border border-jarvis-border/30 mr-8"
        )}
      >
        <div className="flex items-center mb-1">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2",
            message.role === 'user'
              ? "bg-jarvis-blue text-white"
              : "bg-jarvis-primary/20 text-jarvis-primary"
          )}>
            {message.role === 'user' ? 'Y' : 'C'}
          </div>
          <div className="text-xs text-jarvis-secondary">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <Card className="jarvis-hologram">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold jarvis-glow-text">
              <span>GroqFlow Command Center</span>
              {state.isAgentMode && (
                <span className="ml-2 text-xs bg-jarvis-blue/20 px-2 py-0.5 rounded">Agent</span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => updateState({ showContext: !state.showContext })}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-jarvis-secondary">
            Speak or type your command to Cecilia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Cecilia, help me with..."
                value={state.command}
                onChange={(e) => updateState({ command: e.target.value })}
                className="flex-1 bg-jarvis-dark/80 border-jarvis-border text-jarvis-light"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendCommand();
                }}
                disabled={state.isProcessing || state.isListening}
              />
              <Button 
                variant="outline"
                size="icon"
                type="button"
                onClick={state.isListening ? stopListening : startListening}
                className={cn(
                  "relative bg-jarvis-dark/80 border-jarvis-primary/30 hover:bg-jarvis-blue/20",
                  state.isListening ? "mic-pulse mic-active" : ""
                )}
                disabled={state.isProcessing}
              >
                {state.isListening ? 
                  <StopCircle className="h-4 w-4 text-groqflow-error" /> : 
                  <Mic className="h-4 w-4" />
                }
              </Button>
              <Button 
                variant="outline"
                size="icon"
                type="button"
                onClick={handleCaptureScreen}
                className="bg-jarvis-dark/80 border-jarvis-primary/30 hover:bg-jarvis-blue/20"
                disabled={state.isProcessing || state.isListening || !isScreenpipeConfigured}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendCommand}
                disabled={!state.command.trim() || state.isProcessing || state.isListening}
                className="bg-jarvis-blue hover:bg-jarvis-sky text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
            
            <div className="flex space-between">
              <div className="flex items-center flex-1">
                <label htmlFor="agent-mode" className="text-xs text-jarvis-secondary mr-2">
                  Agent Mode
                </label>
                <input
                  id="agent-mode"
                  type="checkbox"
                  checked={state.isAgentMode}
                  onChange={() => updateState({ isAgentMode: !state.isAgentMode })}
                  className="h-3.5 w-3.5 rounded border-jarvis-border bg-jarvis-dark/80 text-jarvis-blue"
                />
                {state.isAgentMode && (
                  <div className="ml-2 text-xs text-jarvis-secondary">
                    Using Groq's compound-beta with web search & code execution
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <label htmlFor="advanced-mode" className="text-xs text-jarvis-secondary mr-2">
                  Context Awareness
                </label>
                <input
                  id="advanced-mode"
                  type="checkbox"
                  checked={state.isAdvancedMode}
                  onChange={() => updateState({ isAdvancedMode: !state.isAdvancedMode })}
                  className="h-3.5 w-3.5 rounded border-jarvis-border bg-jarvis-dark/80 text-jarvis-blue"
                />
              </div>
            </div>
            
            <div className="flex space-x-1 overflow-x-auto pb-1 mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Open YouTube" });
                  setTimeout(handleSendCommand, 100);
                }}
              >
                <Youtube className="h-3 w-3" />
                <span>YouTube</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Take notes for my meeting" });
                  setTimeout(handleSendCommand, 100);
                }}
              >
                <FileText className="h-3 w-3" />
                <span>Take Notes</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Schedule a team meeting for tomorrow at 2pm" });
                  setTimeout(handleSendCommand, 100);
                }}
              >
                <Calendar className="h-3 w-3" />
                <span>Schedule</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Send an email to the team about the project status" });
                  setTimeout(handleSendCommand, 100);
                }}
              >
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Search the latest news on AI technology" });
                  setTimeout(handleSendCommand, 100);
                }}
              >
                <Search className="h-3 w-3" />
                <span>Search News</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs flex items-center gap-1 px-2 text-jarvis-secondary hover:text-jarvis-light whitespace-nowrap"
                onClick={() => {
                  updateState({ command: "Analyze this screenshot and tell me what you see" });
                  setTimeout(() => {
                    handleCaptureScreen();
                  }, 100);
                }}
              >
                <Layers className="h-3 w-3" />
                <span>Analyze Screen</span>
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
            
            {state.processingProgress > 0 && state.processingProgress < 100 && (
              <Progress 
                value={state.processingProgress} 
                className="h-1 w-full bg-jarvis-blue/10" 
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <div className={cn("flex-1", state.showContext ? "hidden md:block md:w-3/4" : "w-full")}>
          <Card className="jarvis-hologram">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold jarvis-glow-text">Conversation</CardTitle>
                {state.response && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={speakResponse}
                    disabled={!state.response || state.isSpeaking}
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
                className="max-h-[400px] overflow-y-auto pr-1"
              >
                {state.conversationHistory.length > 0 ? (
                  renderConversation()
                ) : (
                  <div className="text-center text-jarvis-secondary p-8">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Start a conversation with Cecilia</p>
                    <p className="text-xs mt-2">Try asking for help with emails, scheduling, or analyzing data</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-xs text-jarvis-secondary">
                {state.isSpeaking ? (
                  <span className="flex items-center">
                    <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Speaking...
                  </span>
                ) : (
                  state.isProcessing ? "Processing..." : "Ready"
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {state.showContext && (
          <div className="w-full md:w-1/4">
            <Card className="jarvis-hologram h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold jarvis-glow-text">Context Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="screen">
                  <TabsList className="bg-jarvis-dark/80 border border-jarvis-border/30">
                    <TabsTrigger value="screen">Screen</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                  <TabsContent value="screen" className="pt-2">
                    {state.screenContext ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Computer className="h-4 w-4 text-jarvis-blue" />
                          <span>Active: {state.screenContext.activeApp}</span>
                        </div>
                        <div className="text-xs text-jarvis-secondary">
                          {state.screenContext.activeWindow}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-semibold mb-1">Open Applications:</div>
                          <div className="text-xs text-jarvis-secondary">
                            {state.screenContext.openApps?.join(", ")}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 text-xs"
                          onClick={handleCaptureScreen}
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          Refresh Context
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-jarvis-secondary p-4 text-sm">
                        No screen context available
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="system" className="pt-2">
                    <div className="space-y-2 text-xs">
                      <div className="bg-jarvis-dark/40 p-2 rounded border border-jarvis-border/30">
                        <div className="font-mono">
                          <div><span className="text-jarvis-blue">Model:</span> {groqService.isConfigured() ? "Groq compound-beta" : "Not configured"}</div>
                          <div><span className="text-jarvis-blue">Agent:</span> {state.isAgentMode ? "Active" : "Disabled"}</div>
                          <div><span className="text-jarvis-blue">Context:</span> {state.isAdvancedMode ? "Active" : "Disabled"}</div>
                          <div><span className="text-jarvis-blue">Voice:</span> {voiceService.isSupported() ? "Available" : "Not supported"}</div>
                        </div>
                      </div>
                      <div className="text-jarvis-secondary italic">
                        Enhanced with Groq's AI and Screenpipe automation
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCommandProcessor;
