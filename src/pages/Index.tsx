import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, useGLTF, Environment, ContactShadows, useAnimations, Float, Sparkles, useProgress, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Ghost, ChevronRight, Trophy, Loader2, Rocket, Lock, Unlock, User } from 'lucide-react'; 

// --- 1. MODEL YUMI ---
function YumiHost() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/yumi.glb');
  const { actions } = useAnimations(animations, group);
  
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} position={[2, -2, 0]} rotation={[0, -0.5, 0]}>
       <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
         <primitive object={scene} scale={1.3} />
       </Float>
       <spotLight position={[-2, 5, 2]} color="#ff00ff" intensity={50} angle={0.5} penumbra={1} />
    </group>
  );
}

// --- 2. LOADING KECIL ---
function TinyLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex items-center gap-2 text-white/50 text-xs font-mono bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
        <Loader2 size={12} className="animate-spin" />
        LOADING HOST... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// --- 3. MAIN MENU ---
const Index = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  // --- FUNGSI BUKA GEMBOK & PLAY AUDIO ---
  const handleUnlock = () => {
    setIsLocked(false);
    
    // [FIX] Jalur Audio diarahkan ke folder /audio/
    const audio = new Audio('/audio/welcome.mp3'); 
    audio.volume = 1.0; // Volume Full
    
    audio.play().catch((e) => {
        console.log("Gagal play audio:", e);
    });
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      
      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true }} onCreated={({ scene }) => { scene.fog = new THREE.FogExp2('#050505', 0.02); }}> 
            <color attach="background" args={['#050505']} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.2} autoRotate autoRotateSpeed={0.5} />
            
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            
            <Suspense fallback={<TinyLoader />}>
                <YumiHost />
                <ContactShadows opacity={0.5} scale={10} blur={2.5} far={10} color="#000000" />
                <Sparkles count={100} scale={[10, 10, 10]} size={2} speed={0.5} opacity={0.5} color="#ffffff" />
            </Suspense>
        </Canvas>
      </div>

      {/* --- LAYER 1: LAYAR GEMBOK --- */}
      <div 
        onClick={handleUnlock}
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-1000 cursor-pointer ${isLocked ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 animate-pulse transition-opacity"></div>
            <div className="relative bg-black/50 border border-purple-500/50 p-6 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                {isLocked ? <Lock size={48} /> : <Unlock size={48} />}
            </div>
          </div>
          
          <h2 className="mt-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 tracking-[0.2em] animate-pulse">
            TAP TO OPEN WORLD
          </h2>
          <p className="text-white/30 text-xs mt-2 font-mono">INITIALIZING IDINVERSE SYSTEM</p>
      </div>

      {/* --- LAYER 2: MENU UTAMA --- */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-24 transition-all duration-1000 transform ${isLocked ? 'blur-xl scale-95 opacity-30 pointer-events-none' : 'blur-0 scale-100 opacity-100 pointer-events-auto'}`}>
         
         <div className="mb-10">
            <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] italic tracking-tighter">
               IDIN<span className="text-white">VERSE</span>
            </h1>
            <p className="text-white/50 text-sm md:text-base font-bold tracking-[0.5em] mt-2 border-l-4 border-pink-500 pl-4 uppercase">
               Interactive 3D Experience
            </p>
         </div>

         <div className="flex flex-col gap-4 w-full max-w-md">
            
            {/* MENU 1: MARS COLONY */}
            <MenuButton 
               title="MARS COLONY" 
               subtitle="Red Planet Exploration"
               icon={<Rocket size={24} className="text-orange-500" />} 
               color="orange"
               onClick={() => navigate('/city')}
               isHovered={hovered === 'city'}
               onMouseEnter={() => setHovered('city')}
               onMouseLeave={() => setHovered(null)}
            />

            {/* MENU 2: MYSTICAL CAMP */}
            <MenuButton 
               title="MYSTICAL CAMP" 
               subtitle="Javanese Horror & Artifacts"
               icon={<Ghost size={24} className="text-purple-400" />}
               color="purple"
               onClick={() => navigate('/explore')}
               isHovered={hovered === 'camp'}
               onMouseEnter={() => setHovered('camp')}
               onMouseLeave={() => setHovered(null)}
            />

            {/* MENU 3: ABOUT CREATOR */}
            <MenuButton 
               title="ABOUT CREATOR" 
               subtitle="The Mind Behind IdinVerse"
               icon={<User size={24} className="text-cyan-400" />}
               color="cyan"
               onClick={() => navigate('/about')}
               isHovered={hovered === 'about'}
               onMouseEnter={() => setHovered('about')}
               onMouseLeave={() => setHovered(null)}
            />

            {/* MENU 4: LOCKED */}
            <div className="opacity-50 grayscale cursor-not-allowed">
               <MenuButton 
                  title="LOCKED LEVEL" 
                  subtitle="Coming Soon in Update v2.0"
                  icon={<Trophy size={24} className="text-gray-400" />}
                  color="gray"
                  onClick={() => {}}
                  isHovered={false}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
               />
            </div>
         </div>
      </div>
    </div>
  );
};

// --- COMPONENT BUTTON ---
const MenuButton = ({ title, subtitle, icon, color, onClick, isHovered, onMouseEnter, onMouseLeave }: any) => {
   const colors: any = {
      orange: "hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:bg-orange-950/30",
      purple: "hover:border-purple-500 hover:shadow-[0_0_30px_rgba(192,132,252,0.3)] hover:bg-purple-950/30",
      cyan:   "hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:bg-cyan-950/30",
      gray:   "border-white/5 bg-black/20"
   };

   return (
      <button 
         onClick={onClick}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         className={`relative group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 transform ${isHovered ? 'scale-105 translate-x-4' : ''} ${colors[color]}`}
      >
         <div className={`p-3 rounded-lg bg-black/50 border border-white/5`}>{icon}</div>
         <div className="flex flex-col items-start flex-1">
            <h3 className={`text-lg font-black italic uppercase text-white group-hover:text-${color}-400 transition-colors`}>{title}</h3>
            <p className="text-xs text-white/40 font-medium tracking-wider">{subtitle}</p>
         </div>
         {color !== 'gray' && (
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300 text-${color}-400`}>
                <ChevronRight size={24} />
            </div>
         )}
      </button>
   )
}

useGLTF.preload('/yumi.glb');
export default Index;
