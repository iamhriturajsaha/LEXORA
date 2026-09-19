'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlowingOrb } from './GlowingOrb';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The total sequence is 7 seconds as requested
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lexora-950 overflow-hidden"
        >
          {/* Deep Space Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <GlowingOrb color="var(--color-accent-700)" size={800} blur={250} x={0} y={0} duration={15} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <Scale className="w-16 h-16 text-accent-500" />
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1 }}
                className="text-7xl md:text-9xl font-display font-black text-white tracking-widest uppercase relative"
              >
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">LEXORA</span>
              </motion.h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 3 }}
              className="mt-8 overflow-hidden h-[1px] w-0 bg-gradient-to-r from-transparent via-accent-500 to-transparent relative"
            >
              <motion.div 
                animate={{ width: "200px" }}
                transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-transparent via-accent-500 to-transparent"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, delay: 3.5 }}
              className="mt-6 text-lexora-400 font-light tracking-[0.3em] uppercase text-xs"
            >
              Intelligence Initiated
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
