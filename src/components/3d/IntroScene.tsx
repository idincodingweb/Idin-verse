/* FILE: src/components/3d/IntroScene.tsx */
import { Environment, ContactShadows } from '@react-three/drei';
import YumiCharacter from './YumiCharacter';

const IntroScene = ({ isVanishing }: { isVanishing: boolean }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Lighting Dramatis buat Yumi */}
      <ambientLight intensity={0.5} color="#4c1d95" /> 
      <spotLight position={[5, 5, 5]} intensity={3} color="#ec4899" angle={0.5} penumbra={1} />
      <spotLight position={[-5, 5, 5]} intensity={3} color="#3b82f6" angle={0.5} penumbra={1} />
      
      {/* Environment Gelap */}
      <Environment preset="night" background={false} />

      {/* Panggil Yumi Disini */}
      <YumiCharacter isVanishing={isVanishing} />

      {/* Bayangan Lantai */}
      <ContactShadows opacity={0.6} scale={10} blur={2} color="#000000" />
    </group>
  );
};

export default IntroScene;