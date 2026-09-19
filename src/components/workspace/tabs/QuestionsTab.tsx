'use client';

import { useApp } from '@/lib/store';
import { useState, useCallback } from 'react';
import { Send, FileText, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GroundedAnswer, QAMessage } from '@/types/document';
import { v4Style } from '@/lib/documents/utils';

const SUGGESTED_QUESTIONS = [
  'When can I terminate this agreement?',
  'Who owns the final deliverables?',
  'How and when do I get paid?',
  'Does the agreement automatically renew?',
  'What happens if something goes wrong?',
];

export function QuestionsTab() {
  const { state, dispatch } = useApp();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const askQuestion = useCallback(async (q: string) => {
    if (!q.trim() || !state.document || !state.analysis) return;

    const userMessage: QAMessage = {
      id: `msg-${v4Style()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setQuestion('');
    setIsAsking(true);

    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          document: state.document,
          analysis: state.analysis,
        }),
      });

      if (!response.ok) throw new Error('Failed to get answer');

      const data = await response.json();
      const answer: GroundedAnswer = data.answer;

      const assistantMessage: QAMessage = {
        id: `msg-${v4Style()}`,
        role: 'assistant',
        content: answer.answer,
        evidence: answer.evidence,
        uncertainties: answer.uncertainties,
        suggestedLawyerQuestions: answer.suggestedLawyerQuestions,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch {
      const errorMessage: QAMessage = {
        id: `msg-${v4Style()}`,
        role: 'assistant',
        content: 'I was unable to process your question. Please try again.',
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      setIsAsking(false);
    }
  }, [state.document, state.analysis, dispatch]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <HelpCircle className="w-6 h-6 text-lexora-600 mx-auto mb-2" />
              <p className="text-sm text-lexora-400 mb-1">Ask about this document</p>
              <p className="text-[10px] text-lexora-600">Every answer cites its source. No hallucination.</p>
            </div>

            {/* Suggested questions */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-lexora-500 uppercase tracking-wider">Suggested questions</div>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(q)}
                  className="w-full text-left p-2.5 rounded-lg border border-lexora-800 bg-lexora-900/30 text-xs text-lexora-300 hover:border-accent-500/30 hover:text-lexora-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          state.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={msg.role === 'user' ? 'flex justify-end' : ''}
            >
              {msg.role === 'user' ? (
                <div className="px-3 py-2 rounded-lg bg-accent-600/20 text-xs text-lexora-200 max-w-[85%]">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Answer */}
                  <div className="text-xs text-lexora-300 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Evidence */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="space-y-1.5">
                      {msg.evidence.map((ev, i) => (
                        <button key={i} className="source-chip">
                          <FileText className="w-3 h-3" />
                          {ev.section || ev.sourceId}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Uncertainties */}
                  {msg.uncertainties && msg.uncertainties.length > 0 && (
                    <div className="p-2 rounded bg-risk-low/5 border border-risk-low/20">
                      <div className="text-[10px] font-semibold text-risk-low uppercase mb-1">What is uncertain</div>
                      {msg.uncertainties.map((u, i) => (
                        <p key={i} className="text-[11px] text-lexora-400">{u}</p>
                      ))}
                    </div>
                  )}

                  {/* Lawyer questions */}
                  {msg.suggestedLawyerQuestions && msg.suggestedLawyerQuestions.length > 0 && (
                    <div className="p-2 rounded bg-accent-500/5 border border-accent-500/20">
                      <div className="text-[10px] font-semibold text-accent-500 uppercase mb-1">What to ask a lawyer</div>
                      {msg.suggestedLawyerQuestions.map((q, i) => (
                        <p key={i} className="text-[11px] text-lexora-400">• {q}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}

        {isAsking && (
          <div className="flex items-center gap-2 text-xs text-lexora-500">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            Searching document...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-lexora-800">
        <form
          onSubmit={(e) => { e.preventDefault(); askQuestion(question); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this document..."
            className="flex-1 px-3 py-2 rounded-lg bg-lexora-900 border border-lexora-800 text-xs text-lexora-200 placeholder:text-lexora-600 focus:border-accent-500/50 focus:outline-none"
            disabled={isAsking}
            aria-label="Ask a question about the document"
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="p-2 rounded-lg bg-accent-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-500 transition-colors"
            aria-label="Send question"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
