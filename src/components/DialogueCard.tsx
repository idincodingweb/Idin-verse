import { motion } from 'framer-motion';
import { Sparkles, Map } from 'lucide-react';

interface DialogueCardProps {
  onUnlock: () => void;
}

const DialogueCard = ({ onUnlock }: DialogueCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[400px] px-4"
    >
      <div className="glass-card-strong p-8 rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/60 text-center relative overflow-hidden">
        
        {/* Glow Effect Background */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/20 blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 blur-[50px] pointer-events-none" />

        {/* Badge IDIN CODE */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">
            System Verified
          </div>
        </div>

        {/* Teks Utama */}
        <h2 className="text-white text-2xl font-bold tracking-tight mb-8">
          Ayok lihat kota ku
        </h2>

        {/* Tombol Langsung */}
        <button
          onClick={onUnlock}
          className="group relative w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-black italic tracking-widest shadow-lg transition-all hover:scale-[1.03] active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center justify-center gap-3">
            <Map className="w-5 h-5" />
            <span>MASUK SEKARANG</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default DialogueCard;