import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Cloud, Float, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import { CloudRain, Home } from 'lucide-react';
import * as THREE from 'three';
import RainEffect from './RainEffect';
import TypewriterText from '../ui/TypewriterText';

// Animated fog component
const AnimatedFog = () => {
  const fogRef = useRef<THREE.Fog>(null);

  useFrame((state) => {
    if (fogRef.current) {
      // Subtle fog density animation
      const time = state.clock.getElapsedTime();
      fogRef.current.near = 5 + Math.sin(time * 0.3) * 2;
      fogRef.current.far = 25 + Math.sin(time * 0.2) * 5;
    }
  });

  return <fog ref={fogRef} attach="fog" args={['#0a1628', 8, 30]} />;
};

// Rain puddle with reflections
const RainPuddle = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 
        0.3 + Math.sin(time * 2 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.5 + Math.random() * 0.5, 32]} />
      <meshStandardMaterial
        color="#3a5a8a"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

// Village house component
const VillageHouse = ({ 
  position, 
  scale = 1,
  houseColor = '#1a1a3a',
  roofColor = '#2a1a3a',
  windowColor = '#ffa040'
}: { 
  position: [number, number, number];
  scale?: number;
  houseColor?: string;
  roofColor?: string;
  windowColor?: string;
}) => {
  return (
    <Float speed={0.3} floatIntensity={0.05}>
      <group position={position} scale={scale}>
        {/* House body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color={houseColor} roughness={0.7} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.3, 0.9, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.6} />
        </mesh>
        {/* Window glow */}
        <mesh position={[0, 0.5, 0.76]}>
          <planeGeometry args={[0.35, 0.35]} />
          <meshStandardMaterial
            color={windowColor}
            emissive={windowColor}
            emissiveIntensity={2}
          />
        </mesh>
        {/* Window light cone */}
        <pointLight 
          position={[0, 0.5, 1.2]} 
          intensity={0.5} 
          color={windowColor} 
          distance={3}
          decay={2}
        />
      </group>
    </Float>
  );
};

// Central lantern tower
const LanternTower = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.intensity = 2 + Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <Float speed={0.4} floatIntensity={0.1}>
      <group position={[0, 0, -5]}>
        {/* Tower base */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 1.6, 8]} />
          <meshStandardMaterial color="#1a2a4a" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Tower top */}
        <mesh position={[0, 2, 0]}>
          <coneGeometry args={[1, 1.2, 8]} />
          <meshStandardMaterial color="#2a3a5a" roughness={0.4} />
        </mesh>
        {/* Lantern */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color="#ff9060"
            emissive="#ff6030"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Tower light */}
        <pointLight 
          ref={lightRef}
          position={[0, 1.8, 0]} 
          intensity={2} 
          color="#ff8040" 
          distance={8}
          decay={2}
        />
      </group>
    </Float>
  );
};

const VillageScene = () => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: false }}
      >
        {/* Dark rainy environment */}
        <Environment preset="night" background />
        <AnimatedFog />
        
        {/* Dim ambient lighting for rainy atmosphere */}
        <ambientLight intensity={0.15} color="#4060a0" />
        
        {/* Moonlight through clouds */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.3} 
          color="#6080c0"
          castShadow
        />
        
        {/* Subtle blue rim light */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.1} 
          color="#4080ff"
        />

        {/* Moody clouds */}
        <Cloud
          position={[-4, 6, -5]}
          speed={0.2}
          opacity={0.5}
          segments={40}
          bounds={[10, 2, 2]}
          color="#2a3a5a"
        />
        <Cloud
          position={[4, 7, -8]}
          speed={0.15}
          opacity={0.4}
          segments={50}
          bounds={[12, 2, 3]}
          color="#1a2a4a"
        />
        <Cloud
          position={[0, 5, -3]}
          speed={0.25}
          opacity={0.3}
          segments={30}
          bounds={[8, 1.5, 2]}
          color="#3a4a6a"
        />

        {/* Rain effect */}
        <RainEffect count={4000} opacity={0.5} speed={12} />

        {/* Rain sparkles for extra atmosphere */}
        <Sparkles
          count={200}
          scale={[20, 15, 20]}
          size={0.4}
          speed={8}
          opacity={0.3}
          color="#80a0c0"
        />

        {/* Ground */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#0a1020" 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Rain puddles */}
        {[
          [-2, -0.48, 1],
          [3, -0.48, -1],
          [-1, -0.48, -2],
          [1.5, -0.48, 2],
          [-3, -0.48, -3],
        ].map((pos, i) => (
          <RainPuddle key={i} position={pos as [number, number, number]} />
        ))}

        {/* Village Houses */}
        <VillageHouse position={[-3.5, 0, -2]} scale={1} />
        <VillageHouse 
          position={[3.5, 0, -3]} 
          scale={1.2} 
          houseColor="#1a2a3a"
          roofColor="#2a2a4a"
          windowColor="#ff8060"
        />
        <VillageHouse 
          position={[-2, 0, -6]} 
          scale={0.9}
          houseColor="#2a1a3a"
          roofColor="#3a2a4a"
          windowColor="#ffb060"
        />
        <VillageHouse 
          position={[2.5, 0, -7]} 
          scale={0.8}
          houseColor="#1a3a3a"
          roofColor="#2a3a4a"
          windowColor="#ffa040"
        />

        {/* Central Lantern Tower */}
        <LanternTower />

        {/* Glowing fireflies/lanterns in the rain */}
        {[...Array(10)].map((_, i) => (
          <Float
            key={i}
            speed={0.5 + Math.random() * 0.5}
            floatIntensity={0.3}
          >
            <mesh
              position={[
                (Math.random() - 0.5) * 12,
                0.8 + Math.random() * 2,
                (Math.random() - 0.5) * 10 - 2,
              ]}
            >
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color="#ffcc80"
                emissive="#ff9040"
                emissiveIntensity={2}
              />
            </mesh>
          </Float>
        ))}
      </Canvas>

      {/* UI Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <div className="glass-card px-8 py-4 flex items-center gap-3">
            <CloudRain className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-sunset tracking-wider">
              DESA HUJAN
            </h1>
            <Home className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        {/* Bottom dialogue */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl pointer-events-auto"
        >
          <div className="glass-card-strong p-6">
            {/* Character indicator */}
            <div className="flex items-center gap-2 mb-3">
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-primary"
              />
              <span className="font-display text-sm text-primary tracking-wider">YUMI</span>
            </div>
            
            {/* Dialogue with typewriter */}
            <div className="min-h-[60px]">
              <TypewriterText
                text="Selamat datang di Desa Hujan... Di sini, hujan tak pernah berhenti. Tapi jangan khawatir, penduduk desa ini sangat ramah. Mari kita jelajahi bersama..."
                speed={45}
                className="text-foreground/90 text-lg leading-relaxed font-body"
              />
            </div>

            {/* Decorative rain drops */}
            <div className="absolute top-2 right-4 flex gap-1.5 opacity-50">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-0.5 h-3 bg-primary/60 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Rain overlay effect on UI */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 10px,
              hsla(210, 50%, 70%, 0.1) 10px,
              hsla(210, 50%, 70%, 0.1) 12px
            )`,
            animation: 'rain-fall 0.5s linear infinite',
          }}
        />
      </motion.div>

      {/* Vignette with blue tint for rainy mood */}
      <div 
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10, 20, 40, 0.7) 100%)',
        }}
      />

      {/* Rain animation keyframes */}
      <style>{`
        @keyframes rain-fall {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
      `}</style>
    </div>
  );
};

export default VillageScene;
