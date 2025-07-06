
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring, Text3D } from '@react-three/drei';
import * as THREE from 'three';

interface AIEnergyOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}

const EnergyCore: React.FC<AIEnergyOrbProps> = ({ isListening, isSpeaking, isProcessing }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle system
  const particles = React.useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Cyan-blue color palette
      colors[i * 3] = 0.0 + Math.random() * 0.3;     // R
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
      colors[i * 3 + 2] = 1.0;                       // B
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      // Core pulsing based on state
      let intensity = 1;
      if (isListening) {
        intensity = 1 + Math.sin(time * 8) * 0.3; // Fast pulse when listening
      } else if (isSpeaking) {
        intensity = 1 + Math.sin(time * 6) * 0.2; // Medium pulse when speaking
      } else if (isProcessing) {
        intensity = 1 + Math.sin(time * 10) * 0.4; // Rapid pulse when processing
      } else {
        intensity = 1 + Math.sin(time * 2) * 0.1; // Gentle breathing
      }
      
      coreRef.current.scale.setScalar(intensity);
      coreRef.current.rotation.y = time * 0.5;
    }

    if (ringsRef.current) {
      // Rings rotation
      ringsRef.current.rotation.x = time * 0.3;
      ringsRef.current.rotation.z = -time * 0.2;
      
      // Individual ring rotations
      ringsRef.current.children.forEach((ring, i) => {
        if (ring instanceof THREE.Mesh) {
          ring.rotation.y = time * (0.5 + i * 0.2);
        }
      });
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      
      // Update particle material
      const material = particlesRef.current.material as THREE.PointsMaterial;
      if (isListening) {
        material.size = 0.05 + Math.sin(time * 15) * 0.02;
      } else if (isSpeaking) {
        material.size = 0.03 + Math.sin(time * 10) * 0.015;
      } else {
        material.size = 0.02;
      }
    }
  });

  const getColor = () => {
    if (isListening) return '#00ff88';      // Green when listening
    if (isSpeaking) return '#ff6b35';       // Orange when speaking  
    if (isProcessing) return '#8b5cf6';     // Purple when processing
    return '#00bcd4';                       // Cyan default
  };

  const getEmissive = () => {
    if (isListening) return '#00ff44';
    if (isSpeaking) return '#ff4500'; 
    if (isProcessing) return '#7c3aed';
    return '#40e0d0';
  };

  return (
    <group>
      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core energy sphere */}
      <Sphere ref={coreRef} args={[1.5, 64, 64]}>
        <meshPhongMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>

      {/* Inner solid core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshPhongMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Energy rings */}
      <group ref={ringsRef}>
        {[0, 1, 2, 3].map((index) => (
          <Ring
            key={index}
            args={[2.5 + index * 0.8, 2.7 + index * 0.8, 64]}
            rotation={[Math.PI / 2 + index * 0.3, 0, index * 0.5]}
          >
            <meshBasicMaterial
              color={getColor()}
              transparent
              opacity={0.4 - index * 0.08}
              side={THREE.DoubleSide}
            />
          </Ring>
        ))}
      </group>

      {/* Outer wireframe sphere */}
      <Sphere args={[3.5, 32, 16]}>
        <meshBasicMaterial
          color={getColor()}
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
};

const AIEnergyOrb: React.FC<AIEnergyOrbProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#40e0d0" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00bcd4" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          color="#00ff88"
        />
        
        <EnergyCore {...props} />
        
        <fog attach="fog" args={['#000814', 5, 15]} />
      </Canvas>
    </div>
  );
};

export default AIEnergyOrb;
