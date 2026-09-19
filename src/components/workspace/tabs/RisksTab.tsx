'use client';

import { useApp } from '@/lib/store';
import { AlertTriangle, HelpCircle, FileText, ExternalLink, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function RisksTab() {
  const { state } = useApp();
  const { analysis } = state;

  if (!analysis) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="text-xs text-lexora-500 mb-2">
        {analysis.risks.length} attention area{analysis.risks.length !== 1 ? 's' : ''} identified
      </div>

      {analysis.risks.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-6 h-6 text-lexora-600 mx-auto mb-2" />
          <p className="text-xs text-lexora-500">No significant attention areas identified.</p>
        </div>
      ) : (
        analysis.risks.map((risk, i) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-lg border border-lexora-800 bg-lexora-900/30 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-lexora-100">{risk.title}</h4>
              <span className={`risk-badge risk-badge--${risk.riskLevel}`}>
                {risk.riskLevel === 'high' ? 'Attention' : risk.riskLevel}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-lexora-300 leading-relaxed">{risk.description}</p>

            {/* Why it matters */}
            <div className="p-3 rounded bg-lexora-800/50">
              <div className="text-[10px] font-semibold text-risk-medium uppercase mb-1">Why it matters</div>
              <p className="text-[11px] text-lexora-300 leading-relaxed">{risk.whyItMatters}</p>
            </div>

            {/* Evidence */}
            <div>
              <div className="text-[10px] font-semibold text-lexora-500 uppercase mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Evidence
              </div>
              <p className="text-[11px] text-lexora-400 italic leading-relaxed">{risk.evidence}</p>
            </div>

            {/* Source */}
            <div className="flex items-center gap-2">
              <button className="source-chip">
                Source → {risk.sourceLocation.section || 'Document'}
                {risk.sourceLocation.page && ` → Page ${risk.sourceLocation.page}`}
              </button>
              {risk.confidence !== 'high' && (
                <span className="text-[10px] text-lexora-600">
                  Confidence: {risk.confidence}
                </span>
              )}
            </div>

            {/* Suggested question */}
            <div className="p-3 rounded border border-accent-500/20 bg-accent-500/5">
              <div className="text-[10px] font-semibold text-accent-500 uppercase mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Question for counsel
              </div>
              <p className="text-[11px] text-lexora-300 leading-relaxed">{risk.suggestedQuestion}</p>
            </div>

            {/* Benchmark Gauge */}
            {risk.marketStandard && (
              <div className="p-3 rounded border border-lexora-700 bg-lexora-900/50">
                <div className="text-[10px] font-semibold text-lexora-400 uppercase mb-2 flex items-center gap-1">
                  <BarChart className="w-3 h-3" /> Market Standard Benchmark
                </div>
                
                {/* Meter */}
                <div className="flex items-center gap-1 h-2 mb-2">
                  <div className={`h-full flex-1 rounded-l-full ${risk.marketDeviation === 'favorable' ? 'bg-accent-500' : 'bg-lexora-800'}`} />
                  <div className={`h-full flex-1 ${risk.marketDeviation === 'standard' ? 'bg-lexora-400' : 'bg-lexora-800'}`} />
                  <div className={`h-full flex-1 ${risk.marketDeviation === 'unfavorable' ? 'bg-risk-medium' : 'bg-lexora-800'}`} />
                  <div className={`h-full flex-1 rounded-r-full ${risk.marketDeviation === 'highly-unfavorable' ? 'bg-risk-high' : 'bg-lexora-800'}`} />
                </div>
                <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-lexora-600 mb-3">
                  <span>Pro-You</span>
                  <span>Standard</span>
                  <span className={risk.marketDeviation?.includes('unfavorable') ? 'text-risk-high' : ''}>Pro-Client</span>
                </div>

                <p className="text-[11px] text-lexora-300 leading-relaxed italic border-l-2 border-lexora-600 pl-2">
                  {risk.marketStandard}
                </p>
              </div>
            )}
          </motion.div>
        ))
      )}

      {/* Inconsistencies */}
      {analysis.inconsistencies.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider mb-2 mt-6">
            Potential Inconsistencies
          </h3>
          {analysis.inconsistencies.map(inc => (
            <div key={inc.id} className="p-3 rounded-lg border border-risk-low/20 bg-risk-low/5 mb-2">
              <p className="text-xs text-lexora-300">{inc.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
