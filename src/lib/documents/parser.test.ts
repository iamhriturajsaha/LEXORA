import { describe, it, expect } from 'vitest';
import { parseDocumentFromText } from './parser';

describe('Document Parser', () => {
  it('parses raw text into chunked Document format', () => {
    const text = 'This is a test document.\n\nIt has multiple paragraphs.\n\nParagraph 3 is here.';
    const doc = parseDocumentFromText(text, 'test.txt', 'doc-123');
    
    expect(doc.id).toBe('doc-123');
    expect(doc.title).toBe('This is a test document.');
    expect(doc.chunks.length).toBeGreaterThan(0);
    expect(doc.rawText).toBe(text);
  });

  it('handles empty text gracefully', () => {
    const doc = parseDocumentFromText('', 'empty.txt', 'doc-123');
    expect(doc.chunks.length).toBe(0);
    expect(doc.rawText).toBe('');
  });
});
