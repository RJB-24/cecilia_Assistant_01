
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { workflowService, WorkflowStep } from "@/services/workflowService";

const ActionConfigurator = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(workflowService.getActiveWorkflow());
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [parameterFields, setParameterFields] = useState<string[]>([]);
  
  useEffect(() => {
    // Subscribe to workflow changes
    const intervalId = setInterval(() => {
      const currentWorkflow = workflowService.getActiveWorkflow();
      if (currentWorkflow?.id !== activeWorkflow?.id) {
        setActiveWorkflow(currentWorkflow);
        setSelectedStepId(null);
        setSelectedStep(null);
        setParameters({});
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [activeWorkflow]);
  
  useEffect(() => {
    if (!activeWorkflow || !selectedStepId) {
      setSelectedStep(null);
      return;
    }
    
    const step = activeWorkflow.steps.find(s => s.id === selectedStepId);
    setSelectedStep(step || null);
    
    if (step) {
      // Get parameter fields for this action
      const fields = workflowService.getAvailableParameters(step.action);
      setParameterFields(fields);
      
      // Initialize parameters with existing values
      const initialParams: Record<string, string> = {};
      fields.forEach(field => {
        initialParams[field] = (step.parameters[field] || '') as string;
      });
      setParameters(initialParams);
    } else {
      setParameterFields([]);
      setParameters({});
    }
  }, [activeWorkflow, selectedStepId]);
  
  const handleParameterChange = (key: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveParameters = () => {
    if (!activeWorkflow || !selectedStep) return;
    
    const success = workflowService.updateStep(activeWorkflow.id, selectedStep.id, {
      parameters: parameters
    });
    
    if (success) {
      setActiveWorkflow(workflowService.getWorkflow(activeWorkflow.id) || null);
      toast.success("Step configuration saved");
    } else {
      toast.error("Failed to save configuration");
    }
  };
  
  if (!activeWorkflow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Action Configuration</CardTitle>
          <CardDescription>
            Select a workflow to configure actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-jarvis-secondary p-6">
            <p>No active workflow selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Action Configuration</CardTitle>
        <CardDescription>
          Configure the selected workflow step
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeWorkflow.steps.length === 0 ? (
          <div className="text-center text-jarvis-secondary p-6">
            <p>Add steps to your workflow first</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="step-select">Select Step</Label>
              <Select 
                value={selectedStepId || ""} 
                onValueChange={setSelectedStepId}
              >
                <SelectTrigger id="step-select">
                  <SelectValue placeholder="Choose a step to configure" />
                </SelectTrigger>
                <SelectContent>
                  {activeWorkflow.steps.map((step, index) => (
                    <SelectItem key={step.id} value={step.id}>
                      {index + 1}. {step.appName} - {step.action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStep ? (
              <>
                <div className="bg-jarvis-blue/10 p-3 rounded-md">
                  <h3 className="text-sm font-medium">{selectedStep.appName}</h3>
                  <p className="text-xs text-jarvis-secondary">{selectedStep.action}</p>
                </div>
                
                {parameterFields.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Parameters</h3>
                    
                    {parameterFields.map(field => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`param-${field}`}>
                          {field.replace(/_/g, ' ')}
                        </Label>
                        <Input
                          id={`param-${field}`}
                          value={parameters[field] || ''}
                          onChange={(e) => handleParameterChange(field, e.target.value)}
                          placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                    
                    <Button onClick={handleSaveParameters} className="w-full">
                      Save Configuration
                    </Button>
                  </div>
                ) : (
                  <p className="text-jarvis-secondary text-center p-4">
                    This action doesn't have any configurable parameters
                  </p>
                )}
              </>
            ) : (
              <p className="text-jarvis-secondary text-center p-4">
                Select a step to configure its parameters
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionConfigurator;
