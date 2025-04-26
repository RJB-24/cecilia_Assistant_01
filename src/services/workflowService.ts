
import { APP_MAPPINGS } from '@/constants/appMappings';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  appId: string;
  appName: string;
  action: string;
  parameters: Record<string, any>;
}

export interface WorkflowSchedule {
  type: 'daily' | 'weekly' | 'monthly' | 'once';
  time?: string;
  days?: string[];
  date?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  schedule?: WorkflowSchedule;
  isActive: boolean;
  createdAt: number;
  lastRun?: number;
}

class WorkflowService {
  private workflows: Workflow[] = [];
  private activeWorkflow: Workflow | null = null;
  
  constructor() {
    this.loadWorkflows();
  }

  private loadWorkflows(): void {
    try {
      const savedWorkflows = localStorage.getItem('workflows');
      if (savedWorkflows) {
        this.workflows = JSON.parse(savedWorkflows);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      this.workflows = [];
    }
  }

  private saveWorkflows(): void {
    try {
      localStorage.setItem('workflows', JSON.stringify(this.workflows));
    } catch (error) {
      console.error('Failed to save workflows:', error);
    }
  }

  getAllWorkflows(): Workflow[] {
    return [...this.workflows];
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.find(workflow => workflow.id === id);
  }

  createWorkflow(name: string): Workflow {
    const workflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name,
      steps: [],
      isActive: false,
      createdAt: Date.now()
    };
    
    this.workflows.push(workflow);
    this.activeWorkflow = workflow;
    this.saveWorkflows();
    return workflow;
  }

  updateWorkflow(workflow: Workflow): void {
    const index = this.workflows.findIndex(w => w.id === workflow.id);
    if (index !== -1) {
      this.workflows[index] = { ...workflow };
      this.saveWorkflows();
    }
  }

  deleteWorkflow(id: string): void {
    const index = this.workflows.findIndex(workflow => workflow.id === id);
    if (index !== -1) {
      this.workflows.splice(index, 1);
      this.saveWorkflows();
      
      if (this.activeWorkflow && this.activeWorkflow.id === id) {
        this.activeWorkflow = null;
      }
    }
  }
  
  setActiveWorkflow(id: string | null): void {
    if (id === null) {
      this.activeWorkflow = null;
      return;
    }
    
    const workflow = this.workflows.find(w => w.id === id);
    this.activeWorkflow = workflow || null;
  }
  
  getActiveWorkflow(): Workflow | null {
    return this.activeWorkflow;
  }
  
  addStep(workflowId: string, appId: string, action: string, parameters: Record<string, any> = {}): WorkflowStep | null {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return null;
    
    const appInfo = APP_MAPPINGS[appId] || Object.values(APP_MAPPINGS).find(app => app.name === appId);
    if (!appInfo) return null;
    
    const step: WorkflowStep = {
      id: `step_${Date.now()}`,
      appId,
      appName: appInfo.name,
      action,
      parameters
    };
    
    workflow.steps.push(step);
    this.updateWorkflow(workflow);
    return step;
  }
  
  updateStep(workflowId: string, stepId: string, updates: Partial<WorkflowStep>): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;
    
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return false;
    
    workflow.steps[stepIndex] = { ...workflow.steps[stepIndex], ...updates };
    this.updateWorkflow(workflow);
    return true;
  }
  
  removeStep(workflowId: string, stepId: string): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;
    
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return false;
    
    workflow.steps.splice(stepIndex, 1);
    this.updateWorkflow(workflow);
    return true;
  }
  
  setWorkflowSchedule(workflowId: string, schedule: WorkflowSchedule): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;
    
    workflow.schedule = schedule;
    this.updateWorkflow(workflow);
    return true;
  }
  
  toggleWorkflowActive(workflowId: string): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;
    
    workflow.isActive = !workflow.isActive;
    this.updateWorkflow(workflow);
    
    if (workflow.isActive) {
      toast.success(`Workflow "${workflow.name}" activated`);
    } else {
      toast.info(`Workflow "${workflow.name}" deactivated`);
    }
    
    return workflow.isActive;
  }
  
  // In a real implementation, this would handle actual execution of workflows
  executeWorkflow(workflowId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const workflow = this.getWorkflow(workflowId);
      if (!workflow) {
        toast.error("Workflow not found");
        resolve(false);
        return;
      }
      
      toast.info(`Executing workflow: ${workflow.name}`);
      
      // Simulate execution delay
      setTimeout(() => {
        workflow.lastRun = Date.now();
        this.updateWorkflow(workflow);
        toast.success(`Workflow "${workflow.name}" executed successfully`);
        resolve(true);
      }, 2000);
    });
  }
  
  getAvailableActions(appId: string): string[] {
    // This would be expanded based on the app
    switch(appId) {
      case 'email':
      case 'outlook':
        return ['compose', 'send', 'check_inbox', 'reply', 'forward'];
      case 'browser':
      case 'chrome':
      case 'firefox':
      case 'edge':
        return ['navigate', 'search', 'bookmark', 'new_tab', 'close_tab'];
      case 'calendar':
        return ['create_event', 'check_schedule', 'add_reminder', 'join_meeting'];
      case 'word':
      case 'excel':
      case 'powerpoint':
        return ['open_file', 'create_file', 'save', 'export'];
      default:
        return ['open', 'close', 'search'];
    }
  }
  
  getAvailableParameters(action: string): string[] {
    // This would be expanded based on the action
    switch(action) {
      case 'compose':
        return ['subject', 'recipient', 'body', 'attachments'];
      case 'create_event':
        return ['title', 'start_time', 'end_time', 'participants', 'location'];
      case 'navigate':
        return ['url', 'new_window'];
      case 'search':
        return ['query', 'filters'];
      case 'open_file':
        return ['file_path', 'read_only'];
      default:
        return [];
    }
  }
}

export const workflowService = new WorkflowService();
export default workflowService;
