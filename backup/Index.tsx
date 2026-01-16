import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, useGLTF, Environment, ContactShadows, useAnimations, Html, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import DialogueCard from '@/components/DialogueCard'; // Balikin UI
import * as THREE from 'three';

// --- BAGIAN 1: KARAKTER DENGAN ANIMASI ---
function YumiAnimated() {
  const group = useRef<THREE.Group>(null);
  // Load Model + Animasi
  const { scene, animations } = useGLTF('/yumi.glb', true);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // LOGIKA: Cari animasi pertama yg ketemu, langsung play!
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimName = Object.keys(actions)[0];
      // console.log("Playing animation:", firstAnimName); // Cek console kalo mau tau namanya
      actions[firstAnimName]?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <group ref={group} position={[0, -1.7, 0]} dispose={null}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

// --- BAGIAN 2: LOADER ---
function Loader() {
  const { progress } = useProgress();
  return <Html center><div className="text-white font-bold">{progress.toFixed(0)}%</div></Html>;
}

// --- BAGIAN 3: MAIN PAGE ---
const Index = () => {
  // Kita siapin state buat logic Buka Kunci nanti (sementara dummy dulu biar UI muncul)
  const handleUnlock = () => {
    console.log("Tombol ditekan! Nanti kita aktifin transisi kota disini.");
    // Jangan ganti scene dulu, kita nikmati Yumi gerak dulu.
  };

  return (
    <div className="relative w-full h-screen bg-black">
      
      <Canvas shadows>
        {/* KAMERA */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
        <OrbitControls enableZoom={true} enablePan={true} />

        {/* LIGHTING & ENV (Biar gak gelap gulita) */}
        <ambientLight intensity={0.5} color="#4c1d95" />
        <spotLight position={[5, 5, 5]} intensity={2} color="#ec4899" angle={0.5} penumbra={1} />
        <spotLight position={[-5, 5, 5]} intensity={2} color="#3b82f6" angle={0.5} penumbra={1} />
        
        {/* Background Kota Malam (Blur biar fokus ke Yumi) */}
        <Environment preset="night" background blur={0.6} />

        <Suspense fallback={<Loader />}>
          <YumiAnimated />
        </Suspense>

        <ContactShadows opacity={0.6} scale={10} blur={2} color="#000000" />
      </Canvas>

      {/* UI PEMANIS (Vignette) */}
      <div 
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)' }}
      />

      {/* UI TOMBOL (Dialogue Card) */}
      <div className="absolute inset-0 pointer-events-none z-20">
         <DialogueCard onUnlock={handleUnlock} />
      </div>

    </div>
  );
};

useGLTF.preload('/yumi.glb');

export default Index;