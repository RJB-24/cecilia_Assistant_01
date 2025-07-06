import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { voiceService } from '@/services/voice/voiceService';
import { assistantFeaturesService } from '@/services/assistantFeaturesService';
import { toast } from 'sonner';
import AssistantSphere from './AssistantSphere';
import AssistantTopBar from './AssistantTopBar';
import AssistantBottomControls from './AssistantBottomControls';
import AssistantWelcomePanel from './AssistantWelcomePanel';
import ErrorFallback from '@/components/common/ErrorFallback';

const ImmersiveAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [assistantName] = useState('CECILIA');
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasThreeJSError, setHasThreeJSError] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
        setIsProcessing(true);
        
        await assistantFeaturesService.initialize();
        
        const greeting = `${getTimeBasedGreeting()}! I'm ${assistantName}, your advanced AI companion powered by Meta Llama and Groq technology.`;
        setResponseText(greeting);
        setIsInitialized(true);
        
        setTimeout(() => setShowWelcome(false), 8000);
        
        if (!isMuted && !hasSpokenWelcome) {
          setHasSpokenWelcome(true);
          setTimeout(async () => {
            try {
              setIsSpeaking(true);
              const welcomeMessage = `${greeting} I'm ready to assist you with intelligent conversations, task automation, data analysis, and much more. You can activate me by clicking the microphone button or simply start speaking. How may I help you today?`;
              await voiceService.speakText(welcomeMessage);
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
      } finally {
        setIsProcessing(false);
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
        setIsProcessing(true);
        setResponseText('Processing your request with advanced AI models...');
        
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
          toast.success(response.success ? 'Command processed successfully' : 'Command completed with notes');
        } else {
          setResponseText('I didn\'t catch that. Please try again.');
          toast.info('No speech detected. Please try again.');
        }
      } catch (error) {
        console.error('Error processing voice command:', error);
        setResponseText('Sorry, there was an error processing your command. Please try again.');
        toast.error('Error processing voice command');
      } finally {
        setIsListening(false);
        setIsSpeaking(false);
        setIsProcessing(false);
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
    
    voiceService.setMuted(newMutedState);
    
    if (newMutedState) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      toast.info('Voice responses muted');
    } else {
      toast.info('Voice responses unmuted');
    }
  };

  if (hasThreeJSError) {
    return (
      <ErrorFallback 
        title="CECILIA AI"
        message="Advanced AI Assistant Ready"
      />
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-cyan-900 to-teal-900 relative overflow-hidden">
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-400 rounded-full blur-xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Neural network background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="cyan" opacity="0.3"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="cyan" strokeWidth="0.5" opacity="0.2"/>
              <line x1="50" y1="0" x2="50" y2="100" stroke="cyan" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-pattern)"/>
        </svg>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          onError={(error) => {
            console.error('Three.js Canvas Error:', error);
            setHasThreeJSError(true);
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="night" />
            <fog attach="fog" args={['#001122', 8, 20]} />
            
            <AssistantSphere
              isListening={isListening}
              isSpeaking={isSpeaking || isProcessing}
              responseText=""
            />
            
            <OrbitControls 
              enableZoom={true}
              enablePan={false}
              minDistance={5}
              maxDistance={15}
              autoRotate={!isListening && !isSpeaking && !isProcessing}
              autoRotateSpeed={0.3}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <AssistantTopBar
          assistantName={assistantName}
          isListening={isListening}
          isSpeaking={isSpeaking || isProcessing}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <AssistantBottomControls
          isListening={isListening}
          responseText={responseText}
          onVoiceToggle={handleVoiceToggle}
        />

        {showWelcome && (
          <AssistantWelcomePanel 
            onClose={() => setShowWelcome(false)}
            isInitialized={isInitialized}
          />
        )}
      </div>
    </div>
  );
};

export default ImmersiveAssistant;
