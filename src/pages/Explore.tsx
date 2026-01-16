import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls, useGLTF, Environment, Stars, ContactShadows, useAnimations, Center, Sparkles, Float, Cloud, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Ghost, Music, Eye, EyeOff, Play, Pause, Flame, Map, User, Swords, Loader2, Skull, Search, Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';

// --- DATA POSISI KAMERA ---
const VIEW_PRESETS = {
  overview: { pos: [15, 8, 15], target: [0, 0, 0], label: "Overview" },
  statue:   { pos: [7, 0, 4],   target: [3.5, -2, 1], label: "Guardian" },
  fire:     { pos: [4, 1, 4],   target: [0, -1.5, 0], label: "Campfire" },
  keris:    { pos: [4.5, -1.0, 3.0], target: [4.1, -1.8, 1.5], label: "Keris Pusaka" },
  ghost:    { pos: [-4, 0, 4], target: [-6, 1, -2], label: "The Ritual" },
  mystery:  { pos: [12, 0, -2], target: [8, -1.5, -8], label: "Grim Discovery" } 
};

// --- ☠️ TENGKORAK MISTIS (SENDIRIAN) ---
function SkeletonRemains() {
  const { scene } = useGLTF('/bones.glb');
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
     if (lightRef.current) {
        lightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 2) * 0.5;
     }
  });
  
  return (
    <group position={[8, -2.0, -8]} rotation={[0, 2.5, 0]}>
       <Center top> <primitive object={scene} scale={0.7} /> </Center>
       <Cloud opacity={0.5} speed={0.2} width={3} depth={0.5} segments={10} position={[0, -0.2, 0]} color="#00ffaa" />
       <Sparkles count={30} scale={[2, 2, 2]} size={3} speed={0.3} opacity={0.7} color="#00ffff" noise={0.5} />
       <pointLight ref={lightRef} position={[0, 1.5, 0]} intensity={2.5} color="#00ffaa" distance={5} decay={2} />
    </group>
  );
}

// --- KUNTILANAK RITUAL ---
function RitualKuntilanak() {
  const { scene } = useGLTF('/kuntilanak.glb');
  const leftHandOrb = useRef<THREE.Group>(null);
  const rightHandOrb = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bodyRef.current) bodyRef.current.position.y = Math.sin(t * 3) * 0.2; 
    if (leftHandOrb.current && rightHandOrb.current) {
       leftHandOrb.current.position.y = Math.sin(t * 5) * 0.5 + 1.2; 
       leftHandOrb.current.position.x = Math.cos(t * 3) * 0.3 - 0.5; 
       rightHandOrb.current.position.y = Math.sin(t * 5 + 2) * 0.5 + 1.2; 
       rightHandOrb.current.position.x = Math.cos(t * 3) * 0.3 + 0.5;
    }
  });

  return (
    <group position={[-6, 0, -2]} rotation={[0, 1, 0]}>
       <group ref={bodyRef}><primitive object={scene} scale={95} /></group>
       <group ref={leftHandOrb} position={[-0.5, 1.2, 0.2]}>
          <pointLight color="#ff0000" intensity={5} distance={2} decay={2} />
          <Sparkles count={10} scale={[0.5, 0.5, 0.5]} size={6} speed={5} color="#ff0000" />
       </group>
       <group ref={rightHandOrb} position={[0.5, 1.2, 0.2]}>
          <pointLight color="#ff0000" intensity={5} distance={2} decay={2} />
          <Sparkles count={10} scale={[0.5, 0.5, 0.5]} size={6} speed={5} color="#ff0000" />
       </group>
       <Sparkles count={60} scale={[3, 4, 3]} size={8} speed={3} opacity={0.6} color="#ff0000" position={[0, 1, 0]} />
       <Cloud opacity={0.3} speed={1} width={2} depth={1} segments={5} position={[0, 0.5, 0]} color="#330000" />
       <spotLight position={[0, -2, 2]} color="#aaffaa" intensity={8} distance={6} angle={0.6} penumbra={1} />
    </group>
  );
}

// --- KERIS PUSAKA ---
function KerisPusaka() {
  const { scene } = useGLTF('/keris.glb');
  return (
    <group position={[4.1, -2.0, 1.5]} rotation={[0, -0.5, 0]}>
       <Center top> <primitive object={scene} scale={0.014} /> </Center>
       <pointLight position={[0, 0.5, 0]} intensity={3} color="#ff0000" distance={2} decay={2} />
       <Sparkles count={15} scale={[0.5, 0.8, 0.5]} size={4} color="#ff0000" speed={1} opacity={0.8} />
    </group>
  );
}

// --- LOADER ---
function MysticalLoader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);
  if (!show) return null;
  return (
    <div className={`absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center gap-4">
         <Loader2 size={48} className="text-red-600 animate-spin" />
         <div className="text-center">
            <h2 className="text-white text-xl font-black tracking-[0.2em] animate-pulse">MEMBUKA MATA BATIN</h2>
            <p className="text-red-500 text-xs font-mono mt-2">Memuat Aset Gaib... {progress.toFixed(0)}%</p>
         </div>
         <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
         </div>
      </div>
    </div>
  );
}

// --- ENVIRONMENT ---
function ProceduralSkybox() {
  return (
    <group>
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <group position={[0, 10, -50]}>
         <Cloud opacity={0.3} speed={0.1} width={40} depth={5} segments={20} color="#4c1d95" position={[-20, 10, -20]} />
         <Cloud opacity={0.3} speed={0.1} width={40} depth={5} segments={20} color="#0891b2" position={[20, -5, -20]} />
         <Cloud opacity={0.2} speed={0.2} width={30} depth={5} segments={10} color="#be185d" position={[0, 20, -30]} />
      </group>
      <Sparkles count={500} scale={[100, 50, 100]} size={4} speed={0.2} opacity={0.5} color="#ffffff" position={[0, 20, -50]} />
    </group>
  );
}

function MainCampModel() {
  const { scene, animations } = useGLTF('/explore_world.glb'); 
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);
  useEffect(() => { if (actions && Object.keys(actions).length > 0) actions[Object.keys(actions)[0]]?.play(); }, [actions]);
  return (
    <group ref={group} position={[0, -2, 0]}>
      <primitive object={scene} scale={1.5} />
      <pointLight position={[0, 1, 0]} intensity={40} color="#ff5500" distance={20} decay={2} />
      <Sparkles count={40} scale={[1.5, 4, 1.5]} size={2} speed={2} color="#ffaa00" position={[0, 1, 0]} opacity={0.8} />
    </group>
  );
}

function PatungLoroBlonyo() {
  const { scene } = useGLTF('/patung_couple.glb');
  return (
    <group position={[3.5, -2, 1]} rotation={[0, 1.8, 0]}>
       <Center top> <primitive object={scene} scale={0.002} /> </Center>
    </group>
  );
}

function MysticalAura({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <group position={[3.5, -2, 1]}>
      <pointLight position={[0, 1, 0]} intensity={10} color="#00ffff" distance={6} decay={2} />
      <pointLight position={[0.5, 2, 0.5]} intensity={8} color="#bd00ff" distance={5} decay={2} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sparkles count={60} scale={[3, 5, 3]} size={3} speed={0.4} opacity={0.7} color="#00ffff" />
        <Sparkles count={30} scale={[2, 4, 2]} size={2} speed={0.6} opacity={0.5} color="#bd00ff" />
      </Float>
    </group>
  );
}

function Fireflies() {
  return <Sparkles count={200} scale={[30, 10, 30]} size={4} speed={0.2} opacity={0.6} color="#ccff00" position={[0, 2, 0]} />;
}

function SmartCamera({ currentView }: { currentView: keyof typeof VIEW_PRESETS }) {
  const controlsRef = useRef<CameraControls>(null);
  useEffect(() => {
    const targetView = VIEW_PRESETS[currentView];
    if (controlsRef.current) {
      controlsRef.current.setLookAt(targetView.pos[0], targetView.pos[1], targetView.pos[2], targetView.target[0], targetView.target[1], targetView.target[2], true);
    }
  }, [currentView]);
  return <CameraControls ref={controlsRef} makeDefault minDistance={2} maxDistance={100} dollySpeed={0.5} smoothTime={0.8} />;
}

// --- MAIN EXPLORE PAGE ---
const Explore = () => {
  const [isSpiritMode, setSpiritMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFocusMode, setFocusMode] = useState(false);
  const [view, setView] = useState<keyof typeof VIEW_PRESETS>('overview');

  // --- AUDIO REFS (DUAL CHANNEL) ---
  const gamelanRef = useRef<HTMLAudioElement | null>(null);
  const ketawaRef = useRef<HTMLAudioElement | null>(null);

  // Fungsi Play/Pause barengan
  const toggleAudio = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
        gamelanRef.current?.play();
        ketawaRef.current?.play();
    } else {
        gamelanRef.current?.pause();
        ketawaRef.current?.pause();
    }
  };

  // Autoplay saat load
  useEffect(() => {
    // Set Volume Awal
    if (gamelanRef.current) gamelanRef.current.volume = 0.6; // Background
    if (ketawaRef.current) ketawaRef.current.volume = 0.8; // Lebih kenceng dikit

    // Coba Play
    const playPromise = gamelanRef.current?.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            setIsPlaying(true);
            ketawaRef.current?.play();
        }).catch(error => {
            console.log("Autoplay blocked. User must interact.", error);
            setIsPlaying(false);
        });
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      <MysticalLoader />
      
      {/* --- DUAL AUDIO SOURCES --- */}
      {/* Pastikan file ada di folder public/audio/ */}
      <audio ref={gamelanRef} src="/audio/gamelan.mp3" loop />
      <audio ref={ketawaRef} src="/audio/ketawa.mp3" loop />

      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isFocusMode ? 'scale-110' : 'scale-100'}`}>
        <Canvas shadows gl={{ antialias: true }} onCreated={({ scene }) => { 
            scene.background = new THREE.Color('#000000'); 
            scene.fog = new THREE.FogExp2('#000000', 0.002); 
        }}> 
            <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={35} far={1000} />
            <Environment preset="night" />
            <ambientLight intensity={0.1} color="#001133" />

            <Suspense fallback={null}>
                <ProceduralSkybox />
                <MainCampModel />
                <PatungLoroBlonyo />
                <Fireflies />
                <MysticalAura active={isSpiritMode} />
                <KerisPusaka />
                <RitualKuntilanak />
                <SkeletonRemains />
                
                <SmartCamera currentView={view} />
                <ContactShadows opacity={0.6} scale={40} blur={2.5} far={10} color="#000000" />
            </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>

      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
            <h1 className="text-white text-3xl font-black uppercase tracking-tighter drop-shadow-lg">The <span className="text-orange-500">Campfire</span></h1>
            <div className="flex items-center gap-2 mt-1"><div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div><span className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">Paranormal Activity Detected</span></div>
          </div>
          <button onClick={() => window.history.back()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md">EXIT</button>
        </div>

        {/* MENU VIEW */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
           <button onClick={() => setView('overview')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'overview' ? 'bg-orange-500 text-white border-orange-500 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10'}`}><Map size={20} /></button>
           <button onClick={() => setView('mystery')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'mystery' ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10'}`}><Search size={20} /></button>
           <button onClick={() => setView('keris')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'keris' ? 'bg-red-600 text-white border-red-600 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10'}`}><Swords size={20} /></button>
           <button onClick={() => setView('ghost')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'ghost' ? 'bg-green-900 text-green-400 border-green-600 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10'}`}><Skull size={20} /></button>
           <button onClick={() => setView('fire')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'fire' ? 'bg-orange-700 text-white border-orange-700 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10'}`}><Flame size={20} /></button>
        </div>

        {/* Audio Player Dock (Update UI) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full pointer-events-auto shadow-2xl">
           <button onClick={() => setSpiritMode(!isSpiritMode)} className={`p-3 rounded-xl transition-all ${isSpiritMode ? 'text-cyan-400 bg-cyan-900/30' : 'text-white/40'}`}><Ghost size={20} /></button>
           <div className="w-[1px] h-6 bg-white/10"></div>
           <button onClick={() => setFocusMode(true)} className="p-3 rounded-xl text-white/40 hover:text-white"><EyeOff size={20} /></button>
        </div>
        <div className="absolute bottom-8 left-8 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-xl flex items-center gap-3 w-48">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-white/10'}`}><Music size={14} className="text-white" /></div>
           <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-white text-[10px] font-bold">Ritual Gamelan</span>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1"><div className={`h-full bg-red-600 rounded-full transition-all duration-300 ${isPlaying ? 'w-full' : 'w-0'}`}></div></div>
           </div>
           {/* Tombol Control Dual Audio */}
           <button onClick={toggleAudio} className="text-white/70 hover:text-white">
              {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
           </button>
        </div>
      </div>
      {isFocusMode && <button onClick={() => setFocusMode(false)} className="absolute top-6 right-6 z-50 pointer-events-auto bg-black/40 text-white p-3 rounded-full border border-white/20 backdrop-blur-md"><Eye size={20} /></button>}
    </div>
  );
};

export default Explore;