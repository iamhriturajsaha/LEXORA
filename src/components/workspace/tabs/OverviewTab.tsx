'use client';

import { useApp } from '@/lib/store';
import { CLAUSE_CATEGORY_LABELS, type ClarityStatus } from '@/types/document';
import { FileText, Users, MapPin, Clock, DollarSign, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { FREELANCE_RISK_RADAR } from '@/data/demo-analysis';

const CLARITY_CONFIG: Record<ClarityStatus, { label: string; color: string; desc: string }> = {
  'clear': { label: 'Clear', color: 'var(--color-success)', desc: 'This document uses relatively straightforward language.' },
  'needs-attention': { label: 'Needs Attention', color: 'var(--color-risk-medium)', desc: 'Some sections use complex language or contain terms worth reviewing carefully.' },
  'complex': { label: 'Complex', color: 'var(--color-risk-high)', desc: 'This document contains dense legal language that may benefit from professional review.' },
};

export function OverviewTab() {
  const { state, dispatch } = useApp();
  const { analysis } = state;

  if (!analysis) return null;

  const clarityInfo = CLARITY_CONFIG[analysis.clarityStatus];
  const riskRadar = state.isDemo ? FREELANCE_RISK_RADAR : null;

  return (
    <div className="p-4 space-y-6">
      {/* Clarity Status */}
      <div className="p-4 rounded-lg border border-lexora-800 bg-lexora-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider">Clarity Status</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ color: clarityInfo.color, backgroundColor: `color-mix(in srgb, ${clarityInfo.color} 15%, transparent)` }}
          >
            {clarityInfo.label}
          </span>
        </div>
        <p className="text-xs text-lexora-400">{clarityInfo.desc}</p>
        <p className="text-[10px] text-lexora-600 mt-1">This is a comprehension indicator, not a legal assessment.</p>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <FileText className="w-3 h-3" /> Summary
        </h3>
        <p className="text-xs text-lexora-300 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Key Facts */}
      <div>
        <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Key Facts
        </h3>
        <ul className="space-y-1.5">
          {analysis.keyFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-lexora-300">
              <span className="w-1 h-1 rounded-full bg-accent-500 mt-1.5 shrink-0" />
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* Parties */}
      {state.document?.metadata.parties && state.document.metadata.parties.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Parties
          </h3>
          {state.document.metadata.parties.map((party, i) => (
            <div key={i} className="text-xs text-lexora-300 mb-1">{party}</div>
          ))}
        </div>
      )}

      {/* Jurisdiction */}
      {analysis.jurisdictionMentioned && (
        <div className="p-3 rounded-lg bg-accent-500/5 border border-accent-500/20">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-accent-500" />
            <span className="text-[10px] font-semibold text-accent-500 uppercase">Jurisdiction Detected</span>
          </div>
          <p className="text-xs text-lexora-300">{analysis.jurisdictionMentioned}</p>
          <p className="text-[10px] text-lexora-500 mt-1">Legal effect may depend on applicable local law.</p>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: AlertTriangle, label: 'Attention Areas', value: analysis.risks.length, color: 'var(--color-risk-medium)' },
          { icon: Clock, label: 'Deadlines', value: analysis.deadlines.length, color: 'var(--color-accent-500)' },
          { icon: DollarSign, label: 'Monetary Terms', value: analysis.monetaryTerms.length, color: 'var(--color-success)' },
          { icon: HelpCircle, label: 'Questions', value: analysis.questions.length, color: 'var(--color-lexora-400)' },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => {
              if (stat.label === 'Attention Areas') dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'risks' });
              if (stat.label === 'Questions') dispatch({ type: 'SET_WORKSPACE_TAB', payload: 'questions' });
            }}
            className="p-3 rounded-lg border border-lexora-800 bg-lexora-900/30 text-left hover:border-lexora-700 transition-colors"
          >
            <stat.icon className="w-3.5 h-3.5 mb-1.5" style={{ color: stat.color }} />
            <div className="text-lg font-bold text-lexora-100">{stat.value}</div>
            <div className="text-[10px] text-lexora-500">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Risk Radar */}
      {riskRadar && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Attention Radar
          </h3>
          <div className="space-y-2">
            {Object.entries(riskRadar).map(([key, level]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
              const levelKey = level as 'high' | 'medium' | 'low' | 'info';
              const colors = { high: 'var(--color-risk-high)', medium: 'var(--color-risk-medium)', low: 'var(--color-risk-low)', info: 'var(--color-accent-500)' };
              const widths = { high: '90%', medium: '60%', low: '30%', info: '20%' };
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-[10px] text-lexora-400 w-32 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-lexora-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: widths[levelKey], backgroundColor: colors[levelKey] }} />
                  </div>
                  <span className="risk-badge risk-badge--{levelKey} text-[9px]" style={{ color: colors[levelKey] }}>{levelKey}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Review Areas */}
      {analysis.recommendedReviewAreas.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2">Recommended Review Areas</h3>
          <ul className="space-y-1.5">
            {analysis.recommendedReviewAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-lexora-400">
                <AlertTriangle className="w-3 h-3 text-risk-medium mt-0.5 shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
