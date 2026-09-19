'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export function AIDisclaimer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg bg-lexora-900/95 border border-lexora-800 backdrop-blur-sm text-xs text-lexora-400 hover:text-lexora-300 transition-colors"
          aria-expanded={expanded}
          aria-controls="ai-disclaimer-content"
        >
          <span className="flex items-center gap-2">
            <Info className="w-3 h-3 text-accent-500" />
            AI-generated information — verify important decisions with a qualified legal professional.
          </span>
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              id="ai-disclaimer-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-4 rounded-lg bg-lexora-900 border border-lexora-800 text-xs text-lexora-400 space-y-3">
                <h4 className="text-sm font-semibold text-lexora-200">How LEXORA reasons</h4>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>We identify relevant sections in your uploaded document.</li>
                  <li>We extract structured facts like clauses, obligations, dates, and monetary terms.</li>
                  <li>We generate explanations grounded in those specific sections.</li>
                  <li>We attach source references so you can verify every claim.</li>
                  <li>We flag uncertainty instead of guessing — if the answer isn&apos;t in the document, we say so.</li>
                </ol>
                <p className="text-lexora-500 pt-2 border-t border-lexora-800">
                  LEXORA provides informational assistance based on the documents you provide. It is not a law firm and does not provide legal advice. Important decisions should be reviewed with a qualified legal professional.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
