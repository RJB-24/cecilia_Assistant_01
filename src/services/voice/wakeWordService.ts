
/**
 * Service for wake word detection and management
 */

export class WakeWordService {
  private wakeWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
  private isWakeWordEnabled = true;
  private sensitivity: 'high' | 'medium' | 'low' = 'medium';

  constructor() {
    this.loadCustomWakeWords();
  }

  private loadCustomWakeWords() {
    try {
      const savedWakeWords = localStorage.getItem('customWakeWords');
      if (savedWakeWords) {
        const customWords = JSON.parse(savedWakeWords);
        this.wakeWords = [...this.wakeWords, ...customWords];
      }
    } catch (error) {
      console.warn('Failed to load custom wake words:', error);
    }
  }

  private saveCustomWakeWords() {
    try {
      const defaultWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
      const customWords = this.wakeWords.filter(word => !defaultWords.includes(word));
      localStorage.setItem('customWakeWords', JSON.stringify(customWords));
    } catch (error) {
      console.error('Failed to save custom wake words:', error);
    }
  }

  /**
   * Enable or disable wake word detection
   */
  setWakeWordEnabled(enabled: boolean): void {
    this.isWakeWordEnabled = enabled;
  }

  /**
   * Add a custom wake word
   */
  addWakeWord(word: string): void {
    const lowerWord = word.toLowerCase();
    if (!this.wakeWords.includes(lowerWord)) {
      this.wakeWords.push(lowerWord);
      this.saveCustomWakeWords();
    }
  }

  /**
   * Remove a custom wake word
   */
  removeWakeWord(word: string): boolean {
    const lowerWord = word.toLowerCase();
    const defaultWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
    
    if (defaultWords.includes(lowerWord)) {
      return false; // Cannot remove default wake words
    }
    
    const index = this.wakeWords.indexOf(lowerWord);
    if (index !== -1) {
      this.wakeWords.splice(index, 1);
      this.saveCustomWakeWords();
      return true;
    }
    return false;
  }

  /**
   * Check if text contains a wake word
   */
  containsWakeWord(text: string): boolean {
    if (!this.isWakeWordEnabled) return true;
    
    const lowerText = text.toLowerCase();
    return this.wakeWords.some(word => lowerText.includes(word));
  }

  /**
   * Get all active wake words
   */
  getWakeWords(): string[] {
    return [...this.wakeWords];
  }

  /**
   * Set sensitivity for wake word detection
   */
  setSensitivity(level: 'high' | 'medium' | 'low'): void {
    this.sensitivity = level;
  }

  /**
   * Get current wake word sensitivity
   */
  getSensitivity(): 'high' | 'medium' | 'low' {
    return this.sensitivity;
  }

  /**
   * Check if wake words are enabled
   */
  isEnabled(): boolean {
    return this.isWakeWordEnabled;
  }
}

export const wakeWordService = new WakeWordService();
export default wakeWordService;
