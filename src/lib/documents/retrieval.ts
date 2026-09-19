/**
 * Lightweight retrieval system for document Q&A.
 * Uses keyword scoring + section metadata for chunk retrieval.
 * No vector database required.
 */
import type { DocumentChunk, SearchResult } from '@/types/document';

/** Retrieve relevant chunks for a question */
export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 5,
): DocumentChunk[] {
  const queryTokens = tokenize(query);

  const scored = chunks.map(chunk => ({
    chunk,
    score: calculateRelevance(queryTokens, chunk),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter(s => s.score > 0)
    .slice(0, topK)
    .map(s => s.chunk);
}

/** Search across document content */
export function searchDocument(
  query: string,
  chunks: DocumentChunk[],
  clauses: { id: string; title: string; originalText: string; plainLanguage: string; sourceLocation: { section?: string } }[] = [],
  questions: { id: string; question: string }[] = [],
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryTokens = tokenize(query);

  // Search chunks
  for (const chunk of chunks) {
    const score = calculateRelevance(queryTokens, chunk);
    if (score > 0 || chunk.text.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `search-chunk-${chunk.id}`,
        type: 'document',
        title: chunk.section || `Chunk ${chunk.id}`,
        excerpt: highlightExcerpt(chunk.text, lowerQuery),
        sourceLocation: { section: chunk.section, chunkId: chunk.id },
        relevanceScore: score + (chunk.text.toLowerCase().includes(lowerQuery) ? 2 : 0),
      });
    }
  }

  // Search clauses
  for (const clause of clauses) {
    const text = `${clause.title} ${clause.originalText} ${clause.plainLanguage}`;
    if (text.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `search-clause-${clause.id}`,
        type: 'clause',
        title: clause.title,
        excerpt: highlightExcerpt(clause.plainLanguage, lowerQuery),
        sourceLocation: clause.sourceLocation,
        relevanceScore: 3,
      });
    }
  }

  // Search questions
  for (const q of questions) {
    if (q.question.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: `search-question-${q.id}`,
        type: 'question',
        title: q.question,
        excerpt: q.question,
        relevanceScore: 2,
      });
    }
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, 20);
}

/** Tokenize text into normalized tokens */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)
    .filter(t => !STOP_WORDS.has(t));
}

/** Calculate relevance score between query tokens and a chunk */
function calculateRelevance(queryTokens: string[], chunk: DocumentChunk): number {
  const chunkTokens = new Set(tokenize(chunk.text));
  let score = 0;

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) {
      score += 1;
    }
    // Partial match bonus
    for (const ct of chunkTokens) {
      if (ct.includes(token) || token.includes(ct)) {
        score += 0.5;
        break;
      }
    }
  }

  // Boost for keyword relevance
  const legalKeywords = ['termination', 'payment', 'liability', 'confidential', 'intellectual', 'property',
    'renewal', 'notice', 'obligation', 'indemnif', 'arbitrat', 'warrant', 'breach', 'penalty'];
  const chunkText = chunk.text.toLowerCase();
  for (const kw of legalKeywords) {
    for (const qt of queryTokens) {
      if (qt.includes(kw) && chunkText.includes(kw)) {
        score += 1;
      }
    }
  }

  return score;
}

/** Create an excerpt with context around the match */
function highlightExcerpt(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text.slice(0, 150);

  const start = Math.max(0, idx - 50);
  const end = Math.min(text.length, idx + query.length + 100);
  let excerpt = text.slice(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt += '...';
  return excerpt;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was',
  'one', 'our', 'out', 'has', 'have', 'been', 'did', 'get', 'may', 'its', 'let', 'say',
  'she', 'too', 'use', 'him', 'how', 'man', 'new', 'now', 'old', 'see', 'way', 'who',
  'boy', 'did', 'any', 'few', 'got', 'much', 'some', 'what', 'with', 'this', 'that',
  'from', 'they', 'been', 'will', 'each', 'make', 'like', 'then', 'them', 'than',
  'would', 'could', 'should', 'shall', 'does', 'about', 'which', 'their', 'there',
]);
