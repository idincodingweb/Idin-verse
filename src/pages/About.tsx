import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, Float, PerspectiveCamera } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, User, Cpu, Globe } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white select-none">
      
      {/* --- BACKGROUND 3D --- */}
      <div className="absolute inset-0 z-0">
        <Canvas>
           <PerspectiveCamera makeDefault position={[0, 0, 5]} />
           <color attach="background" args={['#020205']} />
           {/* Efek Bintang & Partikel */}
           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
           <Sparkles count={200} scale={[10, 10, 10]} size={2} speed={0.2} opacity={0.5} color="#00ffff" />
        </Canvas>
      </div>

      {/* --- UI LAYER (KACA) --- */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        
        {/* Container Utama (Glass Effect) */}
        <div className="relative max-w-4xl w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
            
            {/* Tombol Back */}
            <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group">
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col md:flex-row gap-10 items-start">
                
                {/* --- BAGIAN KIRI: FOTO/AVATAR --- */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    {/* Placeholder Foto (Bisa diganti foto asli nanti) */}
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 mb-6 animate-pulse">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                             <User size={64} className="text-cyan-500" />
                             {/* Nanti ganti tag <img src="/foto-idin.jpg" /> di sini */}
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        IDIN ISKANDAR
                    </h2>
                    <p className="text-white/50 font-mono text-sm mt-1">Creator & Developer</p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                        <span className="px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold">ReactJS</span>
                        <span className="px-3 py-1 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400 text-xs font-bold">ThreeJS</span>
                        <span className="px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-400 text-xs font-bold">Content Creator</span>
                    </div>
                </div>

                {/* --- BAGIAN KANAN: TEKS --- */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-cyan-400">
                            <Cpu size={20} />
                            <h3 className="text-xl font-bold uppercase tracking-widest">The Mission</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                            "Saya membuat <b>IdinVerse</b> bukan sekadar sebagai portfolio, tapi sebagai eksperimen batas kemampuan teknologi web modern. Saya ingin menggabungkan <i>Coding</i>, <i>Seni Visual</i>, dan <i>Interaktivitas</i> menjadi satu pengalaman yang imersif."
                        </p>
                    </div>

                    <div className="w-full h-px bg-white/10"></div>

                    <div>
                         <div className="flex items-center gap-3 mb-2 text-blue-400">
                            <Globe size={20} />
                            <h3 className="text-xl font-bold uppercase tracking-widest">Why 3D Web?</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                            Website biasa itu membosankan. Di sini, pengunjung tidak hanya membaca, tapi <b>menjelajah</b>. Ini adalah visi saya tentang masa depan internet: Dunia virtual yang bisa diakses siapa saja, langsung dari browser mereka."
                        </p>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
                          }
