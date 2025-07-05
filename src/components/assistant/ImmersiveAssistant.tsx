
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { voiceService } from '@/services/voice/voiceService';
import { assistantFeaturesService } from '@/services/assistantFeaturesService';
import { toast } from 'sonner';
import AssistantSphere from './AssistantSphere';
import AssistantTopBar from './AssistantTopBar';
import AssistantBottomControls from './AssistantBottomControls';

// Error boundary component for Three.js
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ThreeJSErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ThreeJS Error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-blue-900 to-black">
          <div className="text-white text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-ping"></div>
            </div>
            <p className="text-lg font-semibold">CECILIA is Active</p>
            <p className="text-sm text-gray-300 mt-2">Advanced AI Assistant Ready</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ImmersiveAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [assistantName] = useState('CECILIA');
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        console.log('Initializing CECILIA Assistant...');
        await assistantFeaturesService.initialize();
        
        const greeting = `${getTimeBasedGreeting()}! I'm ${assistantName}, your advanced AI companion. I'm ready to assist you with anything you need.`;
        setResponseText(greeting);
        setIsInitialized(true);
        
        // Speak welcome message if not muted
        if (!isMuted && !hasSpokenWelcome) {
          setHasSpokenWelcome(true);
          setTimeout(async () => {
            try {
              setIsSpeaking(true);
              await voiceService.speakText(`${greeting} You can activate me by clicking the microphone button or simply start speaking. How may I help you today?`);
              setIsSpeaking(false);
            } catch (error) {
              console.log('Voice synthesis not available, continuing without audio');
              setIsSpeaking(false);
            }
          }, 2000);
        }
        
        toast.success('CECILIA Assistant activated successfully');
      } catch (error) {
        console.error('Error initializing assistant:', error);
        toast.error('Failed to initialize CECILIA Assistant');
        setResponseText('System initialization failed. Please refresh and try again.');
      }
    };

    initializeAssistant();
  }, [assistantName, isMuted, hasSpokenWelcome]);

  const handleVoiceToggle = async () => {
    if (!isInitialized) {
      toast.error('Assistant is still initializing. Please wait...');
      return;
    }

    if (isListening) {
      try {
        setIsListening(false);
        setResponseText('Processing your request...');
        
        const transcript = await voiceService.stop();
        if (transcript && transcript.trim()) {
          setIsSpeaking(true);
          
          const response = await assistantFeaturesService.processAdvancedCommand(transcript);
          const responseMessage = response.message || 'Task completed successfully.';
          
          setResponseText(responseMessage);
          
          if (!isMuted) {
            try {
              await voiceService.speakText(responseMessage);
            } catch (error) {
              console.log('Voice synthesis error:', error);
            }
          }
          
          setIsSpeaking(false);
          toast.success('Command processed successfully');
        } else {
          setResponseText('I didn\'t catch that. Please try again.');
          toast.info('No speech detected. Please try again.');
        }
      } catch (error) {
        console.error('Error processing voice command:', error);
        setIsListening(false);
        setIsSpeaking(false);
        setResponseText('Sorry, there was an error processing your command. Please try again.');
        toast.error('Error processing voice command');
      }
    } else {
      try {
        if (!voiceService.isSupported()) {
          toast.error('Voice recognition not supported in this browser');
          return;
        }
        
        await voiceService.start();
        setIsListening(true);
        setResponseText('I\'m listening... Speak your command now.');
        toast.info('Listening for your command...');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Failed to start voice recognition. Please check your microphone permissions.');
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (voiceService.setMuted) {
      voiceService.setMuted(newMutedState);
    }
    
    if (newMutedState) {
      // Stop any ongoing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      toast.info('Voice responses muted');
    } else {
      toast.info('Voice responses unmuted');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-cyan-900 to-teal-900 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <ThreeJSErrorBoundary>
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 50 }}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <Suspense fallback={null}>
              <Environment preset="night" />
              <fog attach="fog" args={['#001122', 8, 20]} />
              
              <AssistantSphere
                isListening={isListening}
                isSpeaking={isSpeaking}
                responseText={responseText}
              />
              
              <OrbitControls 
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={15}
                autoRotate={!isListening && !isSpeaking}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        </ThreeJSErrorBoundary>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <AssistantTopBar
          assistantName={assistantName}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <AssistantBottomControls
          isListening={isListening}
          responseText={responseText}
          onVoiceToggle={handleVoiceToggle}
        />
      </div>
    </div>
  );
};

export default ImmersiveAssistant;
