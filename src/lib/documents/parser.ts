import type { ParsedDocument, SupportedFileType } from '@/types/document';
import { sanitizeDocumentText } from '@/lib/security';
import { v4Style } from './utils';
import { detectPages, detectSections, createChunks, detectTitle, detectDocumentType, detectJurisdiction, detectParties } from './text-parser';
export * from './text-parser';
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
/** Parse PDF using unpdf (Edge-safe, zero kerning errors) */
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import('unpdf');
    const { text } = await extractText(new Uint8Array(buffer));
    return Array.isArray(text) ? text.join('\n') : text;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('PDF Parse Error:', error);
    throw new Error('Failed to parse PDF cleanly. Details: ' + msg);
  }
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