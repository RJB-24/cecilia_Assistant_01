
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, LayoutGridIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

const WorkflowBuilder = () => {
  const handleCreateWorkflow = () => {
    toast.info("Workflow builder coming soon...");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Visual Workflow Editor</CardTitle>
            <CardDescription>
              Build automated workflows with drag-and-drop nodes
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-jarvis-dark/80 border-jarvis-primary/20"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handleCreateWorkflow}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[400px] border border-dashed border-jarvis-border rounded-lg">
          <div className="text-center">
            <LayoutGridIcon className="h-16 w-16 mx-auto text-jarvis-secondary opacity-40" />
            <p className="mt-4 text-jarvis-secondary">
              Click "New Workflow" to start building your automation
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowBuilder;
