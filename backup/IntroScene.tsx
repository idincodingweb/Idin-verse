import { Canvas } from '@react-three/fiber';
import { Environment, Float, Stars } from '@react-three/drei';
import YumiCharacter from './YumiCharacter';
import MagicParticles from './MagicParticles';

interface IntroSceneProps {
  isVanishing: boolean;
}

const IntroScene = ({ isVanishing }: IntroSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 50 }}
      className="absolute inset-0"
      gl={{ antialias: true, alpha: false }}
    >
      {/* Sunset Environment */}
      <Environment preset="sunset" background />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      
      {/* Key light - warm sunset */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#ffa040"
        castShadow
      />
      
      {/* Fill light - cool blue */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.5}
        color="#4080ff"
      />
      
      {/* Rim light - pink */}
      <pointLight
        position={[0, 3, -3]}
        intensity={1}
        color="#ff6b9d"
      />

      {/* Stars in the sky */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Floating platform */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 64]} />
          <meshStandardMaterial
            color="#1a0a2a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        
        {/* Platform glow ring */}
        <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#ff6b9d"
            emissive="#ff6b9d"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>

      {/* Yumi Character */}
      <YumiCharacter isVanishing={isVanishing} />
      
      {/* Magic Particles (active during vanishing) */}
      <MagicParticles active={isVanishing} />
    </Canvas>
  );
};

export default IntroScene;
