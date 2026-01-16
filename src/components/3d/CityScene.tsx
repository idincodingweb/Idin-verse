import { Environment, ContactShadows, useGLTF, Float } from '@react-three/drei';
import { Suspense } from 'react';

// Helper Prop
function Prop({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: any) {
  const { scene } = useGLTF(url);
  const sceneClone = scene.clone(); 
  return <primitive object={sceneClone} scale={scale} position={position} rotation={rotation} />;
}

// Perhatikan: TIDAK ADA <Canvas> DISINI JUGA.
const CityScene = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Lighting Khusus Kota (Neon) */}
      <ambientLight intensity={0.5} color="#7c3aed" /> 
      <spotLight position={[5, 5, 5]} intensity={3} color="#ec4899" angle={0.5} />
      <Environment preset="night" background={false} />

      <Suspense fallback={null}>
         {/* 1. LANTAI GRID (PENGGANTI ASPAL SEMENTARA BIAR GA GELAP) */}
         <gridHelper args={[20, 20, 'cyan', 'purple']} position={[0, 0.1, 0]} />

         {/* 2. MOTOR (Gw kecilin scale-nya jaga-jaga) */}
         <Prop url="/bike.glb" scale={0.8} position={[-2.5, 0.2, 1]} rotation={[0, 0.8, 0]} />

         {/* 3. VENDING MACHINE */}
         <Float speed={2} rotationIntensity={0.1}>
            <Prop url="/vending.glb" scale={1.3} position={[2.5, 0.2, -1]} rotation={[0, -0.5, 0]} />
         </Float>

         {/* 4. SAMPAH */}
         <Prop url="/box.glb" scale={1.5} position={[3.5, 0, 1]} rotation={[0, 0.5, 0]} />
      </Suspense>

      <ContactShadows opacity={0.6} scale={20} blur={2} color="#000000" />
    </group>
  );
};

export default CityScene;