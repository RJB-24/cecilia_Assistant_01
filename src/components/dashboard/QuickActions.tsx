
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MicIcon, 
  CameraIcon, 
  ListOrderedIcon, 
  StopCircleIcon,
  PlusIcon
} from "lucide-react";
import { toast } from "sonner";

const QuickActions = () => {
  const handleAction = (action: string) => {
    toast.info(`${action} action triggered`);
  };
  
  return (
    <Card className="jarvis-hologram">
      <CardHeader>
        <CardTitle className="text-xl font-bold jarvis-glow-text">Quick Actions</CardTitle>
        <CardDescription className="text-jarvis-secondary">
          Frequently used commands and tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => handleAction("Voice Command")} 
            className="bg-jarvis-dark/80 border border-jarvis-primary/30 hover:bg-jarvis-blue/20 flex flex-col items-center py-6 h-auto"
          >
            <MicIcon className="h-8 w-8 mb-2 jarvis-glow-text" />
            <span>Voice Command</span>
          </Button>
          
          <Button 
            onClick={() => handleAction("Screen Capture")} 
            className="bg-jarvis-dark/80 border border-jarvis-primary/30 hover:bg-jarvis-blue/20 flex flex-col items-center py-6 h-auto"
          >
            <CameraIcon className="h-8 w-8 mb-2 jarvis-glow-text" />
            <span>Screen Capture</span>
          </Button>
          
          <Button 
            onClick={() => handleAction("Task Template")} 
            className="bg-jarvis-dark/80 border border-jarvis-primary/30 hover:bg-jarvis-blue/20 flex flex-col items-center py-6 h-auto"
          >
            <ListOrderedIcon className="h-8 w-8 mb-2 jarvis-glow-text" />
            <span>Task Template</span>
          </Button>
          
          <Button 
            onClick={() => handleAction("Create Task")} 
            className="bg-jarvis-dark/80 border border-jarvis-primary/30 hover:bg-jarvis-blue/20 flex flex-col items-center py-6 h-auto"
          >
            <PlusIcon className="h-8 w-8 mb-2 jarvis-glow-text" />
            <span>Create Task</span>
          </Button>
          
          <Button 
            onClick={() => handleAction("Emergency Stop")} 
            variant="destructive"
            className="flex flex-col items-center py-6 h-auto col-span-1 md:col-span-2"
          >
            <StopCircleIcon className="h-8 w-8 mb-2" />
            <span>Emergency Stop</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
