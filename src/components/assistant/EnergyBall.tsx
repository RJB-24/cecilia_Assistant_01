
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface EnergyBallProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const EnergyBall: React.FC<EnergyBallProps> = ({ isListening, isSpeaking, responseText }) => {
  const mainSphereRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle system for energy effect
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      // Create spherical distribution
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (mainSphereRef.current) {
      // Main sphere rotation and scaling
      mainSphereRef.current.rotation.y = time * 0.3;
      mainSphereRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Dynamic scaling based on state
      let targetScale = 1;
      if (isListening) {
        targetScale = 1 + Math.sin(time * 8) * 0.15; // Fast pulse when listening
      } else if (isSpeaking) {
        targetScale = 1 + Math.sin(time * 4) * 0.1; // Medium pulse when speaking
      } else {
        targetScale = 1 + Math.sin(time * 2) * 0.05; // Gentle breathing effect
      }
      
      mainSphereRef.current.scale.setScalar(targetScale);
    }

    if (innerCoreRef.current) {
      // Inner core counter-rotation
      innerCoreRef.current.rotation.y = -time * 0.5;
      innerCoreRef.current.rotation.z = time * 0.2;
      
      // Inner core pulsing
      const coreScale = 0.3 + Math.sin(time * 6) * 0.1;
      innerCoreRef.current.scale.setScalar(coreScale);
    }

    if (outerRingRef.current) {
      // Outer ring rotation
      outerRingRef.current.rotation.x = time * 0.1;
      outerRingRef.current.rotation.z = -time * 0.15;
    }

    if (particlesRef.current) {
      // Animate particles
      particlesRef.current.rotation.y = time * 0.1;
      
      // Update particle material opacity based on state
      const material = particlesRef.current.material as THREE.PointsMaterial;
      if (isListening) {
        material.opacity = 0.8 + Math.sin(time * 10) * 0.2;
      } else if (isSpeaking) {
        material.opacity = 0.6 + Math.sin(time * 5) * 0.3;
      } else {
        material.opacity = 0.4;
      }
    }
  });

  // Dynamic colors based on state
  const getMainColor = () => {
    if (isListening) return '#00ff88'; // Bright green when listening
    if (isSpeaking) return '#ff6b35'; // Orange when speaking
    return '#00bcd4'; // Cyan default (matching your inspiration)
  };

  const getEmissiveColor = () => {
    if (isListening) return '#00ff88';
    if (isSpeaking) return '#ff4500';
    return '#40e0d0';
  };

  return (
    <group>
      {/* Particle system for energy effect */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={getMainColor()}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Main energy sphere */}
      <Icosahedron ref={mainSphereRef} args={[2, 4]}>
        <meshPhongMaterial
          color={getMainColor()}
          emissive={getEmissiveColor()}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          wireframe
        />
      </Icosahedron>

      {/* Inner core */}
      <Sphere ref={innerCoreRef} args={[0.8, 32, 32]}>
        <meshPhongMaterial
          color={getMainColor()}
          emissive={getEmissiveColor()}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Outer ring structure */}
      <group ref={outerRingRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 3,
              0,
              Math.sin((i / 8) * Math.PI * 2) * 3
            ]}
            rotation={[0, (i / 8) * Math.PI * 2, 0]}
          >
            <boxGeometry args={[0.1, 0.1, 0.5]} />
            <meshPhongMaterial
              color={getMainColor()}
              emissive={getEmissiveColor()}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Energy rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5 + i * 0.5, 0.02, 8, 64]} />
          <meshPhongMaterial
            color={getMainColor()}
            emissive={getEmissiveColor()}
            emissiveIntensity={0.6}
            transparent
            opacity={0.3 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export default EnergyBall;
