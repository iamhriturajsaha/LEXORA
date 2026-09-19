'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, AlertTriangle, MessageSquare, ClipboardList, Download,
  GitCompare, StickyNote, RotateCcw, X
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: typeof FileText;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
      }
      if (e.key === 'Escape' && state.commandPaletteOpen) {
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.commandPaletteOpen, dispatch]);

  useEffect(() => {
    if (state.commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [state.commandPaletteOpen]);

  const commands: Command[] = [
    { id: 'analyze', label: 'Analyze a document', icon: FileText, action: () => { dispatch({ type: 'RESET' }); }, shortcut: '' },
    { id: 'overview', label: 'Show overview', icon: FileText, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'overview' }) },
    { id: 'clauses', label: 'Find clauses', icon: Search, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'clarity' }) },
    { id: 'risks', label: 'Show risks', icon: AlertTriangle, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'risks' }) },
    { id: 'qa', label: 'Ask a question', icon: MessageSquare, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'questions' }) },
    { id: 'actions', label: 'Show actions', icon: ClipboardList, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'actions' }) },
    { id: 'compare', label: 'Compare documents', icon: GitCompare, action: () => dispatch({ type: 'SET_VIEW', payload: 'compare' }) },
    { id: 'note', label: 'Add a note', icon: StickyNote, action: () => dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'actions' }) },
    { id: 'reset', label: 'Reset / go home', icon: RotateCcw, action: () => dispatch({ type: 'RESET' }) },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {state.commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-lexora-900 border border-lexora-700 rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-lexora-800">
                <Search className="w-4 h-4 text-lexora-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-sm text-lexora-100 placeholder:text-lexora-600 focus:outline-none"
                  aria-label="Command palette search"
                />
                <button onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })} aria-label="Close">
                  <X className="w-4 h-4 text-lexora-500 hover:text-lexora-300" />
                </button>
              </div>

              {/* Commands */}
              <div className="max-h-64 overflow-y-auto py-2">
                {filtered.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-lexora-300 hover:bg-lexora-800 hover:text-lexora-100 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-lexora-500" />
                      <span>{cmd.label}</span>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="px-4 py-3 text-sm text-lexora-500">No matching commands</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
