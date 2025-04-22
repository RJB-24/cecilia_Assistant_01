
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellIcon, InfoIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import NotificationItem from "@/components/notifications/NotificationItem";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Task Completed",
      message: "Weekly analytics report generated and emailed to team",
      time: "Just now",
    },
    {
      id: 2,
      type: "warning",
      title: "System Warning",
      message: "Groq API usage at 80% of monthly quota",
      time: "5 minutes ago",
    },
    {
      id: 3,
      type: "error",
      title: "Error Detected",
      message: "Failed to connect to calendar service",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "info",
      title: "New Update Available",
      message: "Cecilia v2.1 is now available with enhanced voice recognition",
      time: "Yesterday",
    },
  ];

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(note => note.type === activeTab);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Notification Center
        </h1>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <span className="text-sm text-jarvis-secondary">
                {notifications.length} notifications
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="flex gap-2">
                  <BellIcon className="h-4 w-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="info" className="flex gap-2">
                  <InfoIcon className="h-4 w-4" />
                  <span>Info</span>
                </TabsTrigger>
                <TabsTrigger value="success" className="flex gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Success</span>
                </TabsTrigger>
                <TabsTrigger value="warning" className="flex gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Warnings</span>
                </TabsTrigger>
                <TabsTrigger value="error" className="flex gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Errors</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        type={notification.type as "info" | "success" | "warning" | "error"}
                        title={notification.title}
                        message={notification.message}
                        time={notification.time}
                      />
                    ))
                  ) : (
                    <p className="text-center py-8 text-jarvis-secondary">No notifications to display</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Notifications;
