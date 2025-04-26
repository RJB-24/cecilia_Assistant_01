
import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkflowBuilder from "@/components/workflows/WorkflowBuilder";
import ActionConfigurator from "@/components/workflows/ActionConfigurator";
import VoiceAssistantActivator from "@/components/voice/VoiceAssistantActivator";
import { voiceService } from "@/services/voice/voiceService";

const Workflows = () => {
  useEffect(() => {
    // Welcome message when component mounts
    const welcomeUser = async () => {
      try {
        await voiceService.speakText("Hello sir, I'm online and ready to assist you with workflow automation.");
      } catch (error) {
        console.error("Error speaking welcome message:", error);
      }
    };
    
    // Small delay to ensure everything is loaded
    const timer = setTimeout(welcomeUser, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Workflow Builder
        </h1>
        
        <VoiceAssistantActivator autoActivate={true} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorkflowBuilder />
          </div>
          <div>
            <ActionConfigurator />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Workflows;
