
/**
 * Utilities for audio feedback and effects
 */

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  onEnded?: () => void;
}

const audioCache = new Map<string, HTMLAudioElement>();

/**
 * Play a sound effect with options
 */
export const playSound = (src: string, options: AudioOptions = {}): HTMLAudioElement => {
  let audio = audioCache.get(src);
  
  if (!audio) {
    audio = new Audio(src);
    audioCache.set(src, audio);
  }
  
  // Reset audio to beginning if it's already playing
  audio.currentTime = 0;
  
  // Apply options
  if (options.volume !== undefined) {
    audio.volume = Math.max(0, Math.min(1, options.volume));
  }
  
  audio.loop = options.loop || false;
  
  if (options.onEnded) {
    audio.onended = options.onEnded;
  }
  
  // Play the audio
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
  
  return audio;
};

/**
 * Stop audio playback
 */
export const stopSound = (src: string): void => {
  const audio = audioCache.get(src);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// Common sound effects for the Jarvis-style UI
export const sounds = {
  activate: '/sounds/activate.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  notification: '/sounds/notification.mp3',
  click: '/sounds/click.mp3',
  startup: '/sounds/startup.mp3',
};

/**
 * Convert text to speech using Web Speech API
 */
export const speak = (text: string, options: SpeechSynthesisUtterance = new SpeechSynthesisUtterance()): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser');
    return;
  }
  
  options.text = text;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Speak the text
  window.speechSynthesis.speak(options);
};

/**
 * Initialize audio context for more complex audio operations
 */
export const getAudioContext = (): AudioContext | null => {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (error) {
    console.error('AudioContext not supported:', error);
    return null;
  }
};

/**
 * Create audio visualizer from microphone input
 * Returns a cleanup function
 */
export const createMicrophoneVisualizer = async (
  canvasElement: HTMLCanvasElement,
  options: { 
    barColor?: string; 
    backgroundColor?: string;
    barWidth?: number;
    barGap?: number;
  } = {}
): Promise<() => void> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('getUserMedia not supported in this browser');
  }
  
  const audioContext = getAudioContext();
  if (!audioContext) {
    throw new Error('AudioContext not supported');
  }
  
  // Get microphone access
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  
  analyser.fftSize = 256;
  source.connect(analyser);
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const ctx = canvasElement.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not supported');
  }
  
  // Default options
  const barColor = options.barColor || '#33C3F0';
  const backgroundColor = options.backgroundColor || 'rgba(26, 31, 44, 0.2)';
  const barWidth = options.barWidth || 4;
  const barGap = options.barGap || 1;
  
  let animationFrame: number;
  
  // Render function
  const renderFrame = () => {
    animationFrame = requestAnimationFrame(renderFrame);
    
    analyser.getByteFrequencyData(dataArray);
    
    const width = canvasElement.width;
    const height = canvasElement.height;
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    const barCount = Math.floor(width / (barWidth + barGap));
    const barSpacing = width / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const index = Math.floor(i * bufferLength / barCount);
      const value = dataArray[index];
      
      const barHeight = (value / 255) * height;
      const x = i * barSpacing;
      const y = height - barHeight;
      
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };
  
  // Start rendering
  renderFrame();
  
  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationFrame);
    source.disconnect();
    stream.getTracks().forEach(track => track.stop());
  };
};

export default {
  playSound,
  stopSound,
  sounds,
  speak,
  getAudioContext,
  createMicrophoneVisualizer,
};
