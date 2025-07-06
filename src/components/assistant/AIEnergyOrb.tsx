
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AIEnergyOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

const EnergyCore: React.FC<AIEnergyOrbProps> = ({ isListening, isSpeaking, isProcessing }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      // Core pulsing based on state
      let intensity = 1;
      if (isListening) {
        intensity = 1 + Math.sin(time * 8) * 0.3;
      } else if (isSpeaking) {
        intensity = 1 + Math.sin(time * 6) * 0.2;
      } else if (isProcessing) {
        intensity = 1 + Math.sin(time * 10) * 0.4;
      } else {
        intensity = 1 + Math.sin(time * 2) * 0.1;
      }
      
      coreRef.current.scale.setScalar(intensity);
      coreRef.current.rotation.y = time * 0.5;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x = time * 0.3;
      ringsRef.current.rotation.z = -time * 0.2;
    }
  });

  const getColor = () => {
    if (isListening) return '#00ff88';
    if (isSpeaking) return '#ff6b35';
    if (isProcessing) return '#8b5cf6';
    return '#00bcd4';
  };

  const getEmissive = () => {
    if (isListening) return '#00ff44';
    if (isSpeaking) return '#ff4500'; 
    if (isProcessing) return '#7c3aed';
    return '#40e0d0';
  };

  return (
    <group>
      {/* Core energy sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Energy rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={getColor()}
            transparent={true}
            opacity={0.4}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.5, 0]}>
          <torusGeometry args={[3, 0.03, 16, 100]} />
          <meshBasicMaterial
            color={getColor()}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Outer wireframe sphere */}
      <mesh>
        <sphereGeometry args={[3.5, 16, 16]} />
        <meshBasicMaterial
          color={getColor()}
          wireframe={true}
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </group>
  );
};

const AIEnergyOrb: React.FC<AIEnergyOrbProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 0);
        }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#40e0d0" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00bcd4" />
        
        <EnergyCore {...props} />
      </Canvas>
    </div>
  );
};

export default AIEnergyOrb;
