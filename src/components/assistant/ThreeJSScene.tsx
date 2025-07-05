
import React from 'react';
import { Text } from '@react-three/drei';
import EnergyBall from './EnergyBall';

interface ThreeJSSceneProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const ThreeJSScene: React.FC<ThreeJSSceneProps> = ({ isListening, isSpeaking, responseText }) => {
  return (
    <>
      {/* Enhanced lighting for better energy ball visibility */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#40e0d0" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00bcd4" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#00ff88"
      />

      {/* Main Energy Ball */}
      <EnergyBall
        isListening={isListening}
        isSpeaking={isSpeaking}
        responseText={responseText}
      />

      {/* Response text display */}
      {responseText && (
        <Text
          position={[0, -4, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={12}
          textAlign="center"
          font="/fonts/roboto-regular.woff"
        >
          {responseText}
        </Text>
      )}
    </>
  );
};

export default ThreeJSScene;
