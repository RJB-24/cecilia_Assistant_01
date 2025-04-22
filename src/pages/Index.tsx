
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CommandInput from "@/components/dashboard/CommandInput";
import TaskCard from "@/components/dashboard/TaskCard";
import SystemStatus from "@/components/dashboard/SystemStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
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
        <CommandInput />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task, index) => (
                    <TaskCard key={index} {...task} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <SystemStatus />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
