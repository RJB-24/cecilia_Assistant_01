import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { groqService } from "@/services/groqService";
import { screenpipeService } from "@/services/screenpipeService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, AlertTriangle, SettingsIcon, Save, Computer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  // Groq settings
  const [groqApiKey, setGroqApiKey] = useState<string>(localStorage.getItem("GROQ_API_KEY") || "");
  const [groqModel, setGroqModel] = useState<string>(localStorage.getItem("GROQ_MODEL") || "llama-3.3-70b-versatile");
  const [ttsVoice, setTtsVoice] = useState<string>(localStorage.getItem("GROQ_TTS_VOICE") || "Fritz-PlayAI");
  
  // Screenpipe settings
  const [isAgentInstalled, setIsAgentInstalled] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  // General settings
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(localStorage.getItem("VOICE_ENABLED") !== "false");
  const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem("DARK_MODE") === "true");
  
  // Check if Screenpipe agent is installed on mount
  useEffect(() => {
    checkScreenpipeAgent();
  }, []);
  
  const saveGroqSettings = () => {
    if (!groqApiKey) {
      toast.error("Please enter a valid Groq API key");
      return;
    }
    
    try {
      // Save to local storage
      localStorage.setItem("GROQ_API_KEY", groqApiKey);
      localStorage.setItem("GROQ_MODEL", groqModel);
      localStorage.setItem("GROQ_TTS_VOICE", ttsVoice);
      
      // Update service configuration
      groqService.setApiKey(groqApiKey);
      groqService.setModel(groqModel);
      
      toast.success("Groq settings saved successfully");
    } catch (error) {
      console.error("Error saving Groq settings:", error);
      toast.error("Failed to save Groq settings");
    }
  };
  
  const saveGeneralSettings = () => {
    try {
      localStorage.setItem("VOICE_ENABLED", voiceEnabled.toString());
      localStorage.setItem("DARK_MODE", darkMode.toString());
      
      // Apply dark mode
      document.documentElement.classList.toggle("dark", darkMode);
      
      toast.success("General settings saved successfully");
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast.error("Failed to save general settings");
    }
  };
  
  const checkScreenpipeAgent = async () => {
    setIsChecking(true);
    
    try {
      const isInstalled = await screenpipeService.checkAgentInstalled();
      setIsAgentInstalled(isInstalled);
      
      if (!isInstalled) {
        toast.warning("Screenpipe Terminator agent is not installed or running");
      } else {
        toast.success("Screenpipe Terminator agent is installed");
      }
    } catch (error) {
      console.error("Error checking Screenpipe agent:", error);
      toast.error("Failed to check Screenpipe agent status");
    } finally {
      setIsChecking(false);
    }
  };
  
  const connectToScreenpipe = async () => {
    setIsConnecting(true);
    
    try {
      const connected = await screenpipeService.connect();
      
      if (connected) {
        toast.success("Connected to Screenpipe Terminator agent");
        setIsAgentInstalled(true);
      } else {
        toast.error("Failed to connect to Screenpipe Terminator agent");
      }
    } catch (error) {
      console.error("Error connecting to Screenpipe:", error);
      toast.error("Failed to connect to Screenpipe Terminator agent");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Settings
        </h1>
        
        <Tabs defaultValue="groq" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="groq" className="data-[state=active]:jarvis-glow-text">
              Groq AI
            </TabsTrigger>
            <TabsTrigger value="screenpipe" className="data-[state=active]:jarvis-glow-text">
              Screenpipe Terminator
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:jarvis-glow-text">
              General
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="groq">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">Groq AI Configuration</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Configure your Groq AI API key and model settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="groqApiKey">Groq API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="groqApiKey"
                      type="password"
                      placeholder="Enter your Groq API key"
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                      className="flex-1 bg-jarvis-dark/30 border-jarvis-border"
                    />
                  </div>
                  <p className="text-xs text-jarvis-secondary mt-1">
                    Get your API key from <a href="https://console.groq.com/" target="_blank" className="underline">Groq Console</a>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="groqModel">Default Chat Model</Label>
                  <Select value={groqModel} onValueChange={setGroqModel}>
                    <SelectTrigger id="groqModel" className="bg-jarvis-dark/30 border-jarvis-border">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B</SelectItem>
                      <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B (Faster)</SelectItem>
                      <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                      <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
                      <SelectItem value="compound-beta">Compound Beta (Agent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ttsVoice">Text-to-Speech Voice</Label>
                  <Select value={ttsVoice} onValueChange={setTtsVoice}>
                    <SelectTrigger id="ttsVoice" className="bg-jarvis-dark/30 border-jarvis-border">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fritz-PlayAI">Fritz (Default)</SelectItem>
                      <SelectItem value="Arista-PlayAI">Arista</SelectItem>
                      <SelectItem value="Calum-PlayAI">Calum</SelectItem>
                      <SelectItem value="Celeste-PlayAI">Celeste</SelectItem>
                      <SelectItem value="Gail-PlayAI">Gail</SelectItem>
                      <SelectItem value="Quinn-PlayAI">Quinn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={saveGroqSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Groq Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="screenpipe">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">Screenpipe Terminator</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Configure Screenpipe Terminator for desktop automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-jarvis-dark/60 rounded-lg p-4 border border-jarvis-border">
                  <div className="flex items-center space-x-3">
                    <Computer className="h-6 w-6" />
                    <div>
                      <h3 className="text-lg font-semibold">Screenpipe Terminator Agent</h3>
                      <p className="text-jarvis-secondary text-sm">
                        Screenpipe does not require an API key. Instead, it uses a local agent installed on your computer.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 rounded-md border border-yellow-500/30 bg-yellow-900/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-300 font-medium">Installation Required</h4>
                        <p className="text-yellow-200/80 text-sm mt-1">
                          To use desktop automation features, you need to download and install the Screenpipe Terminator agent on your computer.
                        </p>
                        <div className="mt-3">
                          <a 
                            href="https://docs.screenpi.pe/terminator/getting-started" 
                            target="_blank" 
                            className="text-sm bg-yellow-600 hover:bg-yellow-500 text-white py-1.5 px-3 rounded-md inline-flex items-center"
                          >
                            Download Agent
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <Button 
                    onClick={checkScreenpipeAgent} 
                    disabled={isChecking}
                    variant="secondary"
                    className="w-full"
                  >
                    {isChecking ? "Checking..." : "Check Agent Status"}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${isAgentInstalled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">
                      {isAgentInstalled ? "Agent is installed and running" : "Agent not detected"}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={connectToScreenpipe} 
                    disabled={isConnecting || isAgentInstalled}
                    className="w-full"
                  >
                    {isConnecting ? "Connecting..." : isAgentInstalled ? "Connected" : "Connect to Agent"}
                  </Button>
                </div>
                
                <Separator className="bg-jarvis-border/30" />
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Documentation Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://docs.screenpi.pe/terminator/getting-started" 
                        target="_blank" 
                        className="text-jarvis-secondary underline hover:text-jarvis-light"
                      >
                        Terminator Getting Started Guide
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://docs.screenpi.pe/terminator/js-sdk-reference" 
                        target="_blank" 
                        className="text-jarvis-secondary underline hover:text-jarvis-light"
                      >
                        JavaScript SDK Reference
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">General Settings</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Configure general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voiceEnabled">Voice Interaction</Label>
                      <p className="text-xs text-jarvis-secondary">
                        Enable or disable voice commands and responses
                      </p>
                    </div>
                    <Switch 
                      id="voiceEnabled" 
                      checked={voiceEnabled}
                      onCheckedChange={setVoiceEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-xs text-jarvis-secondary">
                        Enable or disable dark mode
                      </p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
                
                <Button onClick={saveGeneralSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
