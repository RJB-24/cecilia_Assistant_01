
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CommandInput from "@/components/dashboard/CommandInput";
import TaskCard from "@/components/dashboard/TaskCard";
import SystemStatus from "@/components/dashboard/SystemStatus";
import QuickActions from "@/components/dashboard/QuickActions";
import RealTimeDataPanel from "@/components/dashboard/RealTimeDataPanel";
import VoiceAssistantActivator from "@/components/voice/VoiceAssistantActivator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Lab = () => {
  // Sample task data
  const tasks = [
    {
      title: "Draft Q1 Report Email",
      description: "Create and send Q1 performance report to the leadership team",
      status: "in-progress" as const,
      priority: "high" as const,
      createdAt: "Today, 10:30 AM"
    },
    {
      title: "Schedule Social Media Posts",
      description: "Prepare and schedule weekly social media content",
      status: "pending" as const,
      priority: "medium" as const,
      createdAt: "Yesterday, 3:45 PM"
    },
    {
      title: "Update Contact Database",
      description: "Sync new contacts from CRM to email marketing platform",
      status: "completed" as const,
      priority: "low" as const,
      createdAt: "Apr 21, 2025"
    },
    {
      title: "Generate Monthly Analytics",
      description: "Compile and format monthly analytics report",
      status: "failed" as const,
      priority: "high" as const,
      createdAt: "Apr 20, 2025"
    }
  ];

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
            CECILIA Lab - Development Dashboard
          </h1>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="bg-jarvis-blue/20 border-jarvis-primary text-jarvis-light hover:bg-jarvis-blue/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assistant
          </Button>
        </div>

        <VoiceAssistantActivator autoActivate={false} />
        
        <CommandInput />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <Card className="jarvis-hologram">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {tasks.map((task, index) => (
                    <TaskCard key={index} {...task} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <SystemStatus />
          </div>
          
          <div className="lg:col-span-1">
            <RealTimeDataPanel />
          </div>
        </div>
        
        <QuickActions />
      </div>
    </MainLayout>
  );
};

export default Lab;
