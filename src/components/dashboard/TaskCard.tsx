
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

const TaskCard = ({ 
  title, 
  description, 
  status, 
  priority, 
  createdAt 
}: TaskCardProps) => {
  const statusColors = {
    "pending": "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "failed": "bg-red-100 text-red-800"
  };

  return (
    <Card className={cn("task-card shadow-sm", `priority-${priority}`)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="text-xs text-gray-400">
          Created: {createdAt}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
