
import { screenpipeService, CaptureOptions, AutomationTask, TaskResult } from './screenpipeService';

interface ErrorHandlingOptions {
  retries?: number;
  fallback?: string;
  continueOnError?: boolean;
}

interface EnhancedCaptureOptions extends CaptureOptions {
  detectText?: boolean;
  redactPatterns?: string[];
}

class EnhancedScreenpipeService {
  private maxRetries = 3;
  private defaultTimeout = 5000;
  private automationHistory: any[] = [];
  private activeMonitoring = false;
  private errorHandling: ErrorHandlingOptions = { retries: 2, fallback: undefined };

  constructor() {
    this.loadAutomationHistory();
  }

  public isConfigured(): boolean {
    return screenpipeService.isConfigured();
  }

  public isConnected(): boolean {
    return screenpipeService.isConnected();
  }

  public async connect(): Promise<boolean> {
    return screenpipeService.connect();
  }

  public async getScreenContext(): Promise<any> {
    return screenpipeService.getScreenContext();
  }

  public setConfig(config: any) {
    this.maxRetries = config.maxRetries || this.maxRetries;
    this.defaultTimeout = config.defaultTimeout || this.defaultTimeout;
    this.errorHandling = { ...this.errorHandling, ...config.errorHandling };
  }

  public startMonitoring() {
    this.activeMonitoring = true;
    console.log('Automation monitoring started.');
  }

  public stopMonitoring() {
    this.activeMonitoring = false;
    console.log('Automation monitoring stopped.');
  }

  public getAutomationHistory() {
    return this.automationHistory;
  }

  private logAutomationAction(actionDetails: any) {
    this.automationHistory.push(actionDetails);
    this.saveAutomationHistory();
    if (this.activeMonitoring) {
      console.log('Automation Action:', actionDetails);
    }
  }

  private saveAutomationHistory() {
    try {
      localStorage.setItem('automationHistory', JSON.stringify(this.automationHistory));
    } catch (error) {
      console.error('Failed to save automation history to localStorage:', error);
    }
  }

  private loadAutomationHistory() {
    try {
      const storedHistory = localStorage.getItem('automationHistory');
      this.automationHistory = storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Failed to load automation history from localStorage:', error);
      this.automationHistory = [];
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async executeAction(actionType: string, params: any, timeout: number = this.defaultTimeout): Promise<any> {
    try {
      // Using executeTask instead of automate which doesn't exist
      const splitAction = actionType.split('/');
      const taskType = this.getValidTaskType(splitAction[0] || 'system');
      const action = splitAction[1] || actionType;

      const result = await Promise.race([
        screenpipeService.executeTask({
          type: taskType,
          action: action,
          parameters: params
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Action timed out after ${timeout}ms`)), timeout)
        )
      ]);

      this.logAutomationAction({
        action: actionType,
        params,
        success: true,
        timestamp: new Date(),
      });

      return result;
    } catch (error) {
      this.logAutomationAction({
        action: actionType,
        params,
        success: false,
        error: (error as Error).message,
        timestamp: new Date(),
      });
      throw error;
    }
  }

  // Helper method to ensure we only use valid task types
  private getValidTaskType(type: string): "browser" | "app" | "system" | "email" | "social" | "data" {
    const validTypes = ["browser", "app", "system", "email", "social", "data"];
    return validTypes.includes(type.toLowerCase()) 
      ? type.toLowerCase() as "browser" | "app" | "system" | "email" | "social" | "data" 
      : "system";
  }

  // Implement executeTask to handle AutomationTask objects
  public async executeTask(task: AutomationTask): Promise<TaskResult> {
    try {
      const result = await screenpipeService.executeTask(task);
      
      this.logAutomationAction({
        action: `${task.type}/${task.action}`,
        params: task.parameters,
        success: true,
        timestamp: new Date(),
      });
      
      return result;
    } catch (error) {
      this.logAutomationAction({
        action: `${task.type}/${task.action}`,
        params: task.parameters,
        success: false,
        error: (error as Error).message,
        timestamp: new Date(),
      });
      
      throw error;
    }
  }

  // Add captureScreen method using the screenpipeService implementation
  public async captureScreen(options: CaptureOptions = {}): Promise<string> {
    return screenpipeService.captureScreen(options);
  }

  // Add captureScreenEnhanced method for enhanced screen capture
  public async captureScreenEnhanced(options: EnhancedCaptureOptions = {}): Promise<any> {
    const screenImage = await this.captureScreen(options);
    
    // Mock response for enhanced features - in a real implementation,
    // this would process the image further with text detection, etc.
    return {
      image: screenImage,
      detectedText: options.detectText ? ['Text detected in screen (simulated)'] : [],
      redacted: options.redactPatterns?.length ? true : false
    };
  }

  public async automateWithRetry(
    actionType: string,
    params: any,
    options?: { retries?: number; fallback?: string; continueOnError?: boolean }
  ): Promise<any> {
    const retryCount = options?.retries ?? this.errorHandling.retries ?? this.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        // If not the first attempt, wait before retrying
        if (attempt > 0) {
          await this.delay(Math.pow(2, attempt) * 500); // Exponential backoff
        }
        
        // Using executeAction instead of directly calling screenpipeService.automate
        const result = await this.executeAction(actionType, params);
        
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`Automation attempt ${attempt + 1}/${retryCount + 1} failed:`, error);
      }
    }
    
    // All attempts failed
    if (options?.fallback) {
      console.warn(`All retry attempts failed. Using fallback: ${options.fallback}`);
      return { status: 'fallback', message: options.fallback };
    }
    
    if (options?.continueOnError) {
      console.warn('All retry attempts failed. Continuing execution as requested.');
      return { status: 'error', error: lastError, continuedExecution: true };
    }
    
    throw lastError || new Error('Automation failed after multiple attempts');
  }
}

export const enhancedScreenpipeService = new EnhancedScreenpipeService();
export default enhancedScreenpipeService;
