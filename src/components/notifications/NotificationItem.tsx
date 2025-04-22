
import React from "react";
import { 
  InfoIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  XCircleIcon,
  XIcon,
  ArrowRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  time: string;
}

const NotificationItem = ({ type, title, message, time }: NotificationItemProps) => {
  const getIcon = () => {
    switch (type) {
      case "info": 
        return <InfoIcon className="h-5 w-5 text-jarvis-blue" />;
      case "success": 
        return <CheckCircleIcon className="h-5 w-5 text-groqflow-success" />;
      case "warning": 
        return <AlertTriangleIcon className="h-5 w-5 text-groqflow-warning" />;
      case "error": 
        return <XCircleIcon className="h-5 w-5 text-groqflow-error" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "info": 
        return "border-l-jarvis-blue";
      case "success": 
        return "border-l-groqflow-success";
      case "warning": 
        return "border-l-groqflow-warning";
      case "error": 
        return "border-l-groqflow-error";
    }
  };

  return (
    <div className={cn(
      "bg-jarvis-dark/80 border border-jarvis-border rounded-md p-4 relative border-l-4",
      getBorderColor()
    )}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-jarvis-primary">{title}</h4>
            <span className="text-xs text-jarvis-secondary">{time}</span>
          </div>
          <p className="text-sm text-jarvis-secondary mt-1">{message}</p>
          <div className="flex justify-end mt-2 space-x-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <ArrowRightIcon className="h-3 w-3 mr-1" />
              Details
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <XIcon className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
