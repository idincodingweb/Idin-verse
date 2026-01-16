import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainEffectProps {
  count?: number;
  opacity?: number;
  speed?: number;
}

const RainEffect = ({ count = 5000, opacity = 0.6, speed = 15 }: RainEffectProps) => {
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread rain across a wide area
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Random fall speed variation
      velocities[i] = 0.5 + Math.random() * 0.5;
    }

    return { positions, velocities };
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move rain down
      positions[i * 3 + 1] -= speed * delta * particles.velocities[i];

      // Reset position when rain falls below ground
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3 + 1] = 15 + Math.random() * 5;
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a0c4e8"
        size={0.08}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default RainEffect;
