'use client';

import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { GlowingOrb } from '@/components/ui/GlowingOrb';

const STAGES = [
  'Igniting the core...',
  'Parsing legalese...',
  'Illuminating risks...',
  'Mapping obligations...',
  'Distilling truth...',
];

export function AnalysisProgress({ stage }: { stage: string }) {
  // If the stage from LandingPage isn't found in STAGES, default to the closest match or 0
  const currentIndex = Math.max(0, STAGES.indexOf(stage));

  return (
    <div className="min-h-screen bg-lexora-950 flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-accent-500 selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <GlowingOrb color="var(--color-accent-700)" size={600} blur={200} x={-200} y={-100} duration={10} />
        <GlowingOrb color="var(--color-accent-500)" size={500} blur={150} x={200} y={200} delay={1} duration={15} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-xl w-full relative z-10 p-12 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-3xl shadow-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-accent-500/20 border border-accent-500/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_var(--color-accent-500)]">
            <Sparkles className="w-8 h-8 text-accent-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-2 tracking-tight">Analyzing Document</h2>
          <p className="text-sm text-lexora-400 font-light">The engine is extracting truth from complexity.</p>
        </motion.div>

        <div className="space-y-6">
          {STAGES.map((s, i) => {
            const isActive = i === currentIndex;
            const isComplete = i < currentIndex;
            const isPending = i > currentIndex;
            
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-6 transition-all duration-500 ${
                  isActive ? 'scale-105 ml-2' : ''
                }`}
              >
                <div className="relative">
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-2 border-accent-500 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-500)]">
                      <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/20"></div>
                  )}
                </div>
                
                <span className={`text-lg font-display transition-colors duration-500 ${
                  isActive ? 'text-white font-bold tracking-wide shadow-accent-500 drop-shadow-lg' 
                  : isComplete ? 'text-lexora-400 font-medium' 
                  : 'text-lexora-600 font-light'
                }`}>
                  {s}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-12 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded-full shadow-[0_0_10px_var(--color-accent-500)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / STAGES.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
