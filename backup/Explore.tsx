import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls, useGLTF, Environment, Stars, ContactShadows, useAnimations, Center, Sparkles, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Skull, Zap, Sparkles as SparklesIcon, Ghost, Music, Eye, EyeOff, Play, Pause, Volume2, Flame, Map, User, ArrowUpCircle } from 'lucide-react';
import * as THREE from 'three';

// --- DATA POSISI KAMERA (PRESETS) ---
const VIEW_PRESETS = {
  overview: { pos: [15, 8, 15], target: [0, 0, 0], label: "Overview" },
  statue:   { pos: [7, 0, 4],   target: [3.5, -2, 1], label: "Guardian" }, // Zoom ke Patung
  fire:     { pos: [4, 1, 4],   target: [0, -1.5, 0], label: "Campfire" }, // Zoom ke Api
  top:      { pos: [0, 25, 1],  target: [0, 0, 0],    label: "Drone View" } // Tampak Atas
};

// --- 1. KEMAH UTAMA ---
function MainCampModel() {
  const { scene, animations } = useGLTF('/explore_world.glb'); 
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]]?.play();
    }
  }, [actions]);

  return (
    <group ref={group} position={[0, -2, 0]}>
      <primitive object={scene} scale={1.5} />
      <pointLight position={[0, 1, 0]} intensity={40} color="#ff5500" distance={20} decay={2} />
      <Sparkles count={40} scale={[1.5, 4, 1.5]} size={2} speed={2} color="#ffaa00" position={[0, 1, 0]} opacity={0.8} />
    </group>
  );
}

// --- 2. PATUNG LORO BLONYO ---
function PatungLoroBlonyo() {
  const { scene } = useGLTF('/patung_couple.glb');
  return (
    <group position={[3.5, -2, 1]} rotation={[0, 1.8, 0]}>
       <Center top>
          <primitive object={scene} scale={0.002} />
       </Center>
    </group>
  );
}

// --- 3. EFEK MISTIS ---
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

// --- 4. KUNANG-KUNANG ---
function Fireflies() {
  return (
    <Sparkles count={200} scale={[30, 10, 30]} size={4} speed={0.2} opacity={0.6} color="#ccff00" position={[0, 2, 0]} />
  );
}

// --- 5. KAMERA PINTAR (PENGGANTI ORBITCONTROLS) ---
function SmartCamera({ currentView }: { currentView: keyof typeof VIEW_PRESETS }) {
  const controlsRef = useRef<CameraControls>(null);

  // Efek Pindah Kamera Halus (Cinematic Transition)
  useEffect(() => {
    const targetView = VIEW_PRESETS[currentView];
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        targetView.pos[0], targetView.pos[1], targetView.pos[2], // Posisi Kamera
        targetView.target[0], targetView.target[1], targetView.target[2], // Titik Fokus
        true // TRUE = ANIMASI HALUS (Smooth)
      );
    }
  }, [currentView]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      minDistance={2} 
      maxDistance={100} 
      dollySpeed={0.5} // Zoom speed
      smoothTime={0.8} // Seberapa "licin" gerakannya
    />
  );
}

const Explore = () => {
  const [isSpiritMode, setSpiritMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFocusMode, setFocusMode] = useState(false);
  
  // STATE VIEW KAMERA (Default: Overview)
  const [view, setView] = useState<keyof typeof VIEW_PRESETS>('overview');

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      
      {/* 3D CANVAS */}
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isFocusMode ? 'scale-110' : 'scale-100'}`}>
        <Canvas shadows gl={{ antialias: true }} onCreated={({ scene }) => { scene.fog = new THREE.FogExp2('#020005', 0.008); }}> 
            <color attach="background" args={['#020005']} />
            <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={35} />
            
            <Stars radius={300} depth={60} count={8000} factor={4} saturation={0} fade speed={0.5} />
            <Environment preset="night" />
            <ambientLight intensity={0.15} color="#001133" />

            <Suspense fallback={null}>
                <MainCampModel />
                <PatungLoroBlonyo />
                <Fireflies />
                <MysticalAura active={isSpiritMode} />
                
                {/* PANGGIL KAMERA PINTAR DISINI */}
                <SmartCamera currentView={view} />

                <ContactShadows opacity={0.6} scale={40} blur={2.5} far={10} color="#000000" />
            </Suspense>
        </Canvas>
      </div>

      {/* VIGNETTE */}
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>

      {/* UI CONTAINER (PENTING: pointer-events-none biar bisa klik tembus ke 3D) */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* HEADER */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
            <h1 className="text-white text-3xl font-black uppercase tracking-tighter drop-shadow-lg">
              The <span className="text-orange-500">Campfire</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">Interactive Scene</span>
            </div>
          </div>
          <button onClick={() => window.history.back()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md">
            EXIT
          </button>
        </div>

        {/* --- MENU VIEW CONTROLLER (KANAN TENGAH) --- */}
        {/* Ini yang lo minta: Tombol buat pindah-pindah posisi */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
           {/* Tombol Overview */}
           <button onClick={() => setView('overview')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'overview' ? 'bg-orange-500 text-white border-orange-500 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'}`}>
              <Map size={20} />
           </button>
           {/* Tombol Patung */}
           <button onClick={() => setView('statue')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'statue' ? 'bg-cyan-500 text-white border-cyan-500 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'}`}>
              <User size={20} />
           </button>
           {/* Tombol Api */}
           <button onClick={() => setView('fire')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'fire' ? 'bg-red-500 text-white border-red-500 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'}`}>
              <Flame size={20} />
           </button>
           {/* Tombol Atas */}
           <button onClick={() => setView('top')} className={`p-3 rounded-full backdrop-blur-xl border transition-all ${view === 'top' ? 'bg-purple-500 text-white border-purple-500 scale-110 shadow-lg' : 'bg-black/40 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'}`}>
              <ArrowUpCircle size={20} />
           </button>
        </div>

        {/* BOTTOM DOCK (SETTINGS) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full pointer-events-auto shadow-2xl">
           {/* Toggle Mistik */}
           <button onClick={() => setSpiritMode(!isSpiritMode)} className={`p-3 rounded-xl transition-all ${isSpiritMode ? 'text-cyan-400 bg-cyan-900/30' : 'text-white/40'}`}>
             <Ghost size={20} />
           </button>
           <div className="w-[1px] h-6 bg-white/10"></div>
           {/* Toggle Fokus */}
           <button onClick={() => setFocusMode(true)} className="p-3 rounded-xl text-white/40 hover:text-white">
             <EyeOff size={20} />
           </button>
        </div>

        {/* AUDIO PLAYER (KIRI BAWAH) */}
        <div className="absolute bottom-8 left-8 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-xl flex items-center gap-3 w-48">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-orange-500' : 'bg-white/10'}`}>
              <Music size={14} className="text-white" />
           </div>
           <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-white text-[10px] font-bold">Midnight Poetry</span>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                 <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
              </div>
           </div>
           <button onClick={() => setIsPlaying(!isPlaying)} className="text-white/70 hover:text-white">
              {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
           </button>
        </div>

      </div>

      {/* EXIT FOCUS BUTTON (HIDDEN) */}
      {isFocusMode && (
         <button 
           onClick={() => setFocusMode(false)}
           className="absolute top-6 right-6 z-50 pointer-events-auto bg-black/40 text-white p-3 rounded-full border border-white/20 backdrop-blur-md"
         >
           <Eye size={20} />
         </button>
      )}

    </div>
  );
};

export default Explore;