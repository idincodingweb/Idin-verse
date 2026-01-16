import { motion, AnimatePresence } from 'framer-motion';

interface TransitionOverlayProps {
  isActive: boolean;
}

const TransitionOverlay = ({ isActive }: TransitionOverlayProps) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-midnight flex items-center justify-center"
        >
          {/* Magic circle animation */}
          <motion.div
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: 1.5, rotate: 360, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative"
          >
            {/* Outer ring */}
            <div className="w-40 h-40 rounded-full border-2 border-primary glow-pink" />
            
            {/* Inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-accent"
            />
            
            {/* Center orb */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent glow-pink"
            />
          </motion.div>

          {/* Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * 150,
                y: Math.sin((i / 12) * Math.PI * 2) * 150,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full bg-primary"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;
