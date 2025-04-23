
/**
 * Screenpipe Terminator Integration Service
 * 
 * This service provides functions to interact with Screenpipe's Terminator:
 * - Screen capture for context awareness
 * - Desktop automation across applications
 * - Error recovery and action replay
 * - App detection and context awareness
 * - UI element detection and interaction
 */

export interface ScreenpipeConfig {
  scriptUrl?: string;
}

export interface CaptureOptions {
  area?: 'full' | 'active' | 'selection';
  format?: 'png' | 'jpg' | 'webp';
  quality?: number; // 1-100 for jpg/webp
  redactSensitive?: boolean;
}

export interface AutomationTask {
  type: 'browser' | 'app' | 'system' | 'email' | 'social' | 'data';
  action: string;
  parameters: Record<string, any>;
  errorHandling?: {
    retries: number;
    fallback?: string;
  };
}

export interface TaskResult {
  success: boolean;
  data?: any;
  error?: string;
  screenshot?: string; // base64 image of result
}

export interface UIElement {
  id: string;
  type: string;
  text?: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes?: Record<string, any>;
}

export interface ScreenContext {
  timestamp: string;
  activeApp: string;
  activeWindow: string;
  visibleElements: UIElement[];
  openApps: string[];
}

export class ScreenpipeService {
  private scriptUrl: string;
  private connected: boolean = false;
  private terminator: any = null; // Will hold the Terminator SDK instance
  private scriptLoaded: boolean = false;
  
  constructor(config: ScreenpipeConfig = {}) {
    // Default to the official Screenpipe Terminator SDK URL
    this.scriptUrl = config.scriptUrl || "https://agent.screenpi.pe/v1/terminal.js";
  }

  /**
   * Load Screenpipe Terminator SDK dynamically
   */
  private async loadSDK(): Promise<boolean> {
    if (this.scriptLoaded) {
      return true;
    }

    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = this.scriptUrl;
        script.async = true;
        
        script.onload = () => {
          console.log("Screenpipe Terminator SDK loaded successfully");
          this.scriptLoaded = true;
          // @ts-ignore - The global terminal object will be available after script loads
          this.terminator = window.terminal;
          resolve(true);
        };
        
        script.onerror = () => {
          console.error("Failed to load Screenpipe Terminator SDK");
          reject(new Error("Failed to load Screenpipe SDK"));
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Screenpipe SDK:", error);
        reject(error);
      }
    });
  }

  /**
   * Connect to the Screenpipe Terminator agent
   */
  async connect(): Promise<boolean> {
    if (this.connected) return true;
    
    try {
      // Load the SDK first if not already loaded
      if (!this.scriptLoaded) {
        await this.loadSDK();
      }
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      console.log("Connecting to Screenpipe Terminator...");
      
      // Connect to the agent - no API key required as per docs
      // The terminator agent must be running locally on the user's machine
      const result = await this.terminator.connect();
      
      this.connected = result.success;
      
      if (this.connected) {
        console.log("Connected to Screenpipe Terminator");
        // Register for session expiry notifications
        this.terminator.onSessionExpired(() => {
          console.log("Screenpipe session expired, reconnecting...");
          this.connected = false;
          this.connect();
        });
      } else {
        console.error("Failed to connect to Screenpipe Terminator");
        throw new Error("Failed to connect to Screenpipe Terminal Agent");
      }
      
      return this.connected;
    } catch (error) {
      console.error("Error connecting to Screenpipe Terminator:", error);
      this.connected = false;
      throw new Error(`Failed to connect to Screenpipe: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if connected to Terminator agent
   */
  isConnected(): boolean {
    return this.connected && this.terminator !== null;
  }

  /**
   * Capture screen for context awareness
   */
  async captureScreen(options: CaptureOptions = {}): Promise<string> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log(`Capturing screen with options:`, options);
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }

      const captureOptions: Record<string, any> = {};
      
      if (options.area) {
        captureOptions.area = options.area;
      }
      
      if (options.format) {
        captureOptions.format = options.format;
      }
      
      if (options.quality) {
        captureOptions.quality = options.quality;
      }
      
      if (options.redactSensitive !== undefined) {
        captureOptions.redactSensitive = options.redactSensitive;
      }
      
      const result = await this.terminator.captureScreen(captureOptions);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to capture screen");
      }
      
      return result.data.imageData; // Base64 encoded image
    } catch (error) {
      console.error("Error capturing screen with Screenpipe:", error);
      
      // If terminator is not available, return a simulated response
      if (!this.terminator) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      }
      
      throw new Error(`Failed to capture screen: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Detect open applications and their context
   */
  async detectOpenApps(): Promise<string[]> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log("Detecting open applications");
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      const result = await this.terminator.getRunningApplications();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to detect open applications");
      }
      
      return result.data.applications;
    } catch (error) {
      console.error("Error detecting open apps with Screenpipe:", error);
      
      // If terminator is not available, return simulated apps
      if (!this.terminator) {
        return ["Chrome", "Slack", "Outlook", "Excel"];
      }
      
      throw new Error(`Failed to detect open apps: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Execute an automation task across applications
   */
  async executeTask(task: AutomationTask): Promise<TaskResult> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log(`Executing ${task.type}/${task.action} task with parameters:`, task.parameters);
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      let result;
      
      // Map our task types to Screenpipe's commands
      switch(task.type) {
        case "browser":
          if (task.action === "open") {
            result = await this.terminator.openURL(task.parameters.url);
          } else if (task.action === "navigate") {
            result = await this.terminator.navigateTo(task.parameters.url);
          } else {
            throw new Error(`Unsupported browser action: ${task.action}`);
          }
          break;
          
        case "app":
          if (task.action === "open" || task.action === "launch") {
            result = await this.terminator.launchApplication(task.parameters.appName || task.parameters.name);
          } else if (task.action === "close") {
            result = await this.terminator.closeApplication(task.parameters.appName || task.parameters.name);
          } else if (task.action === "create_event") {
            // This would be a more complex sequence
            result = await this.terminator.launchApplication("Calendar");
            // Additional steps would be needed here
          } else {
            throw new Error(`Unsupported app action: ${task.action}`);
          }
          break;
          
        case "email":
          if (task.action === "compose") {
            result = await this.terminator.composeEmail({
              to: task.parameters.to,
              subject: task.parameters.subject,
              body: task.parameters.body
            });
          } else {
            throw new Error(`Unsupported email action: ${task.action}`);
          }
          break;
          
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
      
      if (!result.success && task.errorHandling && task.errorHandling.retries > 0) {
        console.log(`Retrying task (${task.errorHandling.retries} retries left)`);
        
        return this.executeTask({
          ...task,
          errorHandling: {
            ...task.errorHandling,
            retries: task.errorHandling.retries - 1
          }
        });
      }
      
      // Take a screenshot after task completion for verification
      let screenshot;
      try {
        screenshot = await this.captureScreen();
      } catch (err) {
        // If screenshot fails, continue without it
        console.warn("Failed to capture screen after task:", err);
      }
      
      return {
        success: result.success,
        data: result.data,
        error: result.error,
        screenshot
      };
    } catch (error) {
      console.error("Error executing task with Screenpipe:", error);
      
      // If terminator is not available, return a simulated response
      if (!this.terminator) {
        return {
          success: false,
          error: "Terminator agent not connected. Please install and run the Screenpipe Terminator agent."
        };
      }
      
      return {
        success: false,
        error: `Failed to execute task: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Get the current screen context
   */
  async getScreenContext(): Promise<ScreenContext> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log("Getting screen context");
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      const [activeAppResult, openAppsResult, elementsResult] = await Promise.all([
        this.terminator.getActiveApplication(),
        this.terminator.getRunningApplications(),
        this.terminator.getVisibleElements()
      ]);
      
      if (!activeAppResult.success) {
        throw new Error(activeAppResult.error || "Failed to get active application");
      }
      
      const openApps = openAppsResult.success ? 
        openAppsResult.data.applications : 
        ["Unknown"];
      
      const visibleElements = elementsResult.success ? 
        elementsResult.data.elements.map((el: any) => ({
          id: el.id || `element-${Math.random().toString(36).substring(2, 11)}`,
          type: el.type || "unknown",
          text: el.text,
          bounds: {
            x: el.bounds?.x || 0,
            y: el.bounds?.y || 0,
            width: el.bounds?.width || 0,
            height: el.bounds?.height || 0
          },
          attributes: el.attributes
        })) : 
        [];
      
      return {
        timestamp: new Date().toISOString(),
        activeApp: activeAppResult.data.name,
        activeWindow: activeAppResult.data.window || activeAppResult.data.title || "Unknown",
        visibleElements,
        openApps
      };
    } catch (error) {
      console.error("Error getting screen context:", error);
      
      // If terminator is not available, return a simulated response
      if (!this.terminator) {
        return {
          timestamp: new Date().toISOString(),
          activeApp: "Chrome",
          activeWindow: "GroqFlow - AI-Powered Workflow Automation Assistant",
          visibleElements: [],
          openApps: ["Chrome", "Slack", "Outlook", "Excel"]
        };
      }
      
      throw new Error(`Failed to get screen context: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Find UI element by selector
   */
  async findElement(selector: string): Promise<UIElement | null> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log(`Finding UI element: ${selector}`);
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      const result = await this.terminator.findElement(selector);
      
      if (!result.success || !result.data.element) {
        return null;
      }
      
      const el = result.data.element;
      
      return {
        id: el.id || `element-${Math.random().toString(36).substring(2, 11)}`,
        type: el.type || "unknown",
        text: el.text,
        bounds: {
          x: el.bounds?.x || 0,
          y: el.bounds?.y || 0,
          width: el.bounds?.width || 0,
          height: el.bounds?.height || 0
        },
        attributes: el.attributes
      };
    } catch (error) {
      console.error("Error finding UI element:", error);
      return null;
    }
  }

  /**
   * Interact with UI element
   */
  async interactWithElement(elementId: string, action: string, parameters?: Record<string, any>): Promise<boolean> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log(`Interacting with element ${elementId}, action: ${action}`);
      
      if (!this.terminator) {
        throw new Error("Terminator SDK not available");
      }
      
      let result;
      
      switch(action) {
        case "click":
          result = await this.terminator.clickElement(elementId);
          break;
        case "type":
          if (!parameters?.text) {
            throw new Error("Text parameter required for type action");
          }
          result = await this.terminator.typeIntoElement(elementId, parameters.text);
          break;
        case "hover":
          result = await this.terminator.hoverElement(elementId);
          break;
        default:
          throw new Error(`Unsupported element action: ${action}`);
      }
      
      return result.success;
    } catch (error) {
      console.error("Error interacting with UI element:", error);
      return false;
    }
  }

  /**
   * Check if the Screenpipe agent is installed and available
   * This can be used to prompt the user to install it if needed
   */
  async checkAgentInstalled(): Promise<boolean> {
    try {
      await this.loadSDK();
      
      if (!this.terminator) {
        return false;
      }
      
      try {
        // Try to ping the agent
        const result = await this.terminator.ping();
        return result.success === true;
      } catch (error) {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.scriptLoaded || typeof window !== 'undefined' && 'terminal' in window;
  }
}

// Export an instance with default configuration
// No API key is needed as Screenpipe Terminator is a local agent
export const screenpipeService = new ScreenpipeService();
