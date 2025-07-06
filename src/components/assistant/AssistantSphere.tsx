
import React from 'react';
import AdvancedEnergyOrb from './AdvancedEnergyOrb';

interface AssistantSphereProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const AssistantSphere: React.FC<AssistantSphereProps> = ({ 
  isListening, 
  isSpeaking, 
  responseText 
}) => {
  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#40e0d0" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#00bcd4" />
      <pointLight position={[0, -10, 0]} intensity={0.8} color="#88ff00" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
        color="#00ff88"
      />
      
      {/* Rim lighting */}
      <pointLight position={[0, 0, -15]} intensity={0.5} color="#ff6b35" />
      <pointLight position={[0, 0, 15]} intensity={0.5} color="#00bcd4" />

      {/* Main Advanced Energy Orb */}
      <AdvancedEnergyOrb
        isListening={isListening}
        isSpeaking={isSpeaking}
        responseText={responseText}
      />
    </>
  );
};

export default AssistantSphere;
