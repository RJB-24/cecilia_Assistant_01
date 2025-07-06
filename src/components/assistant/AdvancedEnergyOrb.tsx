
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface AdvancedEnergyOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  responseText: string;
}

const AdvancedEnergyOrb: React.FC<AdvancedEnergyOrbProps> = ({ 
  isListening, 
  isSpeaking, 
  responseText 
}) => {
  const mainCoreRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const particleSystemRef = useRef<THREE.Points>(null);
  const energyRingsRef = useRef<THREE.Group>(null);
  const floatingCubesRef = useRef<THREE.Group>(null);

  // Enhanced particle system
  const particleGeometry = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create spherical distribution with varying distances
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Dynamic colors
      colors[i3] = 0.2 + Math.random() * 0.8; // R
      colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
      colors[i3 + 2] = 1.0; // B
      
      sizes[i] = 1 + Math.random() * 3;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mouse = state.mouse;
    
    // Dynamic scaling and rotation based on state
    if (mainCoreRef.current) {
      let targetScale = 1;
      let rotationSpeed = 0.5;
      
      if (isListening) {
        targetScale = 1 + Math.sin(time * 10) * 0.2;
        rotationSpeed = 1.2;
      } else if (isSpeaking) {
        targetScale = 1 + Math.sin(time * 6) * 0.15;
        rotationSpeed = 0.8;
      } else {
        targetScale = 1 + Math.sin(time * 2) * 0.05;
      }
      
      mainCoreRef.current.scale.setScalar(targetScale);
      mainCoreRef.current.rotation.y = time * rotationSpeed;
      mainCoreRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      
      // Mouse interaction
      mainCoreRef.current.rotation.x += mouse.y * 0.1;
      mainCoreRef.current.rotation.y += mouse.x * 0.1;
    }

    // Inner core animation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -time * 0.7;
      innerCoreRef.current.rotation.z = time * 0.3;
      
      const pulseFactor = isListening ? 0.3 : isSpeaking ? 0.2 : 0.1;
      const scale = 0.6 + Math.sin(time * 8) * pulseFactor;
      innerCoreRef.current.scale.setScalar(scale);
    }

    // Outer shell animation
    if (outerShellRef.current) {
      outerShellRef.current.rotation.x = time * 0.2;
      outerShellRef.current.rotation.z = -time * 0.15;
      
      // Breathing effect
      const breathScale = 1 + Math.sin(time * 1.5) * 0.02;
      outerShellRef.current.scale.setScalar(breathScale);
    }

    // Particle system animation
    if (particleSystemRef.current) {
      particleSystemRef.current.rotation.y = time * 0.1;
      particleSystemRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Update particle material
      const material = particleSystemRef.current.material as THREE.PointsMaterial;
      if (isListening) {
        material.opacity = 0.9;
        material.size = 4;
      } else if (isSpeaking) {
        material.opacity = 0.7;
        material.size = 3;
      } else {
        material.opacity = 0.5;
        material.size = 2;
      }
    }

    // Energy rings animation
    if (energyRingsRef.current) {
      energyRingsRef.current.rotation.x = time * 0.3;
      energyRingsRef.current.rotation.z = -time * 0.2;
      
      energyRingsRef.current.children.forEach((ring, index) => {
        if (ring instanceof THREE.Mesh) {
          ring.rotation.y = time * (0.5 + index * 0.2);
          ring.position.y = Math.sin(time * 2 + index) * 0.1;
        }
      });
    }

    // Floating cubes animation
    if (floatingCubesRef.current) {
      floatingCubesRef.current.children.forEach((cube, index) => {
        if (cube instanceof THREE.Mesh) {
          const angle = time * 0.5 + index * (Math.PI * 2 / 8);
          const radius = 4 + Math.sin(time * 2 + index) * 0.5;
          
          cube.position.x = Math.cos(angle) * radius;
          cube.position.z = Math.sin(angle) * radius;
          cube.position.y = Math.sin(time * 3 + index) * 0.5;
          
          cube.rotation.x = time * (1 + index * 0.1);
          cube.rotation.y = time * (0.8 + index * 0.1);
          cube.rotation.z = time * (0.6 + index * 0.1);
        }
      });
    }
  });

  // Dynamic colors based on state
  const getMainColor = () => {
    if (isListening) return '#00ff88';
    if (isSpeaking) return '#ff6b35';
    return '#00bcd4';
  };

  const getEmissiveColor = () => {
    if (isListening) return '#00ff44';
    if (isSpeaking) return '#ff4500';
    return '#40e0d0';
  };

  const getSecondaryColor = () => {
    if (isListening) return '#88ff00';
    if (isSpeaking) return '#ffaa00';
    return '#0088ff';
  };

  return (
    <group>
      {/* Enhanced particle system */}
      <points ref={particleSystemRef} geometry={particleGeometry}>
        <pointsMaterial
          size={2}
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Main energy core - crystalline structure */}
      <Icosahedron ref={mainCoreRef} args={[2, 4]}>
        <meshPhongMaterial
          color={getMainColor()}
          emissive={getEmissiveColor()}
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
          wireframe
        />
      </Icosahedron>

      {/* Inner pulsing core */}
      <Sphere ref={innerCoreRef} args={[1.2, 32, 32]}>
        <meshPhongMaterial
          color={getMainColor()}
          emissive={getEmissiveColor()}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Outer wireframe shell */}
      <Icosahedron ref={outerShellRef} args={[3.5, 2]}>
        <meshBasicMaterial
          color={getSecondaryColor()}
          wireframe
          transparent
          opacity={0.3}
        />
      </Icosahedron>

      {/* Energy rings */}
      <group ref={energyRingsRef}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.8 + i * 0.3, 0.03, 8, 64]} />
            <meshPhongMaterial
              color={getMainColor()}
              emissive={getEmissiveColor()}
              emissiveIntensity={0.8}
              transparent
              opacity={0.4 - i * 0.06}
            />
          </mesh>
        ))}
      </group>

      {/* Floating geometric cubes */}
      <group ref={floatingCubesRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <RoundedBox key={`cube-${i}`} args={[0.15, 0.15, 0.15]} radius={0.02}>
            <meshPhongMaterial
              color={getSecondaryColor()}
              emissive={getEmissiveColor()}
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </RoundedBox>
        ))}
      </group>

      {/* Holographic data streams */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`stream-${i}`}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 5,
            Math.sin(i * 0.5) * 2,
            Math.sin((i / 12) * Math.PI * 2) * 5
          ]}
          rotation={[0, (i / 12) * Math.PI * 2, 0]}
        >
          <planeGeometry args={[0.1, 3]} />
          <meshBasicMaterial
            color={getMainColor()}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default AdvancedEnergyOrb;
