'use client';

import { useApp, type WorkspaceTab } from '@/lib/store';
import { OverviewTab } from './tabs/OverviewTab';
import { ClarityTab } from './tabs/ClarityTab';
import { RisksTab } from './tabs/RisksTab';
import { QuestionsTab } from './tabs/QuestionsTab';
import { ActionsTab } from './tabs/ActionsTab';
import { TimelineTab } from './tabs/TimelineTab';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, AlertTriangle, MessageSquare, ClipboardList, Clock } from 'lucide-react';

const TABS: { id: WorkspaceTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'clarity', label: 'Clarity', icon: BookOpen },
  { id: 'timeline', label: 'Chronos', icon: Clock },
  { id: 'risks', label: 'Risks', icon: AlertTriangle },
  { id: 'questions', label: 'Q&A', icon: MessageSquare },
  { id: 'actions', label: 'Actions', icon: ClipboardList },
];

export function IntelligencePanel() {
  const { state, dispatch } = useApp();

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="grid grid-cols-3 border-b border-white/10 bg-transparent shrink-0">
        {TABS.map(tab => {
          const isActive = state.workspaceTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_WORKSPACE_TAB', payload: tab.id })}
              className={`w-full flex items-center justify-center gap-2 px-2 py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-widest transition-all relative ${
                isActive ? 'text-white' : 'text-lexora-500 hover:text-white/80'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 shadow-[0_-2px_10px_var(--color-accent-500)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.workspaceTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {state.workspaceTab === 'overview' && <OverviewTab />}
            {state.workspaceTab === 'clarity' && <ClarityTab />}
            {state.workspaceTab === 'timeline' && <TimelineTab />}
            {state.workspaceTab === 'risks' && <RisksTab />}
            {state.workspaceTab === 'questions' && <QuestionsTab />}
            {state.workspaceTab === 'actions' && <ActionsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
