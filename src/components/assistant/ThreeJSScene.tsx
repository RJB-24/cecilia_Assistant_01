
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeJSSceneProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

// This component is isolated to prevent Lovable tagging conflicts
const ThreeJSScene: React.FC<ThreeJSSceneProps> = ({ isListening, isSpeaking, responseText }) => {
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
    <>
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
      
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere key={i} args={[0.05]} position={[
          Math.sin(i) * 3,
          Math.cos(i) * 3,
          Math.sin(i * 0.5) * 3
        ]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </Sphere>
      ))}

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
    </>
  );
};

export default ThreeJSScene;
