
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Bell, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Task Completed",
    message: "Q1 Report email has been sent successfully",
    type: "success",
    timestamp: "Just now",
    read: false
  },
  {
    id: "2",
    title: "System Update",
    message: "New Groq AI model available: Llama 3.3 70B",
    type: "info",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "3",
    title: "Connection Warning",
    message: "Screenpipe agent connection unstable",
    type: "warning",
    timestamp: "5 hours ago",
    read: true
  }
];

export const NotificationsList = () => {
  const [notificationList, setNotificationList] = React.useState(notifications);

  const markAsRead = (id: string) => {
    setNotificationList(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotificationList(notifications.map(notif => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="jarvis-hologram">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold jarvis-glow-text">Notifications</CardTitle>
        <Button variant="outline" onClick={markAllAsRead} className="text-sm">
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationList.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read 
                ? 'bg-jarvis-dark/30 border-jarvis-border/30' 
                : 'bg-jarvis-dark/50 border-jarvis-border'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-jarvis-light">{notification.title}</h4>
                  <span className="text-xs text-jarvis-secondary">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-jarvis-secondary">{notification.message}</p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs"
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
