/**
 * Q&A API route — grounded document question answering.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { retrieveRelevantChunks } from '@/lib/documents/retrieval';
import { checkRateLimit } from '@/lib/security';
import type { ParsedDocument, DocumentAnalysis } from '@/types/document';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(`qa-${clientIP}`, 20, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { question, document: doc, analysis } = body as {
      question: string;
      document: ParsedDocument;
      analysis: DocumentAnalysis;
    };

    if (!question || !doc || !analysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (question.length > 1000) {
      return NextResponse.json({ error: 'Question too long' }, { status: 400 });
    }

    // Retrieve relevant chunks
    const relevantChunks = retrieveRelevantChunks(question, doc.chunks, 5);

    // Get AI provider and answer
    const provider = getAIProvider();
    const answer = await provider.answerQuestion(question, doc, analysis, relevantChunks);

    return NextResponse.json({ answer, provider: provider.name });
  } catch (error) {
    console.error('Q&A error:', error);
    return NextResponse.json(
      { error: 'Failed to process question. Please try again.' },
      { status: 500 }
    );
  }
}
