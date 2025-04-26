
export class WakeWordService {
  private wakeWords = ['cecilia', 'assistant', 'hey cecilia', 'ok cecilia'];
  private isWakeWordEnabled = true;

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
    if (!this.wakeWords.includes(word.toLowerCase())) {
      this.wakeWords.push(word.toLowerCase());
    }
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
   * Get wake word status
   */
  isEnabled(): boolean {
    return this.isWakeWordEnabled;
  }
}

export const wakeWordService = new WakeWordService();
export default wakeWordService;
