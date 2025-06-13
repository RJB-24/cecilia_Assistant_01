
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { voiceService } from '@/services/voice/voiceService';
import { assistantFeaturesService } from '@/services/assistantFeaturesService';
import { toast } from 'sonner';
import AssistantSphere from './AssistantSphere';
import AssistantTopBar from './AssistantTopBar';
import AssistantBottomControls from './AssistantBottomControls';

const ImmersiveAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [assistantName] = useState('CECILIA');
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        await assistantFeaturesService.initialize();
        setResponseText(`Hello, I'm ${assistantName}. I'm your advanced AI assistant ready to help with anything you need.`);
        
        // Only speak welcome message once and if not muted
        if (!isMuted && !hasSpokenWelcome) {
          setHasSpokenWelcome(true);
          setTimeout(async () => {
            try {
              await voiceService.speakText(`Hello, I'm ${assistantName}. I'm your advanced AI assistant. I can help you with meetings, notes, calendar management, emails, data analysis, and much more. How may I assist you today?`);
            } catch (error) {
              console.log('Voice synthesis not available, continuing without audio');
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error initializing assistant:', error);
        toast.error('Failed to initialize assistant');
      }
    };

    initializeAssistant();
  }, [assistantName, isMuted, hasSpokenWelcome]);

  const handleVoiceToggle = async () => {
    if (isListening) {
      try {
        setIsListening(false);
        const transcript = await voiceService.stop();
        if (transcript.trim()) {
          setIsSpeaking(true);
          setResponseText('Processing your request...');
          
          const response = await assistantFeaturesService.processAdvancedCommand(transcript);
          setResponseText(response.message || 'Task completed successfully.');
          
          if (!isMuted) {
            try {
              await voiceService.speakText(response.message || 'Task completed successfully.');
            } catch (error) {
              console.log('Voice synthesis not available');
            }
          }
          
          setIsSpeaking(false);
        }
      } catch (error) {
        setIsListening(false);
        setIsSpeaking(false);
        toast.error('Error processing voice command');
      }
    } else {
      try {
        await voiceService.start();
        setIsListening(true);
        setResponseText('I\'m listening. Speak your command...');
      } catch (error) {
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (voiceService.setMuted) {
      voiceService.setMuted(!isMuted);
    }
    if (!isMuted) {
      toast.info('Voice responses muted');
    } else {
      toast.info('Voice responses unmuted');
      // Don't try to speak when unmuting to avoid errors
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden">
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          onCreated={({ gl }) => {
            // Handle context loss
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              console.log('WebGL context lost, attempting to restore...');
            });
            
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored');
            });
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <AssistantSphere
              isListening={isListening}
              isSpeaking={isSpeaking}
              responseText={responseText}
            />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      </div>

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
