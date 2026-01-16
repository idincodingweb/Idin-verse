import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface MagicParticlesProps {
  active: boolean;
}

const MagicParticles = ({ active }: MagicParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const startTime = useRef<number | null>(null);

  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 0.3;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (!active || !pointsRef.current) return;

    if (startTime.current === null) {
      startTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const progress = Math.min(elapsed / 1.5, 1);

    pointsRef.current.scale.setScalar(1 + progress * 3);
    (pointsRef.current.material as THREE.PointsMaterial).opacity = 1 - progress;

    // Rotate particles outward
    pointsRef.current.rotation.y += 0.05;
    pointsRef.current.rotation.x += 0.02;
  });

  if (!active) return null;

  return (
    <Points ref={pointsRef} positions={particles}>
      <PointMaterial
        transparent
        color="#ff6b9d"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default MagicParticles;
