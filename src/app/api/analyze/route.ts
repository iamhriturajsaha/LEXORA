/**
 * Document analysis API route.
 * Handles file upload, parsing, and AI analysis.
 * All AI calls are server-side — API keys never exposed to client.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { parseDocument, getFileType } from '@/lib/documents/parser';
import { validateFileUpload, checkRateLimit, sanitizeDocumentText } from '@/lib/security';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`analyze-${clientIP}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFileUpload({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const fileType = getFileType(file.name);
    if (!fileType) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Parse document
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedDoc = await parseDocument(buffer, file.name, fileType);

    // Get AI provider and analyze
    const provider = getAIProvider();
    const analysis = await provider.analyzeDocument(parsedDoc);

    return NextResponse.json({
      document: {
        id: parsedDoc.id,
        fileName: parsedDoc.fileName,
        fileType: parsedDoc.fileType,
        title: parsedDoc.title,
        rawText: sanitizeDocumentText(parsedDoc.rawText),
        pages: parsedDoc.pages,
        sections: parsedDoc.sections,
        chunks: parsedDoc.chunks,
        metadata: parsedDoc.metadata,
        uploadedAt: parsedDoc.uploadedAt,
      },
      analysis,
      provider: provider.name,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
