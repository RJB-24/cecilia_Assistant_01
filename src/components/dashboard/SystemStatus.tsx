
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckIcon, XIcon, AlertTriangleIcon } from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  status: "good" | "warning" | "error";
  unit?: string;
}

const SystemStatus = () => {
  const metrics: SystemMetric[] = [
    { 
      name: "Task Completion Rate", 
      value: 92, 
      status: "good", 
      unit: "%" 
    },
    { 
      name: "Average Processing Time", 
      value: 1.2, 
      status: "good", 
      unit: "s" 
    },
    { 
      name: "Error Rate", 
      value: 3, 
      status: "warning", 
      unit: "%" 
    },
    { 
      name: "Resource Utilization", 
      value: 65, 
      status: "good", 
      unit: "%" 
    }
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckIcon className="h-4 w-4 text-groqflow-success" />;
      case "warning":
        return <AlertTriangleIcon className="h-4 w-4 text-groqflow-warning" />;
      case "error":
        return <XIcon className="h-4 w-4 text-groqflow-error" />;
      default:
        return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-groqflow-success";
      case "warning":
        return "bg-groqflow-warning";
      case "error":
        return "bg-groqflow-error";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">System Status</CardTitle>
        <CardDescription>
          Current performance metrics and resource usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {statusIcon(metric.status)}
                  <span className="text-sm font-medium ml-2">{metric.name}</span>
                </div>
                <span className="text-sm font-bold">
                  {metric.value}{metric.unit}
                </span>
              </div>
              <Progress 
                value={metric.name.includes("Time") ? (metric.value / 3) * 100 : metric.value} 
                className={statusColor(metric.status)} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
