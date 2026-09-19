/**
 * Security utilities for LEXORA.
 * Handles sanitization, validation, and prompt injection defense.
 */
import DOMPurify from 'dompurify';
import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_CONTENT_LENGTH } from '@/lib/validation/schemas';

/** Sanitize HTML content to prevent XSS */
export function sanitizeHTML(html: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['class', 'id'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'link', 'meta'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur', 'style'],
    });
  }
  // Server-side: strip all HTML tags
  return html.replace(/<[^>]*>/g, '');
}

/** Sanitize text content from uploaded documents */
export function sanitizeDocumentText(text: string): string {
  // Remove null bytes
  let sanitized = text.replace(/\0/g, '');
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Limit content length
  if (sanitized.length > MAX_CONTENT_LENGTH) {
    sanitized = sanitized.slice(0, MAX_CONTENT_LENGTH);
  }
  return sanitized;
}

/** Validate file upload */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(file: { name: string; size: number; type: string }): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Check extension
  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext as typeof ALLOWED_EXTENSIONS[number])) {
    return { valid: false, error: `File type "${ext}" is not supported. Supported types: ${ALLOWED_EXTENSIONS.join(', ')}` };
  }

  // Check MIME type (with fallback for common mismatches)
  const normalizedType = normalizeMimeType(file.type, ext);
  if (!ALLOWED_MIME_TYPES.includes(normalizedType as typeof ALLOWED_MIME_TYPES[number])) {
    return { valid: false, error: `File MIME type "${file.type}" is not supported` };
  }

  return { valid: true };
}

/** Get file extension */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : '';
}

/** Normalize MIME type handling common browser mismatches */
function normalizeMimeType(type: string, ext: string): string {
  // Some browsers report markdown as text/plain
  if (ext === '.md' && (type === 'text/plain' || type === '')) return 'text/markdown';
  // Some browsers don't recognize .txt properly
  if (ext === '.txt' && type === '') return 'text/plain';
  // Handle empty MIME types based on extension
  if (type === '' || type === 'application/octet-stream') {
    const mimeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeMap[ext] || type;
  }
  return type;
}

/** Check for potential prompt injection in document text */
export function containsPromptInjection(text: string): boolean {
  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /ignore\s+(all\s+)?prior\s+instructions/i,
    /disregard\s+(all\s+)?previous/i,
    /reveal\s+(your\s+)?system\s+(prompt|instructions)/i,
    /you\s+are\s+now\s+(a|an)\s+/i,
    /act\s+as\s+if\s+you\s+are/i,
    /pretend\s+you\s+are/i,
    /new\s+instructions?:/i,
    /override\s+(previous\s+)?instructions/i,
  ];

  return injectionPatterns.some(pattern => pattern.test(text));
}

/** Rate limiting helper (in-memory, suitable for hackathon) */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining };
}
