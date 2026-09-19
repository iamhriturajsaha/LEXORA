/**
 * Lawyer brief API route.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { checkRateLimit } from '@/lib/security';
import type { ParsedDocument, DocumentAnalysis } from '@/types/document';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`brief-${clientIP}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const body = await request.json();
    const { document: doc, analysis, userNotes = [] } = body as {
      document: ParsedDocument;
      analysis: DocumentAnalysis;
      userNotes: string[];
    };

    if (!doc || !analysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const provider = getAIProvider();
    const brief = await provider.generateLawyerBrief(doc, analysis, userNotes);

    return NextResponse.json({ brief, provider: provider.name });
  } catch (error) {
    console.error('Lawyer brief error:', error);
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}
