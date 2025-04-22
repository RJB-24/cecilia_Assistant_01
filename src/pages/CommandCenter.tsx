
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CommandProcessor from "@/components/command/CommandProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MicrophoneIcon, BotIcon, ComputerIcon, ClipboardListIcon } from "lucide-react";

const CommandCenter = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Cecilia Command Center
        </h1>
        
        <Tabs defaultValue="command" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="command" className="data-[state=active]:jarvis-glow-text">
              <MicrophoneIcon className="h-4 w-4 mr-2" />
              Commands
            </TabsTrigger>
            <TabsTrigger value="assistant" className="data-[state=active]:jarvis-glow-text">
              <BotIcon className="h-4 w-4 mr-2" />
              Assistant
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:jarvis-glow-text">
              <ComputerIcon className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:jarvis-glow-text">
              <ClipboardListIcon className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="command">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CommandProcessor />
              </div>
              <div>
                <Card className="jarvis-hologram">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold jarvis-glow-text">Command Examples</CardTitle>
                    <CardDescription className="text-jarvis-secondary">
                      Try these commands with Cecilia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-jarvis-light">Voice Commands</h3>
                      <div className="bg-jarvis-dark/70 border border-jarvis-border/30 rounded-md p-3">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                const example = "Email the Q1 report to the CFO and highlight key metrics";
                                navigator.clipboard.writeText(example);
                              }}
                            >
                              Copy
                            </Button>
                            <span className="ml-2 text-jarvis-light">Email the Q1 report to the CFO and highlight key metrics</span>
                          </li>
                          <li className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                const example = "Schedule a meeting with the marketing team for tomorrow at 10 AM";
                                navigator.clipboard.writeText(example);
                              }}
                            >
                              Copy
                            </Button>
                            <span className="ml-2 text-jarvis-light">Schedule a meeting with the marketing team for tomorrow at 10 AM</span>
                          </li>
                          <li className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                const example = "Analyze this CSV and send insights to the team";
                                navigator.clipboard.writeText(example);
                              }}
                            >
                              Copy
                            </Button>
                            <span className="ml-2 text-jarvis-light">Analyze this CSV and send insights to the team</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-jarvis-light">Cross-App Automation</h3>
                      <div className="bg-jarvis-dark/70 border border-jarvis-border/30 rounded-md p-3">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                const example = "Post to LinkedIn with this image at 5 PM";
                                navigator.clipboard.writeText(example);
                              }}
                            >
                              Copy
                            </Button>
                            <span className="ml-2 text-jarvis-light">Post to LinkedIn with this image at 5 PM</span>
                          </li>
                          <li className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                const example = "Open Gmail and compose a new email to the marketing team";
                                navigator.clipboard.writeText(example);
                              }}
                            >
                              Copy
                            </Button>
                            <span className="ml-2 text-jarvis-light">Open Gmail and compose a new email to the marketing team</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assistant">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">AI Assistant</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Ask Cecilia for help with tasks, information, or brainstorming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-jarvis-light">The AI Assistant features will be available soon. Here you'll be able to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-jarvis-secondary">
                  <li>Get detailed responses to complex questions</li>
                  <li>Brainstorm ideas with AI assistance</li>
                  <li>Draft emails, reports, and other documents</li>
                  <li>Get recommendations based on your work patterns</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="automation">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">Desktop Automation</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Control your desktop applications with Cecilia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-jarvis-light">Desktop automation features will be available soon. Here you'll be able to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-jarvis-secondary">
                  <li>Control your browser and other applications</li>
                  <li>Automate repetitive tasks across applications</li>
                  <li>Schedule automated workflows</li>
                  <li>Monitor application state and recover from errors</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">Command History</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  View your past interactions with Cecilia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-jarvis-light">Command history features will be available soon. Here you'll be able to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-jarvis-secondary">
                  <li>Review past commands and responses</li>
                  <li>Replay successful commands</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Export history for reporting or backup</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CommandCenter;
