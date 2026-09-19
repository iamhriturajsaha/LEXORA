/**
 * Comparison API route — compare two legal documents.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { checkRateLimit } from '@/lib/security';
import type { ParsedDocument, DocumentAnalysis } from '@/types/document';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`compare-${clientIP}`, 5, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const body = await request.json();
    const { documentA, documentB, analysisA, analysisB } = body as {
      documentA: ParsedDocument;
      documentB: ParsedDocument;
      analysisA: DocumentAnalysis;
      analysisB: DocumentAnalysis;
    };

    if (!documentA || !documentB) {
      return NextResponse.json({ error: 'Both documents are required' }, { status: 400 });
    }

    const provider = getAIProvider();
    const result = await provider.compareDocuments(documentA, documentB, analysisA, analysisB);

    return NextResponse.json({ comparison: result, provider: provider.name });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
  }
}
