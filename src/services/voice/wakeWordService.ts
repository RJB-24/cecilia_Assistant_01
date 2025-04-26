
import { WakeWordOptions } from './types';

export class WakeWordService {
  private isEnabled: boolean = true;
  private wakeWords: string[] = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
  private sensitivity: 'high' | 'medium' | 'low' = 'medium';

  constructor(options?: WakeWordOptions) {
    if (options) {
      this.isEnabled = options.enabled ?? this.isEnabled;
      this.wakeWords = options.customWords ?? this.wakeWords;
      this.sensitivity = options.sensitivity ?? this.sensitivity;
    }
    
    this.loadWakeWords();
  }
  
  private loadWakeWords(): void {
    try {
      const savedWakeWords = localStorage.getItem('wakeWords');
      if (savedWakeWords) {
        this.wakeWords = JSON.parse(savedWakeWords);
      }
      
      const isEnabled = localStorage.getItem('wakeWordEnabled');
      if (isEnabled !== null) {
        this.isEnabled = isEnabled === 'true';
      }
      
      const sensitivity = localStorage.getItem('wakeWordSensitivity');
      if (sensitivity) {
        this.sensitivity = sensitivity as any;
      }
    } catch (error) {
      console.error('Failed to load wake words from storage:', error);
    }
  }
  
  private saveWakeWords(): void {
    try {
      localStorage.setItem('wakeWords', JSON.stringify(this.wakeWords));
      localStorage.setItem('wakeWordEnabled', String(this.isEnabled));
      localStorage.setItem('wakeWordSensitivity', this.sensitivity);
    } catch (error) {
      console.error('Failed to save wake words to storage:', error);
    }
  }
  
  /**
   * Check if a text contains one of the wake words
   */
  containsWakeWord(text: string): boolean {
    if (!this.isEnabled) return true;
    
    const lowerText = text.toLowerCase();
    let foundMatch = false;
    
    switch(this.sensitivity) {
      case 'high':
        // For high sensitivity, partial word matches are allowed
        foundMatch = this.wakeWords.some(word => 
          lowerText.includes(word.toLowerCase())
        );
        break;
      case 'medium':
        // For medium sensitivity, require full word boundaries
        foundMatch = this.wakeWords.some(word => {
          const pattern = new RegExp(`\\b${word.toLowerCase()}\\b`);
          return pattern.test(lowerText);
        });
        break;
      case 'low':
        // For low sensitivity, the wake word must be at the beginning
        foundMatch = this.wakeWords.some(word => 
          lowerText.startsWith(word.toLowerCase())
        );
        break;
    }
    
    return foundMatch;
  }
  
  /**
   * Add a new wake word
   */
  addWakeWord(word: string): void {
    const lowerWord = word.toLowerCase().trim();
    if (!this.wakeWords.includes(lowerWord) && lowerWord.length > 0) {
      this.wakeWords.push(lowerWord);
      this.saveWakeWords();
    }
  }
  
  /**
   * Remove a wake word
   */
  removeWakeWord(word: string): boolean {
    const lowerWord = word.toLowerCase().trim();
    const index = this.wakeWords.indexOf(lowerWord);
    
    if (index >= 0) {
      this.wakeWords.splice(index, 1);
      this.saveWakeWords();
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all currently configured wake words
   */
  getWakeWords(): string[] {
    return [...this.wakeWords];
  }
  
  /**
   * Enable or disable wake word detection
   */
  setWakeWordEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.saveWakeWords();
  }
  
  /**
   * Check if wake word detection is enabled
   */
  isWakeWordEnabled(): boolean {
    return this.isEnabled;
  }
  
  /**
   * Set sensitivity level for wake word detection
   */
  setSensitivity(sensitivity: 'high' | 'medium' | 'low'): void {
    this.sensitivity = sensitivity;
    this.saveWakeWords();
  }
  
  /**
   * Get current sensitivity level
   */
  getSensitivity(): 'high' | 'medium' | 'low' {
    return this.sensitivity;
  }
  
  /**
   * Reset wake words to defaults
   */
  resetToDefaults(): void {
    this.wakeWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
    this.isEnabled = true;
    this.sensitivity = 'medium';
    this.saveWakeWords();
  }
}

export const wakeWordService = new WakeWordService();
export default wakeWordService;
