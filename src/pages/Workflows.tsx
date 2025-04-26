
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkflowBuilder from "@/components/workflows/WorkflowBuilder";
import ActionConfigurator from "@/components/workflows/ActionConfigurator";
import VoiceAssistantActivator from "@/components/voice/VoiceAssistantActivator";

const Workflows = () => {
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
