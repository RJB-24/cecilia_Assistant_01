
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text, OrbitControls, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Settings, Home, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '@/services/voice/voiceService';
import { assistantFeaturesService } from '@/services/assistantFeaturesService';
import { toast } from 'sonner';
import * as THREE from 'three';

interface AssistantSphereProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const AssistantSphere: React.FC<AssistantSphereProps> = ({ isListening, isSpeaking, responseText }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isListening) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
      } else if (isSpeaking) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhongMaterial
          color={isListening ? '#00ff88' : isSpeaking ? '#ff6b35' : '#0088ff'}
          transparent
          opacity={0.8}
          wireframe={hovered}
        />
      </Sphere>
      
      {/* Particle effects */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere key={i} args={[0.05]} position={[
            Math.sin(i) * 3,
            Math.cos(i) * 3,
            Math.sin(i * 0.5) * 3
          ]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </Sphere>
        ))}
      </group>

      {responseText && (
        <Text
          position={[0, -3, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
        >
          {responseText}
        </Text>
      )}
    </group>
  );
};

const ImmersiveAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [assistantName] = useState('CECILIA');

  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        await assistantFeaturesService.initialize();
        setResponseText(`Hello, I'm ${assistantName}. I'm your advanced AI assistant ready to help with anything you need.`);
        
        setTimeout(async () => {
          if (!isMuted) {
            await voiceService.speakText(`Hello, I'm ${assistantName}. I'm your advanced AI assistant. I can help you with meetings, notes, calendar management, emails, data analysis, and much more. How may I assist you today?`);
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing assistant:', error);
        toast.error('Failed to initialize assistant');
      }
    };

    initializeAssistant();
  }, [assistantName, isMuted]);

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
            await voiceService.speakText(response.message || 'Task completed successfully.');
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
    voiceService.setMuted(!isMuted);
    if (!isMuted) {
      toast.info('Voice responses muted');
    } else {
      toast.info('Voice responses unmuted');
      voiceService.speakText('Voice responses are now unmuted');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
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

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-white tracking-wider">
                {assistantName}
              </h1>
              <div className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-green-400 animate-pulse' : 
                isSpeaking ? 'bg-orange-400 animate-pulse' : 
                'bg-blue-400'
              }`} />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => window.location.href = '/lab'}
              >
                <Home />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => window.location.href = '/settings'}
              >
                <Settings />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex flex-col items-center space-y-4">
            {/* Response Text */}
            <Card className="bg-black/50 backdrop-blur-sm border-white/20 max-w-2xl">
              <CardContent className="p-4">
                <p className="text-white text-center min-h-[2rem] flex items-center justify-center">
                  {responseText || 'Waiting for your command...'}
                </p>
              </CardContent>
            </Card>

            {/* Voice Button */}
            <Button
              onClick={handleVoiceToggle}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white shadow-2xl transform transition-all duration-200 hover:scale-110`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </Button>

            {/* Quick Actions */}
            <div className="flex space-x-2 text-xs text-white/70">
              <span>Say: "Schedule a meeting" • "Take notes" • "Send email" • "Analyze data"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveAssistant;
