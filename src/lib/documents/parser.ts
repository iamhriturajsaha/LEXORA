/**
 * Document parsing and processing utilities.
 * Handles PDF, TXT, MD, and DOCX extraction with structure detection.
 */
import type { ParsedDocument, DocumentPage, DocumentSection, DocumentChunk, SupportedFileType } from '@/types/document';
import { sanitizeDocumentText, getFileExtension } from '@/lib/security';
import { v4Style } from './utils';

/** Parse a document from a Buffer based on file type */
export async function parseDocument(
  buffer: Buffer,
  fileName: string,
  fileType: SupportedFileType,
): Promise<ParsedDocument> {
  let rawText: string;

  switch (fileType) {
    case 'pdf':
      rawText = await parsePDF(buffer);
      break;
    case 'docx':
      rawText = await parseDOCX(buffer);
      break;
    case 'txt':
    case 'md':
      rawText = buffer.toString('utf-8');
      break;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }

  rawText = sanitizeDocumentText(rawText);

  if (!rawText.trim()) {
    throw new Error('Document appears to be empty or could not be read');
  }

  const id = `doc-${v4Style()}`;
  const pages = detectPages(rawText, fileType);
  const sections = detectSections(rawText);
  const chunks = createChunks(rawText, sections);
  const title = detectTitle(rawText, fileName);
  const metadata = {
    pageCount: pages.length || 1,
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
    characterCount: rawText.length,
    detectedType: detectDocumentType(rawText),
    detectedJurisdiction: detectJurisdiction(rawText),
    parties: detectParties(rawText),
  };

  return {
    id,
    fileName,
    fileType,
    title,
    rawText,
    pages,
    sections,
    chunks,
    metadata,
    uploadedAt: new Date().toISOString(),
  };
}

/** Parse text from a document string (for demo/client-side use) */
export function parseDocumentFromText(
  text: string,
  fileName: string,
  id?: string,
): ParsedDocument {
  const sanitized = sanitizeDocumentText(text);
  const pages = detectPages(sanitized, 'txt');
  const sections = detectSections(sanitized);
  const chunks = createChunks(sanitized, sections);
  const title = detectTitle(sanitized, fileName);

  return {
    id: id || `doc-${v4Style()}`,
    fileName,
    fileType: 'txt',
    title,
    rawText: sanitized,
    pages,
    sections,
    chunks,
    metadata: {
      pageCount: pages.length || 1,
      wordCount: sanitized.split(/\s+/).filter(Boolean).length,
      characterCount: sanitized.length,
      detectedType: detectDocumentType(sanitized),
      detectedJurisdiction: detectJurisdiction(sanitized),
      parties: detectParties(sanitized),
    },
    uploadedAt: new Date().toISOString(),
  };
}

/** Parse PDF */
async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF Parse Error:', errData.parserError);
        reject(new Error('Failed to parse PDF. The file may be corrupted, encrypted, or in an unsupported format.'));
      });

      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.parseBuffer(buffer);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('PDF Parse Error:', error);
      reject(new Error('Failed to parse PDF. Details: ' + msg));
    }
  });
}

/** Parse DOCX */
async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch {
    throw new Error('Failed to parse DOCX. The file may be corrupted or in an unsupported format.');
  }
}

/** Detect pages based on text markers */
function detectPages(text: string, fileType: SupportedFileType): DocumentPage[] {
  const pages: DocumentPage[] = [];

  if (fileType === 'pdf') {
    // PDF parser often preserves page breaks as form feeds
    const pageSplits = text.split(/\f/);
    let offset = 0;
    pageSplits.forEach((content, i) => {
      if (content.trim()) {
        pages.push({
          pageNumber: i + 1,
          content: content.trim(),
          startOffset: offset,
          endOffset: offset + content.length,
        });
      }
      offset += content.length + 1;
    });
  }

  if (pages.length === 0) {
    // Fallback: create synthetic pages every ~3000 chars
    const pageSize = 3000;
    const lines = text.split('\n');
    let currentPage: string[] = [];
    let currentLength = 0;
    let pageNumber = 1;
    let startOffset = 0;

    for (const line of lines) {
      currentPage.push(line);
      currentLength += line.length + 1;
      if (currentLength >= pageSize) {
        const content = currentPage.join('\n');
        pages.push({
          pageNumber,
          content,
          startOffset,
          endOffset: startOffset + content.length,
        });
        pageNumber++;
        startOffset += content.length + 1;
        currentPage = [];
        currentLength = 0;
      }
    }
    if (currentPage.length > 0) {
      const content = currentPage.join('\n');
      pages.push({
        pageNumber,
        content,
        startOffset,
        endOffset: startOffset + content.length,
      });
    }
  }

  return pages;
}

/** Detect sections from headings and numbering */
function detectSections(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = text.split('\n');
  let currentSection: DocumentSection | null = null;
  let offset = 0;

  const headingPatterns = [
    /^#{1,6}\s+(.+)/,                           // Markdown headings
    /^(\d+)\.\s+([A-Z][A-Z\s/&]+)$/,            // Numbered sections like "1. SCOPE OF SERVICES"
    /^(\d+\.\d+)\s+(.+)/,                        // Subsections like "1.1 Services"
    /^(SECTION|ARTICLE)\s+\d+[.:]\s*(.+)/i,     // "SECTION 1: Title"
    /^([A-Z][A-Z\s/&]{3,})$/,                    // ALL CAPS headings
    /^(EXHIBIT|SCHEDULE|APPENDIX)\s+[A-Z]/i,    // Exhibits/Schedules
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      offset += lines[i].length + 1;
      continue;
    }

    let isHeading = false;
    let title = '';
    let level = 1;

    for (const pattern of headingPatterns) {
      const match = line.match(pattern);
      if (match) {
        isHeading = true;
        if (match.length > 2) {
          title = match[2].trim();
          // Determine level from numbering
          const numParts = (match[1] || '').split('.');
          level = numParts.length;
        } else if (match.length > 1) {
          title = match[1].trim();
        } else {
          title = line;
        }
        break;
      }
    }

    if (isHeading && title.length > 2 && title.length < 100) {
      // Close previous section
      if (currentSection) {
        currentSection.endOffset = offset - 1;
      }

      const sectionId = `sec-${sections.length + 1}`;
      currentSection = {
        id: sectionId,
        title,
        level,
        content: '',
        startOffset: offset,
        endOffset: offset,
      };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    }

    offset += lines[i].length + 1;
  }

  // Close last section
  if (currentSection) {
    currentSection.endOffset = offset;
  }

  return sections;
}

/** Create chunks for retrieval */
function createChunks(text: string, sections: DocumentSection[]): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const targetChunkSize = 1000; // chars

  if (sections.length > 0) {
    // Use sections as natural chunk boundaries
    for (const section of sections) {
      const sectionText = section.content || '';
      if (sectionText.length <= targetChunkSize) {
        chunks.push({
          id: `chunk-${chunks.length + 1}`,
          text: `${section.title}\n${sectionText}`.trim(),
          section: section.title,
          startOffset: section.startOffset,
          endOffset: section.endOffset,
          tokenEstimate: Math.ceil(sectionText.length / 4),
        });
      } else {
        // Split large sections
        const parts = splitText(sectionText, targetChunkSize);
        for (const part of parts) {
          chunks.push({
            id: `chunk-${chunks.length + 1}`,
            text: `${section.title}\n${part}`.trim(),
            section: section.title,
            startOffset: section.startOffset,
            endOffset: section.endOffset,
            tokenEstimate: Math.ceil(part.length / 4),
          });
        }
      }
    }
  } else {
    // Fallback: split by paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    let offset = 0;
    for (const para of paragraphs) {
      if (para.trim()) {
        chunks.push({
          id: `chunk-${chunks.length + 1}`,
          text: para.trim(),
          startOffset: offset,
          endOffset: offset + para.length,
          tokenEstimate: Math.ceil(para.length / 4),
        });
      }
      offset += para.length + 2;
    }
  }

  return chunks;
}

/** Split text into roughly equal parts */
function splitText(text: string, maxSize: number): string[] {
  const parts: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxSize && current.length > 0) {
      parts.push(current.trim());
      current = '';
    }
    current += (current ? ' ' : '') + sentence;
  }
  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

/** Detect document title from first lines */
function detectTitle(text: string, fallback: string): string {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length > 0) {
    const first = lines[0].trim();
    // Check if it looks like a title
    if (first.length < 100 && first.length > 3) {
      return first.replace(/^#+\s*/, '');
    }
  }
  return fallback.replace(/\.[^.]+$/, '');
}

/** Detect document type from content */
function detectDocumentType(text: string): string {
  const lower = text.toLowerCase();
  const typePatterns: [RegExp, string][] = [
    [/freelance\s+services?\s+agreement/i, 'Freelance Services Agreement'],
    [/employment\s+(offer|agreement)/i, 'Employment Agreement'],
    [/offer\s+(of\s+)?employment/i, 'Employment Offer Letter'],
    [/lease\s+agreement/i, 'Lease Agreement'],
    [/residential\s+lease/i, 'Residential Lease Agreement'],
    [/non-?disclosure\s+agreement/i, 'Non-Disclosure Agreement'],
    [/nda/i, 'Non-Disclosure Agreement'],
    [/service\s+agreement/i, 'Service Agreement'],
    [/consulting\s+agreement/i, 'Consulting Agreement'],
    [/vendor\s+agreement/i, 'Vendor Agreement'],
    [/terms\s+(and|&)\s+conditions/i, 'Terms and Conditions'],
    [/saas\s+(subscription\s+)?agreement/i, 'SaaS Agreement'],
  ];

  for (const [pattern, type] of typePatterns) {
    if (pattern.test(lower)) return type;
  }
  return 'Legal Document';
}

/** Detect jurisdiction references */
function detectJurisdiction(text: string): string | undefined {
  const patterns = [
    /governed\s+by\s+(?:and\s+construed\s+in\s+accordance\s+with\s+)?the\s+laws?\s+of\s+(?:the\s+)?(.+?)(?:\.|,)/i,
    /jurisdiction\s+of\s+(?:the\s+)?(.+?)(?:\.|,)/i,
    /state\s+of\s+(\w+(?:\s+\w+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return undefined;
}

/** Detect party names */
function detectParties(text: string): string[] {
  const parties: string[] = [];
  const patterns = [
    /(?:CLIENT|LANDLORD|EMPLOYER|COMPANY|LICENSOR):\s*(.+?)(?:\n|,\s*a\s)/im,
    /(?:CONTRACTOR|TENANT|EMPLOYEE|LICENSEE):\s*(.+?)(?:\n|,\s*a\s)/im,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) parties.push(match[1].trim());
  }
  return parties;
}

/** Determine file type from extension */
export function getFileType(fileName: string): SupportedFileType | null {
  const ext = getFileExtension(fileName);
  const typeMap: Record<string, SupportedFileType> = {
    '.pdf': 'pdf',
    '.txt': 'txt',
    '.md': 'md',
    '.docx': 'docx',
  };
  return typeMap[ext] || null;
}
