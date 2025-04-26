
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon, LayoutGridIcon, SaveIcon, PlayIcon, Trash2Icon, ClockIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { workflowService, Workflow, WorkflowStep } from "@/services/workflowService";
import { APP_MAPPINGS } from "@/constants/appMappings";

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [isAddStepDialogOpen, setIsAddStepDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState<"daily" | "weekly" | "monthly" | "once">("daily");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  
  useEffect(() => {
    // Load workflows
    const loadedWorkflows = workflowService.getAllWorkflows();
    setWorkflows(loadedWorkflows);
    
    // Check if there's an active workflow
    const active = workflowService.getActiveWorkflow();
    if (active) {
      setActiveWorkflow(active);
    }
  }, []);
  
  useEffect(() => {
    // Update available actions when app changes
    if (selectedApp) {
      setAvailableActions(workflowService.getAvailableActions(selectedApp));
      setSelectedAction(""); // Reset selected action
    } else {
      setAvailableActions([]);
    }
  }, [selectedApp]);

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }
    
    const workflow = workflowService.createWorkflow(newWorkflowName);
    setWorkflows([...workflows, workflow]);
    setActiveWorkflow(workflow);
    setNewWorkflowName("");
    setIsNewWorkflowDialogOpen(false);
    toast.success(`Workflow "${workflow.name}" created`);
  };
  
  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      workflowService.deleteWorkflow(workflowId);
      setWorkflows(workflowService.getAllWorkflows());
      if (activeWorkflow && activeWorkflow.id === workflowId) {
        setActiveWorkflow(null);
      }
      toast.info("Workflow deleted");
    }
  };
  
  const handleAddStep = () => {
    if (!activeWorkflow) {
      toast.error("No active workflow selected");
      return;
    }
    
    if (!selectedApp || !selectedAction) {
      toast.error("Please select an application and action");
      return;
    }
    
    const step = workflowService.addStep(activeWorkflow.id, selectedApp, selectedAction);
    if (step) {
      setActiveWorkflow({ ...activeWorkflow, steps: [...activeWorkflow.steps, step] });
      setIsAddStepDialogOpen(false);
      setSelectedApp("");
      setSelectedAction("");
      toast.success("Step added to workflow");
    } else {
      toast.error("Failed to add step");
    }
  };
  
  const handleRemoveStep = (stepId: string) => {
    if (!activeWorkflow) return;
    
    if (workflowService.removeStep(activeWorkflow.id, stepId)) {
      const updatedWorkflow = workflowService.getWorkflow(activeWorkflow.id);
      setActiveWorkflow(updatedWorkflow || null);
      toast.info("Step removed");
    }
  };
  
  const handleSetSchedule = () => {
    if (!activeWorkflow) return;
    
    if (workflowService.setWorkflowSchedule(activeWorkflow.id, {
      type: scheduleType,
      time: scheduleTime
    })) {
      const updatedWorkflow = workflowService.getWorkflow(activeWorkflow.id);
      setActiveWorkflow(updatedWorkflow || null);
      setIsScheduleDialogOpen(false);
      toast.success("Schedule set");
    } else {
      toast.error("Failed to set schedule");
    }
  };
  
  const handleToggleActive = () => {
    if (!activeWorkflow) return;
    
    const isActive = workflowService.toggleWorkflowActive(activeWorkflow.id);
    setActiveWorkflow({ ...activeWorkflow, isActive });
  };
  
  const handleExecuteWorkflow = async () => {
    if (!activeWorkflow) return;
    
    toast.info(`Executing workflow: ${activeWorkflow.name}`);
    try {
      await workflowService.executeWorkflow(activeWorkflow.id);
      const updated = workflowService.getWorkflow(activeWorkflow.id);
      if (updated) {
        setActiveWorkflow(updated);
      }
    } catch (error) {
      toast.error(`Failed to execute workflow: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const renderStepsList = () => {
    if (!activeWorkflow || activeWorkflow.steps.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-jarvis-secondary">No steps added yet</p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2"
            onClick={() => setIsAddStepDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Step
          </Button>
        </div>
      );
    }
    
    return activeWorkflow.steps.map((step, index) => (
      <div key={step.id} className="flex items-center p-2 border-b border-jarvis-border/20 last:border-0">
        <div className="w-6 h-6 bg-jarvis-blue/20 rounded-full flex items-center justify-center mr-3">
          <span className="text-xs text-jarvis-blue">{index + 1}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{step.appName}</p>
          <p className="text-xs text-jarvis-secondary">{step.action}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7"
          onClick={() => handleRemoveStep(step.id)}
        >
          <Trash2Icon className="h-4 w-4 text-jarvis-secondary hover:text-jarvis-error" />
        </Button>
      </div>
    ));
  };
  
  const getAppOptions = () => {
    return Object.entries(APP_MAPPINGS).map(([key, app]) => (
      <SelectItem key={key} value={key}>{app.name}</SelectItem>
    ));
  };
  
  const getActionOptions = () => {
    return availableActions.map(action => (
      <SelectItem key={action} value={action}>
        {action.replace('_', ' ')}
      </SelectItem>
    ));
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
            {activeWorkflow && (
              <>
                <Button 
                  variant={activeWorkflow.isActive ? "default" : "outline"}
                  size="sm" 
                  className={activeWorkflow.isActive ? "bg-green-600 hover:bg-green-700" : "bg-jarvis-dark/80 border-jarvis-primary/20"}
                  onClick={handleToggleActive}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {activeWorkflow.isActive ? "Active" : "Activate"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-jarvis-dark/80 border-jarvis-primary/20"
                  onClick={() => setIsScheduleDialogOpen(true)}
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-jarvis-dark/80 border-jarvis-primary/20"
                  onClick={handleExecuteWorkflow}
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Run
                </Button>
              </>
            )}
            <Button size="sm" onClick={() => setIsNewWorkflowDialogOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {workflows.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] border border-dashed border-jarvis-border rounded-lg">
            <div className="text-center">
              <LayoutGridIcon className="h-16 w-16 mx-auto text-jarvis-secondary opacity-40" />
              <p className="mt-4 text-jarvis-secondary">
                Create your first workflow to automate tasks
              </p>
              <Button className="mt-4" onClick={() => setIsNewWorkflowDialogOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </div>
        ) : !activeWorkflow ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Select a workflow:</h3>
            {workflows.map(workflow => (
              <div 
                key={workflow.id} 
                className="p-3 border border-jarvis-border/20 rounded-lg cursor-pointer hover:bg-jarvis-blue/10 flex justify-between items-center"
                onClick={() => {
                  workflowService.setActiveWorkflow(workflow.id);
                  setActiveWorkflow(workflow);
                }}
              >
                <div>
                  <p className="font-medium">{workflow.name}</p>
                  <p className="text-xs text-jarvis-secondary">
                    {workflow.steps.length} {workflow.steps.length === 1 ? 'step' : 'steps'} •
                    {workflow.isActive ? ' Active' : ' Inactive'}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkflow(workflow.id);
                  }}
                >
                  <Trash2Icon className="h-4 w-4 text-jarvis-secondary hover:text-jarvis-error" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {activeWorkflow.name}
                {activeWorkflow.schedule && (
                  <span className="ml-2 text-xs bg-jarvis-blue/20 px-2 py-0.5 rounded">
                    {activeWorkflow.schedule.type} • {activeWorkflow.schedule.time}
                  </span>
                )}
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-jarvis-dark/80 border-jarvis-primary/20"
                onClick={() => {
                  workflowService.setActiveWorkflow(null);
                  setActiveWorkflow(null);
                }}
              >
                Back to List
              </Button>
            </div>
            
            <div className="border border-jarvis-border/20 rounded-lg overflow-hidden">
              <div className="bg-jarvis-dark/30 px-4 py-2 border-b border-jarvis-border/20 flex justify-between items-center">
                <h4 className="text-sm font-medium">Workflow Steps</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => setIsAddStepDialogOpen(true)}
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {renderStepsList()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* New Workflow Dialog */}
      <Dialog open={isNewWorkflowDialogOpen} onOpenChange={setIsNewWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Give your workflow a descriptive name to get started
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Workflow name"
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewWorkflowDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Step Dialog */}
      <Dialog open={isAddStepDialogOpen} onOpenChange={setIsAddStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Workflow Step</DialogTitle>
            <DialogDescription>
              Select an application and action to automate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="app" className="text-sm font-medium">Application</label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger id="app">
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {getAppOptions()}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="action" className="text-sm font-medium">Action</label>
              <Select 
                value={selectedAction} 
                onValueChange={setSelectedAction}
                disabled={!selectedApp}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {getActionOptions()}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStepDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStep}>Add Step</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Workflow Schedule</DialogTitle>
            <DialogDescription>
              Configure when this workflow should run automatically
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="scheduleType" className="text-sm font-medium">Frequency</label>
              <Select 
                value={scheduleType} 
                onValueChange={(value) => setScheduleType(value as any)}
              >
                <SelectTrigger id="scheduleType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="once">Once</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="scheduleTime" className="text-sm font-medium">Time</label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSetSchedule}>Set Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkflowBuilder;
