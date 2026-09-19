'use client';

import { useApp } from '@/lib/store';
import { useMemo, useState, useEffect } from 'react';

export function DocumentReader() {
  const { state, dispatch } = useApp();
  const { document: doc, analysis, plainLanguageMode, selectedClauseId, searchQuery } = state;

  if (!doc) return null;

  // Build searchable highlighted content
  const renderedSections = useMemo(() => {
    return doc.sections.length > 0
      ? doc.sections.map(section => ({
          ...section,
          matchingClause: analysis?.clauses.find(c =>
            c.sourceLocation.section?.includes(section.title.slice(0, 20)) ||
            section.content.includes(c.originalText.slice(0, 50))
          ),
        }))
      : null;
  }, [doc.sections, analysis?.clauses]);

  // Highlight search terms and decrypt jargon
  function highlightText(text: string): React.ReactNode[] {
    let result: React.ReactNode[] = [text];
    
    // Process search query
    if (searchQuery && searchQuery.length >= 2) {
      const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
      result = result.flatMap((part) => {
        if (typeof part !== 'string') return part;
        return part.split(regex).map((subPart, i) =>
          subPart.toLowerCase() === searchQuery.toLowerCase()
            ? <mark key={`search-${i}`} className="bg-accent-500/30 text-accent-200 rounded px-0.5">{subPart}</mark>
            : subPart
        );
      });
    }

    return result;
  }

  // Context-Aware Scrolling: Observer
  useEffect(() => {
    if (!renderedSections) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '');
          const section = renderedSections.find(s => s.id === sectionId);
          // Only dispatch if the clause actually changed, to avoid rapid firing
          if (section?.matchingClause && section.matchingClause.id !== selectedClauseId) {
            dispatch({ type: 'SELECT_CLAUSE', payload: section.matchingClause.id });
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Triggers when section is actively in the middle of viewport
      threshold: 0
    });

    // We use a small timeout to ensure DOM is painted before observing
    const timeout = setTimeout(() => {
      renderedSections.forEach(section => {
        const el = document.getElementById(`section-${section.id}`);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [renderedSections, dispatch, selectedClauseId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pb-24 relative">
      {/* Document title */}
      <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-2 tracking-tight leading-tight">{analysis?.title || doc.title}</h2>
      {analysis?.documentType && (
        <div className="text-sm font-semibold tracking-widest text-accent-500 uppercase mb-12">{analysis.documentType}</div>
      )}

      {/* Rendered document */}
      <div className="document-content space-y-12">
        {renderedSections ? (
          renderedSections.map((section) => {
            const isSelected = section.matchingClause?.id === selectedClauseId;
            return (
              <div key={section.id} id={`section-${section.id}`} className="relative group">
                
                <h3
                  className={`font-display font-bold mb-4 transition-colors ${isSelected ? 'text-accent-400' : 'text-lexora-100'}`}
                  style={{ fontSize: `${Math.max(1.2, 2.5 - section.level * 0.3)}rem` }}
                >
                  {highlightText(section.title)}
                </h3>

                <div className={`relative pl-4 border-l-2 transition-all duration-300 ${isSelected ? 'border-accent-500' : 'border-lexora-800/50 group-hover:border-lexora-600'}`}>
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className="text-base md:text-lg leading-relaxed text-lexora-300 mb-4 font-light">
                      {highlightText(line)}
                    </p>
                  ))}

                  {/* Plain language overlay */}
                  {plainLanguageMode && section.matchingClause && (
                    <div className="mt-3 p-3 rounded-lg bg-accent-500/5 border border-accent-500/20">
                      <div className="text-[10px] font-semibold text-accent-500 uppercase tracking-wider mb-1">
                        In simple terms
                      </div>
                      <p className="text-xs text-lexora-300 leading-relaxed">
                        {section.matchingClause.plainLanguage}
                      </p>
                      <button
                        className="source-chip mt-2"
                        onClick={() => {
                          // Already at source
                        }}
                      >
                        {section.matchingClause.sourceLocation.section || 'Source'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // Fallback: render raw text with page breaks
          doc.pages.map((page) => (
            <div key={page.pageNumber} id={`page-${page.pageNumber}`} className="mb-8">
              <div className="text-[10px] text-lexora-600 font-mono mb-2">Page {page.pageNumber}</div>
              {page.content.split('\n').map((line, i) => (
                <p key={i} className="text-sm leading-relaxed text-lexora-300">
                  {highlightText(line)}
                </p>
              ))}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

