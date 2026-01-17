import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls, useGLTF, Environment, Stars, ContactShadows, useAnimations, Center, Sparkles, Float, Cloud, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Loader2, Volume2, VolumeX, ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// --- ASET 1: MARS BASE ---
function MarsBase() {
  const { scene } = useGLTF('/city.glb'); 
  return (
    <group position={[0, -2, 0]} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={1} /> 
      <pointLight position={[0, 10, 0]} intensity={20} color="#ffaa00" distance={50} decay={2} />
    </group>
  );
}

// --- ASET 2: ASTRONAUT ---
function Astronaut() {
  const { scene, animations } = useGLTF('/astro.glb');
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) actions[Object.keys(actions)[0]]?.play();
  }, [actions]);
  return (
    <group ref={group} position={[5, -2, 5]} rotation={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={scene} scale={1.5} /> 
      </Float>
    </group>
  );
}

// --- ASET 3: ALIEN ---
function AlienVisitor() {
  const { scene, animations } = useGLTF('/alien.glb');
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) actions[Object.keys(actions)[0]]?.play();
  }, [actions]);
  return (
    <group ref={group} position={[-5, -2, 3]} rotation={[0, 0.5, 0]}>
      <primitive object={scene} scale={1.2} />
      <pointLight position={[0, 2, 0]} intensity={5} color="#00ff00" distance={8} />
    </group>
  );
}

// --- ASET 4: PORTAL ---
function SciFiPortal() {
  const { scene } = useGLTF('/portal.glb');
  return (
    <group position={[0, -2, -8]} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={1} />
      <Sparkles count={50} scale={[4, 6, 1]} size={5} speed={2} color="#00ffff" />
      <pointLight position={[0, 3, 0]} intensity={15} color="#00ffff" distance={15} />
    </group>
  );
}

// --- ASET 5: MARS ROVER ---
function MarsRover() {
  const { scene } = useGLTF('/rover.glb');
  return (
    <group position={[15, -2.5, 10]} rotation={[0, -0.5, 0]}>
      <primitive object={scene} scale={1.2} />
      <spotLight position={[0, 1, 1]} color="#ffffff" intensity={10} distance={10} angle={0.5} penumbra={0.5} />
    </group>
  );
}

// --- ASET 6: DRONE ---
function SurveillanceDrone() {
  const { scene } = useGLTF('/drone.glb');
  const droneRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (droneRef.current) {
      droneRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.5 + 4;
      droneRef.current.rotation.y += 0.02;
    }
  });
  return (
    <group ref={droneRef} position={[0, 4, 5]}>
       <primitive object={scene} scale={1.5} />
       <spotLight position={[0, -0.5, 0]} target-position={[0, -10, 0]} color="#ff0000" intensity={20} distance={20} angle={0.3} penumbra={0.5} />
       <pointLight position={[0, 0.5, 0]} color="#00ff00" intensity={5} distance={3} />
    </group>
  );
}

// --- ENVIRONMENT ---
function MarsEnvironment() {
  return (
    <group>
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <Cloud opacity={0.2} speed={0.2} width={100} depth={5} segments={20} color="#ff4500" position={[0, 20, -40]} />
      <directionalLight position={[50, 50, 25]} intensity={3} color="#ffaa00" castShadow />
      <ambientLight intensity={1.5} color="#442222" />
    </group>
  );
}

// --- UI LOADING ---
function LoadingScreen() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
      <h2 className="text-white text-xl font-bold tracking-[0.2em] animate-pulse">MARS MISSION</h2>
      <p className="text-orange-500 text-xs mt-2">Loading Assets... {progress.toFixed(0)}%</p>
    </div>
  );
}

export default function City() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- AUDIO LOGIC (UPDATED PATH) ---
  useEffect(() => {
    // Path diarahkan ke folder /audio/
    const audio = new Audio('/audio/astro.mp3'); 
    audio.loop = true; 
    audio.volume = 0.5; 
    
    audioRef.current = audio;

    audio.play().catch((error) => {
        console.log("Autoplay dicegah browser, perlu interaksi user dulu.");
    });

    return () => {
        audio.pause();
        audio.currentTime = 0;
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
        if (isMuted) {
            audioRef.current.play();
            audioRef.current.muted = false;
        } else {
            audioRef.current.muted = true;
        }
        setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <LoadingScreen />
      
      <Canvas shadows gl={{ antialias: true }} camera={{ position: [10, 5, 15], fov: 45 }}>
        <color attach="background" args={['#1a0505']} /> 
        <fog attach="fog" args={['#1a0505', 20, 300]} /> 

        <Suspense fallback={null}>
          <MarsEnvironment />
          <MarsBase />
          <Astronaut />
          <AlienVisitor />
          <SciFiPortal />
          <MarsRover />
          <SurveillanceDrone />
          
          <ContactShadows opacity={0.5} scale={40} blur={2} far={10} color="#000000" />
          <CameraControls makeDefault minDistance={5} maxDistance={100} maxPolarAngle={Math.PI / 2.1} />
        </Suspense>
      </Canvas>

      {/* --- UI OVERLAY --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
        <div>
            <h1 className="text-white text-4xl font-black uppercase tracking-tighter drop-shadow-lg">MARS <span className="text-orange-600">COLONY</span></h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-xs font-mono">SYSTEM ONLINE</span>
            </div>
        </div>

        <div className="flex gap-4 pointer-events-auto">
            <button 
                onClick={toggleSound}
                className="p-3 rounded-full bg-black/50 border border-white/10 hover:bg-orange-600 hover:border-orange-500 transition-all text-white backdrop-blur-md"
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            
            <button 
                onClick={() => navigate('/')}
                className="p-3 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-md"
            >
                <ArrowLeft size={24} />
            </button>
        </div>

      </div>
    </div>
  );
        }
