'use client';

import { useApp } from '@/lib/store';
import { Scale, ArrowLeft, Search, BookOpen, Eye } from 'lucide-react';

export function WorkspaceHeader() {
  const { state, dispatch } = useApp();

  return (
    <header className="h-12 border-b border-lexora-800 bg-lexora-950 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="flex items-center gap-2 text-lexora-400 hover:text-lexora-100 transition-colors text-xs"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4" />
        <Scale className="w-4 h-4 text-accent-500" />
        <span className="font-bold text-lexora-200">LEXORA</span>
      </button>

      <div className="h-4 w-px bg-lexora-800" />

      <div className="flex-1 min-w-0">
        <h1 className="text-xs font-medium text-lexora-200 truncate">
          {state.analysis?.title || state.document?.fileName}
        </h1>
        {state.analysis?.documentType && (
          <span className="text-[10px] text-lexora-500">{state.analysis.documentType}</span>
        )}
      </div>

      {/* Plain language toggle */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_PLAIN_LANGUAGE' })}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
          state.plainLanguageMode
            ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
            : 'text-lexora-400 hover:text-lexora-200 border border-lexora-800 hover:border-lexora-700'
        }`}
        aria-pressed={state.plainLanguageMode}
        title={state.plainLanguageMode ? 'Show original text' : 'Show plain language'}
      >
        {state.plainLanguageMode ? <Eye className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
        {state.plainLanguageMode ? 'Plain' : 'Original'}
      </button>

      {/* Search */}
      <div className="relative">
        <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-lexora-500" />
        <input
          type="text"
          placeholder="Search document..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          className="w-44 pl-7 pr-3 py-1.5 rounded-md bg-lexora-900 border border-lexora-800 text-xs text-lexora-200 placeholder:text-lexora-600 focus:border-accent-500/50 focus:outline-none"
          aria-label="Search document"
        />
      </div>

      {/* Cmd+K */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
        className="flex items-center gap-1 px-2 py-1 rounded border border-lexora-800 text-[10px] text-lexora-500 hover:text-lexora-300 hover:border-lexora-700 transition-colors"
        aria-label="Open command palette"
      >
        <kbd className="font-mono">⌘K</kbd>
      </button>

      {state.isDemo && (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-500/10 text-accent-500 border border-accent-500/20">
          Demo
        </span>
      )}
    </header>
  );
}
