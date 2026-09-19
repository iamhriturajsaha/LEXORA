'use client';

import { useApp } from '@/lib/store';
import { DocumentNav } from './DocumentNav';
import { DocumentReader } from './DocumentReader';
import { IntelligencePanel } from './IntelligencePanel';
import { AnalysisProgress } from './AnalysisProgress';
import { WorkspaceHeader } from './WorkspaceHeader';
import { motion } from 'framer-motion';
import { GlowingOrb } from '@/components/ui/GlowingOrb';

export function Workspace() {
  const { state } = useApp();

  if (state.isAnalyzing) {
    return <AnalysisProgress stage={state.analysisStage} />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lexora-950 px-6">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-danger text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-lexora-100 mb-2">Analysis failed</h2>
          <p className="text-sm text-lexora-400 mb-6">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-500 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!state.document || !state.analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-lexora-950 flex flex-col relative overflow-hidden selection:bg-accent-500 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <GlowingOrb color="var(--color-accent-900)" size={500} blur={150} x={-300} y={-200} duration={15} />
        <GlowingOrb color="var(--color-accent-700)" size={600} blur={200} x={300} y={300} delay={3} duration={20} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <WorkspaceHeader />
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Document Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl overflow-y-auto"
          >
            <DocumentNav />
          </motion.aside>

          {/* Center: Document Reader */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-md"
          >
            <DocumentReader />
          </motion.main>

          {/* Right: Intelligence Panel */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block w-96 border-l border-white/5 bg-black/40 backdrop-blur-2xl overflow-y-auto shadow-2xl"
          >
            <IntelligencePanel />
          </motion.aside>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-12 left-0 right-0 bg-lexora-900 border-t border-lexora-800 flex">
        {(['overview', 'clarity', 'risks', 'questions', 'actions'] as const).map(tab => (
          <MobileTab key={tab} tab={tab} />
        ))}
      </div>
    </div>
  );
}

function MobileTab({ tab }: { tab: 'overview' | 'clarity' | 'risks' | 'questions' | 'actions' }) {
  const { state, dispatch } = useApp();
  const labels = { overview: 'Overview', clarity: 'Clarity', risks: 'Risks', questions: 'Q&A', actions: 'Actions' };
  const isActive = state.workspaceTab === tab;
  return (
    <button
      onClick={() => dispatch({ type: 'SET_WORKSPACE_TAB', payload: tab })}
      className={`flex-1 py-3 text-[10px] font-medium transition-colors ${
        isActive ? 'text-accent-500 border-t-2 border-accent-500' : 'text-lexora-500'
      }`}
    >
      {labels[tab]}
    </button>
  );
}
