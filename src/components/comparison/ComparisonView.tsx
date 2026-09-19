'use client';

import { useApp } from '@/lib/store';
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, GitCompare, Upload, ArrowRight, AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react';
import { parseDocumentFromText } from '@/lib/documents/parser';
import { FREELANCE_AGREEMENT_TEXT, FREELANCE_AGREEMENT_V2_TEXT } from '@/data/sample-documents';
import { FREELANCE_ANALYSIS } from '@/data/demo-analysis';
import { DEMO_COMPARISON } from '@/data/demo-qa';

export function ComparisonView() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const loadComparisonDemo = useCallback(async () => {
    setIsLoading(true);
    const docA = parseDocumentFromText(FREELANCE_AGREEMENT_TEXT, 'Freelance_Agreement_v1.pdf', 'demo-freelance-v1');
    const docB = parseDocumentFromText(FREELANCE_AGREEMENT_V2_TEXT, 'Freelance_Agreement_v2.pdf', 'demo-freelance-v2');

    dispatch({ type: 'SET_COMPARISON_DOCS', payload: { docA, docB } });

    // Simulate loading
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'SET_COMPARISON_RESULT', payload: DEMO_COMPARISON });
    setIsLoading(false);
  }, [dispatch]);

  const comparison = state.comparisonResult;

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden font-body selection:bg-accent-500 selection:text-white">
      {/* Header */}
      <header className="h-12 border-b border-lexora-800 flex items-center px-4 gap-4 shrink-0 bg-black/40 backdrop-blur-xl z-10 relative">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: state.document ? 'workspace' : 'landing' })}
          className="flex items-center gap-2 text-lexora-400 hover:text-lexora-100 transition-colors text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <Scale className="w-4 h-4 text-accent-500" />
          <span className="font-bold text-lexora-200">LEXORA</span>
        </button>
        <div className="h-4 w-px bg-lexora-800" />
        <GitCompare className="w-4 h-4 text-accent-500" />
        <span className="text-xs font-medium text-lexora-200 uppercase tracking-widest">Document Comparison</span>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex-1 overflow-y-auto">
        {!comparison ? (
          <div className="text-center py-24">
            <GitCompare className="w-12 h-12 text-accent-500 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-widest">Compare Two Documents</h2>
            <p className="text-sm text-lexora-400 mb-10 max-w-md mx-auto font-light">
              Upload two versions of a document to see what changed, what it means, and why it matters.
            </p>

            <button
              onClick={loadComparisonDemo}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent-500 text-black font-bold text-sm hover:bg-accent-400 transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {isLoading ? 'Comparing...' : 'Try comparison demo'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-lexora-500 mt-6 font-light">
              Compares Freelance Agreement v1 vs v2 — includes payment, termination, and IP changes
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {/* Comparison header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">Comparison Results</h2>
                <p className="text-sm text-lexora-400 font-light">
                  {comparison.documentATitle} <span className="mx-2 text-accent-500">→</span> {comparison.documentBTitle}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-lexora-400">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 text-risk-medium" /> {comparison.changes.filter(c => c.type === 'modified').length} Modified</span>
                <span className="flex items-center gap-1"><Plus className="w-3 h-3 text-success" /> {comparison.changes.filter(c => c.type === 'added').length} Added</span>
                <span className="flex items-center gap-1"><Minus className="w-3 h-3 text-danger" /> {comparison.changes.filter(c => c.type === 'removed').length} Removed</span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg border border-lexora-800 bg-lexora-900/50">
              <p className="text-sm text-lexora-300 leading-relaxed">{comparison.summary}</p>
            </div>

            {/* Material Changes */}
            {comparison.materialChanges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-lexora-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-risk-medium" />
                  Material Changes ({comparison.materialChanges.length})
                </h3>
                <div className="space-y-4">
                  {comparison.materialChanges.map((change) => (
                    <motion.div
                      key={change.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-lexora-800 bg-lexora-900/30"
                    >
                      <h4 className="text-sm font-semibold text-lexora-100 mb-2">{change.title}</h4>
                      <p className="text-xs text-lexora-300 mb-3">{change.description}</p>

                      {/* Before / After */}
                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div className="p-3 rounded bg-danger/5 border border-danger/20">
                          <div className="text-[10px] font-semibold text-danger uppercase mb-1">Before</div>
                          <p className="text-xs text-lexora-300">{change.before}</p>
                        </div>
                        <div className="p-3 rounded bg-success/5 border border-success/20">
                          <div className="text-[10px] font-semibold text-success uppercase mb-1">After</div>
                          <p className="text-xs text-lexora-300">{change.after}</p>
                        </div>
                      </div>

                      {/* Why it matters */}
                      <div className="p-2 rounded bg-lexora-800/50">
                        <div className="text-[10px] font-semibold text-risk-medium uppercase mb-1">Why this matters</div>
                        <p className="text-[11px] text-lexora-400">{change.whyItMatters}</p>
                      </div>

                      {/* Sources */}
                      <div className="flex gap-2 mt-2">
                        {change.sourceA?.section && <span className="source-chip">A: {change.sourceA.section}</span>}
                        {change.sourceB?.section && <span className="source-chip">B: {change.sourceB.section}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Changes */}
            <div>
              <h3 className="text-sm font-semibold text-lexora-100 mb-4">
                All Changes ({comparison.changes.length})
              </h3>
              <div className="space-y-2">
                {comparison.changes.map((change) => {
                  const typeColors = {
                    modified: { bg: 'bg-risk-medium/5', border: 'border-risk-medium/20', icon: RefreshCw, color: 'text-risk-medium' },
                    added: { bg: 'bg-success/5', border: 'border-success/20', icon: Plus, color: 'text-success' },
                    removed: { bg: 'bg-danger/5', border: 'border-danger/20', icon: Minus, color: 'text-danger' },
                    unchanged: { bg: 'bg-lexora-800/50', border: 'border-lexora-800', icon: RefreshCw, color: 'text-lexora-500' },
                  };
                  const style = typeColors[change.type];
                  const Icon = style.icon;

                  return (
                    <div key={change.id} className={`p-3 rounded-lg border ${style.border} ${style.bg}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-3 h-3 ${style.color}`} />
                        <span className={`text-[10px] font-semibold uppercase ${style.color}`}>{change.type}</span>
                        <span className={`risk-badge risk-badge--${change.significance}`}>{change.significance}</span>
                      </div>
                      {change.explanation && (
                        <p className="text-xs text-lexora-300">{change.explanation}</p>
                      )}
                      {change.sectionA && (
                        <span className="text-[10px] text-lexora-500 font-mono">{change.sectionA}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
