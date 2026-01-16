import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import TypewriterText from './ui/TypewriterText';

interface DialogueCardProps {
  onUnlock: () => void;
}

const DialogueCard = ({ onUnlock }: DialogueCardProps) => {
  const [dialoguePhase, setDialoguePhase] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dialogues = [
    "Halo aku Yumi, aku diciptakan oleh Idin Programming. Sebelum bercerita, izinkan aku menebak waktu di ponselmu...",
    `Waktu di ponselmu sekarang: ${currentTime}`,
  ];

  const handlePhase0Complete = () => {
    setTimeout(() => setDialoguePhase(1), 500);
  };

  const handlePhase1Complete = () => {
    setTimeout(() => setShowButton(true), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      // PERBAIKAN DISINI: Pakai 'fixed' dan 'bottom-[15%]'
      className="fixed bottom-[15%] left-4 right-4 z-50 flex flex-col items-center md:bottom-12 md:left-auto md:right-12 md:w-[400px]"
    >
      <div className="glass-card-strong p-6 md:p-8 w-full">
        {/* Character name badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute -top-4 left-6"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="font-display text-sm font-semibold text-primary-foreground tracking-wider">
              YUMI
            </span>
          </div>
        </motion.div>

        {/* Dialogue content */}
        <div className="mt-2 space-y-4">
          <div className="min-h-[80px] text-foreground/90 text-lg md:text-xl leading-relaxed font-body">
            <TypewriterText
              key={0}
              text={dialogues[0]}
              speed={40}
              onComplete={handlePhase0Complete}
            />
          </div>

          <AnimatePresence>
            {dialoguePhase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-primary/30"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-pink">
                  <span className="font-display text-xs text-primary-foreground">⏰</span>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm font-medium">Waktu Lokal</p>
                  <TypewriterText
                    text={currentTime}
                    speed={100}
                    onComplete={handlePhase1Complete}
                    className="text-2xl font-display font-bold text-gradient-sunset"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlock Button */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex justify-center pt-4"
              >
                <button
                  onClick={onUnlock}
                  className="btn-unlock flex items-center gap-3 group"
                >
                  <Lock className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  <span>BUKA KUNCI</span>
                  <Sparkles className="w-5 h-5 transition-transform group-hover:scale-125" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-accent/50 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-accent/50 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-2xl" />
      </div>
    </motion.div>
  );
};

export default DialogueCard;