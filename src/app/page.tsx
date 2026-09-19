'use client';

import { useApp } from '@/lib/store';
import { LandingPage } from '@/components/landing/LandingPage';
import { Workspace } from '@/components/workspace/Workspace';
import { ComparisonView } from '@/components/comparison/ComparisonView';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { AIDisclaimer } from '@/components/shared/AIDisclaimer';
import { useEffect } from 'react';

import { CustomCursor } from '@/components/ui/CustomCursor';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { GlowingOrb } from '@/components/ui/GlowingOrb';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { state } = useApp();
  const [splashFinished, setSplashFinished] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Dispatched by CommandPalette listener
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <main className="min-h-screen bg-lexora-950 relative overflow-hidden">
      <CustomCursor />
      
      {/* Global Deep Atmospheric Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <GlowingOrb color="var(--color-accent-700)" size={600} blur={200} x={-400} y={-300} duration={15} />
        <GlowingOrb color="var(--color-accent-500)" size={500} blur={180} x={400} y={200} delay={2} duration={20} />
        <GlowingOrb color="var(--color-accent-800)" size={800} blur={250} x={0} y={600} delay={5} duration={25} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <AnimatePresence mode="wait">
        {!splashFinished ? (
          <SplashScreen key="splash" onComplete={() => setSplashFinished(true)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            {state.view === 'landing' && <LandingPage />}
            {state.view === 'workspace' && <Workspace />}
            {state.view === 'compare' && <ComparisonView />}
            <CommandPalette />
            <AIDisclaimer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
