/**
 * Demo AI Provider — makes the app fully functional without API credentials.
 * Uses precomputed analysis data for sample documents.
 */
import type { AIProvider } from './provider';
import type {
  DocumentAnalysis,
  GroundedAnswer,
  ComparisonResult,
  ActionPlan,
  LawyerBrief,
  ParsedDocument,
  DocumentChunk,
} from '@/types/document';
import { FREELANCE_ANALYSIS } from '@/data/demo-analysis';
import { DEMO_QA_RESPONSES, DEMO_COMPARISON } from '@/data/demo-qa';

export class DemoProvider implements AIProvider {
  readonly name = 'Demo';
  readonly isDemo = true;

  async analyzeDocument(doc: ParsedDocument): Promise<DocumentAnalysis> {
    // Simulate processing delay for realism
    await this.simulateDelay(1500);

    // Check if this is one of our demo documents
    if (doc.id.startsWith('demo-freelance')) {
      return { ...FREELANCE_ANALYSIS, documentId: doc.id };
    }

    // For non-demo documents, generate a basic analysis
    return this.generateBasicAnalysis(doc);
  }

  async answerQuestion(
    question: string,
    _doc: ParsedDocument,
    _analysis: DocumentAnalysis,
    relevantChunks: DocumentChunk[],
  ): Promise<GroundedAnswer> {
    await this.simulateDelay(800);

    // Check for exact match in precomputed responses
    const normalizedQuestion = question.trim();
    for (const [key, response] of Object.entries(DEMO_QA_RESPONSES)) {
      if (key === '__insufficient_evidence__') continue;
      if (normalizedQuestion.toLowerCase().includes(key.toLowerCase().slice(0, 20))) {
        return response;
      }
    }

    // For questions not in the precomputed set, return a grounded response from chunks
    if (relevantChunks.length > 0) {
      return {
        answer: `Based on the document, here is what I found relevant to your question:\n\n${relevantChunks.slice(0, 2).map(c => `"${c.text.slice(0, 200)}..."`).join('\n\n')}`,
        evidence: relevantChunks.slice(0, 2).map(c => ({
          claim: 'Relevant section found',
          sourceId: c.id,
          section: c.section || undefined,
          confidence: 'medium' as const,
          originalText: c.text.slice(0, 200),
        })),
        uncertainties: ['This is a demo response. For comprehensive AI-powered analysis, configure a Gemini API key.'],
        suggestedLawyerQuestions: ['Consider discussing this topic with a legal professional for a thorough assessment.'],
        isFromDocument: true,
      };
    }

    return DEMO_QA_RESPONSES['__insufficient_evidence__'];
  }

  async compareDocuments(
    docA: ParsedDocument,
    docB: ParsedDocument,
  ): Promise<ComparisonResult> {
    await this.simulateDelay(1200);

    if (docA.id.startsWith('demo-freelance') && docB.id.startsWith('demo-freelance')) {
      return DEMO_COMPARISON;
    }

    // Basic comparison for non-demo documents
    return {
      documentAId: docA.id,
      documentBId: docB.id,
      documentATitle: docA.title,
      documentBTitle: docB.title,
      summary: 'Document comparison generated in demo mode. For comprehensive AI-powered semantic comparison, configure a Gemini API key.',
      changes: [],
      materialChanges: [],
      analyzedAt: new Date().toISOString(),
    };
  }

  async generateActionPlan(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
  ): Promise<ActionPlan> {
    await this.simulateDelay(600);

    return {
      documentId: doc.id,
      beforeSigning: [
        { id: 'bs-1', text: 'Confirm the termination notice period and ensure you can meet the deadline requirements', priority: 'high', completed: false, relatedClauseId: 'cl-4' },
        { id: 'bs-2', text: 'Review the payment schedule and confirm the payment terms work for your cash flow', priority: 'high', completed: false, relatedClauseId: 'cl-1' },
        { id: 'bs-3', text: 'Understand the IP assignment — document any pre-existing tools or frameworks you intend to retain', priority: 'high', completed: false, relatedClauseId: 'cl-3' },
        { id: 'bs-4', text: 'Clarify the automatic renewal terms and set calendar reminders for notice deadlines', priority: 'medium', completed: false, relatedClauseId: 'cl-2' },
        { id: 'bs-5', text: 'Review the non-solicitation clause scope and duration', priority: 'medium', completed: false, relatedClauseId: 'cl-5' },
        { id: 'bs-6', text: 'Verify the arbitration location works for your situation', priority: 'low', completed: false, relatedClauseId: 'cl-10' },
      ],
      afterSigning: [
        { id: 'as-1', text: 'Set up invoicing process for first business day of each month', priority: 'high', completed: false },
        { id: 'as-2', text: 'Create a list of pre-existing Contractor Tools used in the project', priority: 'high', completed: false },
        { id: 'as-3', text: 'Set calendar reminders for renewal notice deadlines (30 days before term end)', priority: 'medium', completed: false },
        { id: 'as-4', text: 'Track hours worked to manage the 40-hour monthly limit', priority: 'medium', completed: false },
      ],
      questionsForCounsel: analysis.risks.map(r => r.suggestedQuestion),
      datesToRemember: analysis.deadlines,
      informationToGather: [
        'Bank account details for electronic payments',
        'List of pre-existing tools, libraries, and frameworks (Contractor Tools)',
        'Contact information for notices (email and physical address)',
        'Tax identification number for 1099 reporting',
      ],
    };
  }

  async generateLawyerBrief(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
    userNotes: string[],
  ): Promise<LawyerBrief> {
    await this.simulateDelay(800);

    return {
      documentId: doc.id,
      overview: analysis.summary,
      parties: ['Meridian Digital Solutions, LLC (Client)', '[Your Name] (Contractor)'],
      purpose: 'Engagement of independent contractor for web development and design services.',
      importantObligations: analysis.obligations.map(o => `${o.party}: ${o.description}`),
      keyDates: analysis.deadlines.map(d => `${d.description}: ${d.period || d.date || 'See document'}`),
      monetaryTerms: analysis.monetaryTerms.map(m => `${m.description}: ${m.amount || 'See document'}`),
      attentionAreas: analysis.risks.map(r => `${r.title}: ${r.description}`),
      ambiguities: analysis.inconsistencies.map(i => i.description),
      keyQuestions: analysis.risks.map(r => r.suggestedQuestion),
      sectionsRequiringReview: analysis.recommendedReviewAreas,
      userNotes,
      sourceReferences: analysis.sourceReferences,
      generatedAt: new Date().toISOString(),
    };
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateBasicAnalysis(doc: ParsedDocument): DocumentAnalysis {
    return {
      documentId: doc.id,
      title: doc.title || doc.fileName,
      documentType: 'Legal Document',
      summary: `This document contains ${doc.metadata.wordCount.toLocaleString()} words across ${doc.metadata.pageCount} page(s). Full AI analysis is available when a Gemini API key is configured. In demo mode, use the sample documents for the complete experience.`,
      keyFacts: ['Full AI analysis requires a Gemini API key.', 'Use the demo documents for the complete experience.'],
      clarityStatus: 'needs-attention',
      clauses: [],
      obligations: [],
      deadlines: [],
      monetaryTerms: [],
      risks: [],
      questions: [],
      inconsistencies: [],
      recommendedReviewAreas: [],
      confidence: 'low',
      sourceReferences: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}
