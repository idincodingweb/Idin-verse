/* FILE: src/components/3d/YumiCharacter.tsx */
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const YumiCharacter = ({ isVanishing }: { isVanishing: boolean }) => {
  // Pastikan nama file ini sesuai di folder public (huruf besar/kecil ngaruh!)
  const { scene } = useGLTF('/yumi.glb'); 
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      if (isVanishing) {
        // Efek Menghilang: Muter & Mengecil
        groupRef.current.rotation.y += 0.2;
        groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      } else {
        // Normal: Standby
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive 
        object={scene} 
        position={[0, -1.7, 0]} 
        scale={1.1}            
      />
    </group>
  );
};

// Preload biar gak loading lama
useGLTF.preload('/yumi.glb');

export default YumiCharacter;