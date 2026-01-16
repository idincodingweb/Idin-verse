import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, useGLTF, Environment, ContactShadows, Sky, Cloud, Float, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Video, Map, Eye, Navigation, ArrowLeft, Sun, Volume2, VolumeX, Loader2, Building2 } from 'lucide-react'; 

// --- LOADER ---
function CityLoader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
       const timer = setTimeout(() => setShow(false), 1000);
       return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!show) return null;

  return (
    <div className={`absolute inset-0 z-[100] bg-[#87CEEB] flex flex-col items-center justify-center transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="relative">
             <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
             <Building2 size={64} className="text-white relative z-10" />
          </div>
          <div className="text-center space-y-2">
             <h2 className="text-white text-2xl font-black tracking-widest uppercase drop-shadow-md">Karawang City</h2>
             <div className="flex items-center gap-2 text-white/80 font-mono text-xs bg-black/10 px-3 py-1 rounded-full">
                <Loader2 size={12} className="animate-spin" />
                LOADING ASSETS... {progress.toFixed(0)}%
             </div>
          </div>
          <div className="w-64 h-2 bg-black/10 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ width: `${progress}%` }}></div>
          </div>
       </div>
    </div>
  );
}

// --- CAMERA RIG ---
function CameraRig({ viewMode, controlsRef }: { viewMode: string, controlsRef: any }) {
  const vec = new THREE.Vector3();
  const targetVec = new THREE.Vector3();

  useFrame((state) => {
    if (!controlsRef.current) return;
    let targetPos = [25, 15, 25]; 
    let lookAt = [0, 5, 0];
    if (viewMode === 'STREET') { targetPos = [8, 0.5, 10]; lookAt = [15, 0, -5]; }
    else if (viewMode === 'DRONE') { targetPos = [0, 60, 10]; lookAt = [0, 0, 0]; }
    else if (viewMode === 'SIDE') { targetPos = [-35, 10, 5]; lookAt = [0, 8, 0]; }
    else if (viewMode === 'WIDE') { targetPos = [25, 15, 25]; lookAt = [0, 5, 0]; }
    state.camera.position.lerp(vec.set(targetPos[0], targetPos[1], targetPos[2]), 0.05);
    controlsRef.current.target.lerp(targetVec.set(lookAt[0], lookAt[1], lookAt[2]), 0.05);
    controlsRef.current.update();
  });
  return null;
}

// --- LANGIT ---
function DaySky() {
  return (
    <group>
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0} azimuth={0.25} rayleigh={2} turbidity={0.5} />
      <group position={[0, 30, 0]}>
         <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}><Cloud opacity={0.6} speed={0.4} width={30} depth={5} segments={20} position={[-20, 0, -20]} color="#ffffff" /></Float>
         <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.5}><Cloud opacity={0.6} speed={0.3} width={40} depth={5} segments={20} position={[20, 5, -30]} color="#ffffff" /></Float>
         <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.5}><Cloud opacity={0.5} speed={0.4} width={20} depth={5} segments={10} position={[0, -5, 20]} color="#ffffff" /></Float>
      </group>
    </group>
  );
}

// --- MODEL ---
function CityModel() {
  const { scene } = useGLTF('/city.glb');
  return <group position={[0, -2.5, 0]}><primitive object={scene} scale={1} /></group>;
}

// --- MAIN COMPONENT ---
const City = () => {
  const [viewMode, setViewMode] = useState('WIDE');
  const [isMuted, setIsMuted] = useState(false);
  const controlsRef = useRef<any>(null); 
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // --- LOGIC AUDIO SAKTI ---
  const tryPlayAudio = () => {
    if (bgmRef.current) {
        bgmRef.current.volume = 0.4;
        bgmRef.current.play()
            .then(() => setIsMuted(false)) // Berhasil Play -> Unmute
            .catch(() => setIsMuted(true)); // Gagal Play -> Mute
    }
  }

  // 1. Coba play pas loading pertama kali
  useEffect(() => {
    tryPlayAudio();
  }, []);

  // 2. JURUS PAMUNGKAS: Global Click Handler
  // Kalau user klik DI MANA AJA di halaman ini, kita paksa audionya nyala
  const handleGlobalClick = () => {
      if (bgmRef.current && bgmRef.current.paused) {
          tryPlayAudio();
      }
  };

  const toggleMute = (e: any) => {
    e.stopPropagation(); // Biar gak bentrok sama global click
    if (bgmRef.current) {
        bgmRef.current.muted = !bgmRef.current.muted;
        setIsMuted(bgmRef.current.muted);
        if (!bgmRef.current.muted) tryPlayAudio();
    }
  };

  return (
    // Pasang onClick global di container utama
    <div onClick={handleGlobalClick} className="relative w-full h-screen bg-sky-200 overflow-hidden font-sans cursor-pointer">
      
      <CityLoader />

      {/* Audio Tag: Tambahin 'muted' prop biar sync sama state */}
      <audio ref={bgmRef} src="/audio/suara3.mp3" loop muted={isMuted} />

      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto drop-shadow-lg">
              <div className="text-white text-3xl font-black uppercase tracking-tighter drop-shadow-md">Karawang, <span className="text-yellow-400">City</span></div>
              <div className="text-white/80 text-xs font-bold tracking-[0.2em] bg-black/20 px-2 py-1 rounded inline-block">DAYLIGHT SIMULATION</div>
          </div>
          <button onClick={() => window.history.back()} className="pointer-events-auto flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full transition-all text-xs font-bold shadow-xl group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO LOBBY
          </button>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true }} onCreated={({ scene }) => { scene.fog = new THREE.Fog('#87CEEB', 20, 100); }}> 
            <color attach="background" args={['#87CEEB']} />
            <PerspectiveCamera makeDefault position={[25, 15, 25]} fov={35} />
            <OrbitControls ref={controlsRef} enablePan={false} maxPolarAngle={Math.PI / 2} />
            <CameraRig viewMode={viewMode} controlsRef={controlsRef} />
            <directionalLight position={[100, 100, 50]} intensity={2.5} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
            <ambientLight intensity={1.5} color="#b0e0e6" /> 
            <Suspense fallback={null}>
                <DaySky />
                <CityModel />
                <ContactShadows opacity={0.4} scale={50} blur={2} far={10} resolution={256} color="#000000" />
            </Suspense>
        </Canvas>
      </div>

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] flex flex-col gap-4">
        <ControlButton icon={<Map size={24} />} isActive={viewMode === 'DRONE'} onClick={(e: any) => { e.stopPropagation(); setViewMode('DRONE'); }} label="DRONE" />
        <ControlButton icon={<Video size={24} />} isActive={viewMode === 'WIDE'} onClick={(e: any) => { e.stopPropagation(); setViewMode('WIDE'); }} label="CINEMATIC" />
        <ControlButton icon={<Navigation size={24} />} isActive={viewMode === 'STREET'} onClick={(e: any) => { e.stopPropagation(); setViewMode('STREET'); }} label="STREET" />
        <ControlButton icon={<Eye size={24} />} isActive={viewMode === 'SIDE'} onClick={(e: any) => { e.stopPropagation(); setViewMode('SIDE'); }} label="SIDE" />
      </div>

      <div className="absolute bottom-6 left-6 z-50 pointer-events-none flex gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
             <Sun className="text-yellow-400 animate-spin-slow" size={24} />
             <div>
                <div className="text-white text-xs font-bold">32°C</div>
                <div className="text-white/60 text-[10px] font-mono uppercase">Sunny</div>
             </div>
          </div>
          <button onClick={toggleMute} className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 text-white transition-all">
             {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
      </div>

    </div>
  );
};

const ControlButton = ({ icon, isActive, onClick, label }: any) => (
  <div className="group relative flex items-center justify-end">
    <span className={`absolute right-14 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase tracking-widest border border-white/10 whitespace-nowrap`}>{label}</span>
    <button onClick={onClick} className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border ${isActive ? 'bg-yellow-500 border-yellow-300 text-white scale-110 shadow-yellow-500/50' : 'bg-black/40 border-white/10 text-white hover:bg-white/20'}`}>{icon}</button>
  </div>
);

export default City;