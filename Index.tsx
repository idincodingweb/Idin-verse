import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, useGLTF, Environment, ContactShadows, useAnimations, Html, useProgress, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import DialogueCard from '@/components/DialogueCard';
import TransitionOverlay from '@/components/TransitionOverlay'; 
import * as THREE from 'three';

// --- KONFIGURASI KOTA & POSISI ---
const CITY_SCALE = 1;        // Ubah ini kalau kota kegedean/kekecilan (Misal: 0.1 atau 10)
const CITY_POSITION: [number, number, number] = [0, -2, 0]; // Geser kota naik/turun
const MOTOR_POSITION: [number, number, number] = [0, -2, 2]; // Posisi motor relatif terhadap kota

// --- 1. YUMI (AKTOR 1) ---
function YumiAnimated({ visible }: { visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/yumi.glb', true);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (visible && actions && Object.keys(actions).length > 0) {
      const firstAnim = Object.keys(actions)[0];
      actions[firstAnim]?.reset().fadeIn(0.5).play();
    }
  }, [actions, visible]);

  return (
    <group ref={group} position={[0, -1.7, 0]} visible={visible}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

// --- 2. KOTA BARU + MOTOR (AKTOR 2) ---
function CityGroup({ visible }: { visible: boolean }) {
  const bike = useGLTF('/bike.glb', true);
  const city = useGLTF('/city.glb', true); // Load file Neighbourhood City lo

  return (
    <group visible={visible}>
      
      {/* KOTA UTAMA */}
      <primitive 
        object={city.scene} 
        scale={CITY_SCALE}       
        position={CITY_POSITION} 
        rotation={[0, 0, 0]} 
      />
      
      {/* MOTOR (HERO) */}
      <primitive 
        object={bike.scene} 
        position={MOTOR_POSITION} 
        rotation={[0, 1.2, 0]} 
        scale={0.8} 
      />

      {/* LIGHTING - KITA BIKIN DRAMATIS TAPI JELAS */}
      {visible && (
        <>
            {/* Matahari Sore (Biar bayangannya panjang kayak di screenshot) */}
            <directionalLight 
                position={[10, 20, 5]} 
                intensity={2} 
                color="#ffddaa" 
                castShadow 
            />
            
            {/* Lampu Isi (Biru) biar bayangan gak hitam legam */}
            <ambientLight intensity={1} color="#ccccff" />
            
            {/* Lampu Sorot Motor (Biar tetep jadi pusat perhatian) */}
            <spotLight 
                position={[0, 5, 5]} 
                target={bike.scene} 
                intensity={10} 
                color="#00ffff" 
                angle={0.5}
                penumbra={0.5} 
            />
        </>
      )}
    </group>
  );
}

// --- 3. LOADER KEREN ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center shadow-xl">
        <div className="text-white font-bold text-lg mb-1 tracking-widest">BUILDING CITY</div>
        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

// --- 4. MAIN PAGE ---
const Index = () => {
  const [mode, setMode] = useState<'YUMI' | 'CITY'>('YUMI');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleUnlock = () => {
    setIsTransitioning(true);
    setTimeout(() => setMode('CITY'), 1200);
    setTimeout(() => setIsTransitioning(false), 2500);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: false }}> 
            {/* Langit Sore/Malam */}
            <color attach="background" args={['#111122']} />
            <fog attach="fog" args={['#111122', 10, 80]} /> 

            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
            
            <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                maxPolarAngle={Math.PI / 2} 
            />
            
            {/* Environment City (Biar pantulan di kaca gedung/motor bagus) */}
            <Environment preset="city" background={false} />

            <Suspense fallback={<Loader />}>
                <YumiAnimated visible={mode === 'YUMI'} />
                <CityGroup visible={mode === 'CITY'} />
            </Suspense>

            {mode === 'YUMI' && <ContactShadows opacity={0.6} scale={10} blur={2} color="#000000" />}
        </Canvas>
      </div>

      <div className={`absolute inset-0 z-40 ${isTransitioning ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <TransitionOverlay isActive={isTransitioning} />
      </div>

      {mode === 'YUMI' && !isTransitioning && (
        <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
           <div className="w-full pointer-events-auto relative z-50">
              <DialogueCard onUnlock={handleUnlock} />
           </div>
        </div>
      )}

      {/* TOMBOL PANGGIL KOTA */}
      {mode === 'YUMI' && !isTransitioning && (
        <button 
          onClick={handleUnlock}
          className="absolute top-4 right-4 z-[999] bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-lg pointer-events-auto transition-all"
        >
          🏙️ GO TO CITY
        </button>
      )}

      {/* UI PREVIEW CAMERA (Placeholder buat fitur nanti) */}
      {mode === 'CITY' && !isTransitioning && (
        <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center gap-4 pointer-events-auto">
             {/* Nanti kita fungsikan tombol ini buat pindah angle kayak angka 7, 8 */}
             <div className="bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full text-xs">
                Geser layar buat cari posisi enak dulu
             </div>
        </div>
      )}

      {/* TOMBOL KEMBALI */}
      {mode === 'CITY' && !isTransitioning && (
        <button 
          onClick={() => window.location.reload()} 
          className="absolute top-8 left-8 z-[100] bg-black/40 text-white px-4 py-2 rounded-full backdrop-blur-md pointer-events-auto border border-white/10"
        >
          ⬅️ BACK
        </button>
      )}

    </div>
  );
};

useGLTF.preload('/yumi.glb');
useGLTF.preload('/bike.glb');

export default Index;