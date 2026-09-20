'use client';

import { useApp } from '@/lib/store';
import { CLAUSE_CATEGORY_LABELS, type ImportanceLevel } from '@/types/document';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Copy, CheckCircle2 } from 'lucide-react';
import type { AnalyzedClause } from '@/types/document';

const IMPORTANCE_ORDER: ImportanceLevel[] = ['critical', 'important', 'standard', 'informational'];
const IMPORTANCE_LABELS: Record<ImportanceLevel, { label: string; color: string }> = {
  critical: { label: 'Important', color: 'var(--color-risk-high)' },
  important: { label: 'Attention', color: 'var(--color-risk-medium)' },
  standard: { label: 'Standard', color: 'var(--color-lexora-400)' },
  informational: { label: 'Info', color: 'var(--color-accent-500)' },
};

export function ClarityTab() {
  const { state, dispatch } = useApp();
  const { analysis, selectedClauseId } = state;


  const grouped = IMPORTANCE_ORDER.map(level => ({
    level,
    ...IMPORTANCE_LABELS[level],
    clauses: analysis?.clauses.filter(c => c.importance === level) || [],
  })).filter(g => g.clauses.length > 0);

  // Auto-scroll to selected clause
  useEffect(() => {
    if (selectedClauseId) {
      const el = document.getElementById(`clause-${selectedClauseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedClauseId]);

  if (!analysis) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="text-xs text-lexora-500 mb-2">
        {analysis.clauses.length} clauses identified across {new Set(analysis.clauses.map(c => c.category)).size} categories
      </div>

      {/* Clause Explorer */}
      {grouped.map(group => (
        <div key={group.level}>
          <h3
            className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"
            style={{ color: group.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
            {group.label} ({group.clauses.length})
          </h3>

          <div className="space-y-2">
            {group.clauses.map((clause, i) => (
              <ClauseCard 
                key={clause.id} 
                clause={clause} 
                isSelected={clause.id === selectedClauseId}
                index={i}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Obligations */}
      {analysis.obligations.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">
            Obligations ({analysis.obligations.length})
          </h3>
          <div className="space-y-1.5">
            {analysis.obligations.map(ob => (
              <div key={ob.id} className="p-2 rounded border border-lexora-800 bg-lexora-900/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-lexora-300">{ob.description}</span>
                  <span className="text-[10px] text-lexora-500 shrink-0 ml-2">{ob.party}</span>
                </div>
                {ob.sourceLocation.section && (
                  <span className="text-[10px] text-lexora-600 font-mono">{ob.sourceLocation.section}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadlines */}
      {analysis.deadlines.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">
            Deadlines & Dates ({analysis.deadlines.length})
          </h3>
          <div className="space-y-1.5">
            {analysis.deadlines.map(dl => (
              <div key={dl.id} className="p-2 rounded border border-lexora-800 bg-lexora-900/30 flex items-center justify-between">
                <span className="text-[11px] text-lexora-300">{dl.description}</span>
                <span className="text-[10px] font-mono text-accent-500">{dl.period || dl.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetary Terms */}
      {analysis.monetaryTerms.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">
            Monetary Terms ({analysis.monetaryTerms.length})
          </h3>
          <div className="space-y-1.5">
            {analysis.monetaryTerms.map(mt => (
              <div key={mt.id} className="p-2 rounded border border-lexora-800 bg-lexora-900/30 flex items-center justify-between">
                <span className="text-[11px] text-lexora-300">{mt.description}</span>
                <span className="text-[11px] font-semibold text-success">{mt.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ClauseCard({ clause, isSelected, index }: { clause: AnalyzedClause, isSelected: boolean, index: number }) {
  const { dispatch } = useApp();
  const [isRewriting, setIsRewriting] = useState(false);
  const [showRewrite, setShowRewrite] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState<string | null>(null);

  const handleRewrite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRewriting(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsRewriting(false);
      setShowRewrite(true);
    }, 1500);
  };

  const copyToClipboard = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedDraft(id);
    setTimeout(() => setCopiedDraft(null), 2000);
  };

  // Mock standard/pro-client texts based on original text
  const proClientText = `This clause is mutually agreed to be standard. The parties agree to limit liability to the total amount paid under this agreement in the trailing 12 months.`;
  const standardText = `Both parties shall maintain liability caps proportional to their respective contributions, not exceeding standard commercial limits.`;

  return (
    <motion.div
      id={`clause-${clause.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dispatch({ type: 'SELECT_CLAUSE', payload: isSelected ? null : clause.id });
        }
      }}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => {
        dispatch({ type: 'SELECT_CLAUSE', payload: isSelected ? null : clause.id });
        if (!isSelected) setShowRewrite(false); // reset rewrite state when closing
      }}
      className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'border-accent-500/50 bg-accent-500/5'
          : 'border-lexora-800 bg-lexora-900/30 hover:border-lexora-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-lexora-200">{clause.title}</span>
        <span className={`risk-badge risk-badge--${clause.riskLevel}`}>
          {clause.riskLevel}
        </span>
      </div>
      <span className="text-[10px] text-lexora-500">
        {CLAUSE_CATEGORY_LABELS[clause.category]} · {clause.appliesTo}
      </span>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 space-y-3 overflow-hidden"
        >
          {/* Original text */}
          <div>
            <div className="text-[10px] font-semibold text-lexora-500 uppercase mb-1">Original Text</div>
            <p className="text-[11px] text-lexora-400 leading-relaxed italic">
              &quot;{clause.originalText.slice(0, 300)}{clause.originalText.length > 300 ? '...' : ''}&quot;
            </p>
          </div>

          {/* Plain language */}
          <div className="p-2 rounded bg-accent-500/5 border border-accent-500/10">
            <div className="text-[10px] font-semibold text-accent-500 uppercase mb-1">In Simple Terms</div>
            <p className="text-[11px] text-lexora-300 leading-relaxed">{clause.plainLanguage}</p>
          </div>

          {/* AI Rewrite Feature */}
          <div className="pt-2 border-t border-lexora-800">
            {!showRewrite && !isRewriting && (
              <button
                onClick={handleRewrite}
                className="w-full py-2 px-3 rounded-md bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 text-accent-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Auto-Redline Clause
              </button>
            )}

            {isRewriting && (
              <div className="w-full py-2 px-3 rounded-md border border-lexora-800 bg-lexora-900/50 flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-lexora-400 uppercase tracking-widest animate-pulse">Generating Drafts...</span>
              </div>
            )}

            <AnimatePresence>
              {showRewrite && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 mt-2"
                >
                  <div className="p-3 rounded border border-risk-high/30 bg-risk-high/5 relative group cursor-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-risk-high uppercase tracking-wider">Pro-Client Draft</div>
                      <button onClick={(e) => copyToClipboard(e, proClientText, 'pro')} className="text-lexora-500 hover:text-white transition-colors">
                        {copiedDraft === 'pro' ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-lexora-300 leading-relaxed">{proClientText}</p>
                  </div>
                  
                  <div className="p-3 rounded border border-lexora-600/30 bg-lexora-800/30 relative group cursor-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-lexora-300 uppercase tracking-wider">Market Standard Draft</div>
                      <button onClick={(e) => copyToClipboard(e, standardText, 'std')} className="text-lexora-500 hover:text-white transition-colors">
                        {copiedDraft === 'std' ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-lexora-300 leading-relaxed">{standardText}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source */}
          <button
            className="source-chip mt-2"
            onClick={(e) => {
              e.stopPropagation();
              // Scroll to source in document
              const sourceText = clause.sourceLocation.section;
              if (sourceText) {
                const sections = document.querySelectorAll('[id^="section-"]');
                for (const el of sections) {
                  if (el.textContent?.includes(clause.originalText.slice(0, 30))) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                  }
                }
              }
            }}
          >
            Source → {clause.sourceLocation.section || 'Document'}
            {clause.sourceLocation.page && ` → Page ${clause.sourceLocation.page}`}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
