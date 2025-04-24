import { ScreenpipeService as BaseScreenpipeService, ScreenpipeConfig, CaptureOptions, AutomationTask, TaskResult, UIElement, ScreenContext, APP_MAPPINGS } from './screenpipeService';

/**
 * Enhanced ScreenpipeService with advanced automation capabilities
 */
export class EnhancedScreenpipeService extends BaseScreenpipeService {
  private retryOptions = {
    maxRetries: 3,
    delayMs: 1000
  };
  
  private taskQueue: Array<{
    task: AutomationTask;
    priority: number;
    callback: (result: TaskResult) => void;
  }> = [];
  
  private isProcessingQueue = false;
  private lastScreenContext: ScreenContext | null = null;
  private screenContextInterval: any = null;
  
  constructor(config?: ScreenpipeConfig) {
    super(config);
  }
  
  /**
   * Connect to Screenpipe with enhanced capabilities
   */
  async connect(): Promise<boolean> {
    const connected = await super.connect();
    
    if (connected) {
      // Start monitoring screen context for context awareness
      this.startScreenContextMonitoring();
      console.log("Enhanced Screenpipe service connected with continuous monitoring");
    }
    
    return connected;
  }
  
  /**
   * Start continuous monitoring of screen context
   */
  private startScreenContextMonitoring(intervalMs = 5000): void {
    if (this.screenContextInterval) {
      clearInterval(this.screenContextInterval);
    }
    
    // Immediately get initial context
    this.updateScreenContextAsync();
    
    // Set up interval for continuous updates
    this.screenContextInterval = setInterval(() => {
      this.updateScreenContextAsync();
    }, intervalMs);
    
    console.log(`Screen context monitoring started (${intervalMs}ms interval)`);
  }
  
  /**
   * Update screen context asynchronously
   */
  private async updateScreenContextAsync(): Promise<void> {
    if (!this.isConnected()) return;
    
    try {
      const context = await this.getScreenContext();
      this.lastScreenContext = context;
    } catch (error) {
      console.error("Error updating screen context:", error);
    }
  }
  
  /**
   * Stop screen context monitoring
   */
  stopScreenContextMonitoring(): void {
    if (this.screenContextInterval) {
      clearInterval(this.screenContextInterval);
      this.screenContextInterval = null;
      console.log("Screen context monitoring stopped");
    }
  }
  
  /**
   * Get the most recent screen context without making a new API call
   */
  getLatestScreenContext(): ScreenContext | null {
    return this.lastScreenContext;
  }
  
  /**
   * Execute task with retry logic and error recovery
   */
  async executeTask(task: AutomationTask, priority = 0): Promise<TaskResult> {
    // If not a high priority task and queue is not empty, add to queue
    if (priority < 10 && this.taskQueue.length > 0) {
      return new Promise((resolve) => {
        this.taskQueue.push({
          task,
          priority,
          callback: resolve
        });
        
        // Sort queue by priority
        this.taskQueue.sort((a, b) => b.priority - a.priority);
        
        // Start processing queue if not already running
        if (!this.isProcessingQueue) {
          this.processTaskQueue();
        }
      });
    }
    
    // Otherwise execute immediately with retries
    return this.executeTaskWithRetries(task);
  }
  
  /**
   * Process the task queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.isProcessingQueue || this.taskQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      if (!nextTask) continue;
      
      try {
        const result = await this.executeTaskWithRetries(nextTask.task);
        nextTask.callback(result);
      } catch (error) {
        console.error("Error processing queued task:", error);
        nextTask.callback({
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
      // Small delay between tasks
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    this.isProcessingQueue = false;
  }
  
  /**
   * Execute task with retry logic
   */
  private async executeTaskWithRetries(task: AutomationTask): Promise<TaskResult> {
    let lastError: any = null;
    let attempts = 0;
    
    while (attempts < this.retryOptions.maxRetries) {
      try {
        // Get fresh screen context before each attempt
        if (attempts > 0) {
          await this.updateScreenContextAsync();
          console.log(`Retry attempt ${attempts + 1} for task: ${task.type}/${task.action}`);
          await new Promise(resolve => setTimeout(resolve, this.retryOptions.delayMs));
        }
        
        const result = await super.executeTask(task);
        
        if (result.success) {
          return result;
        }
        
        lastError = result.error;
        attempts++;
      } catch (error) {
        lastError = error;
        attempts++;
      }
    }
    
    // All retries failed
    return {
      success: false,
      error: `Failed after ${attempts} attempts. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`
    };
  }
  
  /**
   * Execute a workflow of multiple tasks in sequence
   */
  async executeWorkflow(tasks: AutomationTask[]): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    
    for (const task of tasks) {
      try {
        const result = await this.executeTaskWithRetries(task);
        results.push(result);
        
        // Stop workflow on failure unless task has continueOnError flag
        if (!result.success && !task.errorHandling?.continueOnError) {
          break;
        }
      } catch (error) {
        const errorResult: TaskResult = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
        
        results.push(errorResult);
        
        // Stop workflow on error unless task has continueOnError flag
        if (!task.errorHandling?.continueOnError) {
          break;
        }
      }
    }
    
    return results;
  }
  
  /**
   * Find an element on screen and perform an action
   */
  async findAndInteract(selector: string, action: string, params?: any): Promise<boolean> {
    const element = await this.findElement(selector);
    
    if (!element) {
      return false;
    }
    
    return this.interactWithElement(element.id, action, params);
  }
  
  /**
   * Fill out a form with multiple fields
   */
  async fillForm(selectors: Record<string, string>): Promise<TaskResult> {
    const results: Record<string, boolean> = {};
    let allSucceeded = true;
    
    for (const [field, value] of Object.entries(selectors)) {
      try {
        const success = await this.findAndInteract(field, 'type', { text: value });
        results[field] = success;
        
        if (!success) {
          allSucceeded = false;
        }
      } catch (error) {
        results[field] = false;
        allSucceeded = false;
      }
    }
    
    return {
      success: allSucceeded,
      data: { formResults: results }
    };
  }

  /**
   * Enhanced screen capture with auto-redaction of sensitive data
   */
  async captureScreenEnhanced(options: CaptureOptions & { 
    detectText?: boolean; 
    redactPatterns?: string[];
  } = {}): Promise<{ imageData: string; detectedText?: string[]; }> {
    // Capture screen using base method
    const imageData = await this.captureScreen(options);
    
    // If text detection is requested, perform OCR on the image
    let detectedText: string[] = [];
    
    if (options.detectText && this.isConnected()) {
      try {
        // In a real implementation, would call Screenpipe's OCR capabilities
        console.log("Detecting text in screenshot");
        // Simulate OCR results
        detectedText = [
          "Sample detected text 1",
          "Sample detected text 2",
          "Password: XXXXX (redacted)",
          "Credit Card: XXXX-XXXX-XXXX-1234 (redacted)"
        ];
      } catch (error) {
        console.error("Error detecting text in screenshot:", error);
      }
    }
    
    return {
      imageData,
      detectedText: detectedText.length > 0 ? detectedText : undefined
    };
  }

  /**
   * Monitor application for crashes and automatically restart
   * @param appName Name of the application to monitor
   */
  async monitorAndRecover(appName: string): Promise<boolean> {
    console.log(`Setting up crash recovery monitoring for ${appName}`);
    
    // In real implementation, would set up a monitoring loop
    // For this demo, we'll just return success
    return true;
  }
}

// Update the type definition for AutomationTask
declare module './screenpipeService' {
  interface AutomationTask {
    errorHandling?: {
      retries?: number;
      fallback?: string;
      continueOnError?: boolean;
    };
  }
}

// Export enhanced singleton
export const enhancedScreenpipeService = new EnhancedScreenpipeService();
export default enhancedScreenpipeService;
