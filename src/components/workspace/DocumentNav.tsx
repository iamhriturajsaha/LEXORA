'use client';

import { useApp } from '@/lib/store';
import { FileText, ChevronRight, Plus, Check } from 'lucide-react';
import { CLAUSE_CATEGORY_LABELS } from '@/types/document';
import { handleFileUpload } from '@/components/landing/LandingPage';
import clsx from 'clsx';

export function DocumentNav() {
  const { state, dispatch } = useApp();
  const { document: doc, analysis } = state;

  if (!doc || !analysis) return null;

  const clausesByCategory = analysis.clauses.reduce((acc, clause) => {
    const cat = clause.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(clause);
    return acc;
  }, {} as Record<string, typeof analysis.clauses>);

  return (
    <div className="p-4 space-y-6">
      {/* Open Documents list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider">Open Documents</h3>
          <label className="cursor-pointer text-[10px] text-accent-500 hover:text-accent-400 flex items-center gap-1 font-medium transition-colors">
            <Plus className="w-3 h-3" /> Add
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept=".pdf,.txt,.md,.docx"
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                if (files.length > 0) handleFileUpload(files, dispatch);
              }} 
            />
          </label>
        </div>
        <div className="space-y-1">
          {state.openDocuments.map((d) => {
            const isActive = d.document.id === state.activeDocumentId;
            return (
              <button
                key={d.document.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_DOCUMENT', payload: d.document.id })}
                className={clsx(
                  "w-full text-left px-2 py-2 rounded text-xs transition-colors flex items-center gap-2",
                  isActive ? "bg-accent-500/10 text-accent-400 border border-accent-500/20" : "text-lexora-400 hover:bg-lexora-800/50 hover:text-lexora-200 border border-transparent"
                )}
              >
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate flex-1">{d.document.fileName}</span>
                {isActive && <Check className="w-3 h-3 shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Current Document info */}
      <div>
        <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">Active Document</h3>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-accent-500" />
          <span className="text-xs font-semibold text-lexora-200 truncate">{doc.fileName}</span>
        </div>
        <div className="text-[10px] text-lexora-500 space-y-1">
          <div>{doc.metadata.wordCount.toLocaleString()} words</div>
          <div>{doc.metadata.pageCount} page{doc.metadata.pageCount !== 1 ? 's' : ''}</div>
          {doc.metadata.detectedJurisdiction && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              Jurisdiction: {doc.metadata.detectedJurisdiction}
            </div>
          )}
        </div>
      </div>

      {/* Section navigation */}
      <div>
        <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">Sections</h3>
        <nav className="space-y-0.5" aria-label="Document sections">
          {doc.sections.slice(0, 20).map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(`section-${section.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full text-left px-2 py-1.5 rounded text-[11px] text-lexora-400 hover:text-lexora-200 hover:bg-lexora-800/50 transition-colors truncate flex items-center gap-1"
              style={{ paddingLeft: `${(section.level - 1) * 8 + 8}px` }}
            >
              <ChevronRight className="w-3 h-3 shrink-0 text-lexora-600" />
              <span className="truncate">{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Clause categories */}
      <div>
        <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">Clauses</h3>
        <nav className="space-y-0.5" aria-label="Clause categories">
          {Object.entries(clausesByCategory).map(([cat, clauses]) => (
            <button
              key={cat}
              onClick={() => {
                dispatch({ type: 'SELECT_CLAUSE', payload: clauses[0].id });
                dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'clarity' });
              }}
              className="w-full text-left px-2 py-1.5 rounded text-[11px] text-lexora-400 hover:text-lexora-200 hover:bg-lexora-800/50 transition-colors flex items-center justify-between"
            >
              <span className="truncate">{CLAUSE_CATEGORY_LABELS[cat as keyof typeof CLAUSE_CATEGORY_LABELS] || cat}</span>
              <span className="text-[10px] text-lexora-600 shrink-0">{clauses.length}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
