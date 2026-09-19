/**
 * Action plan API route.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { checkRateLimit } from '@/lib/security';
import type { ParsedDocument, DocumentAnalysis } from '@/types/document';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`action-${clientIP}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const body = await request.json();
    const { document: doc, analysis } = body as {
      document: ParsedDocument;
      analysis: DocumentAnalysis;
    };

    if (!doc || !analysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const provider = getAIProvider();
    const plan = await provider.generateActionPlan(doc, analysis);

    return NextResponse.json({ actionPlan: plan, provider: provider.name });
  } catch (error) {
    console.error('Action plan error:', error);
    return NextResponse.json({ error: 'Failed to generate action plan' }, { status: 500 });
  }
}
