/**
 * Gemini AI Provider — real AI analysis using Google's Gemini API.
 * All calls are server-side only. API key is never exposed to the client.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
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
import {
  documentAnalysisSchema,
  groundedAnswerSchema,
  comparisonResultSchema,
  actionPlanSchema,
  lawyerBriefSchema,
} from '@/lib/validation/schemas';
import {
  DOCUMENT_ANALYSIS_PROMPT,
  QUESTION_ANSWERING_PROMPT,
  COMPARISON_PROMPT,
  ACTION_PLAN_PROMPT,
  LAWYER_BRIEF_PROMPT,
} from './prompts';

export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini';
  readonly isDemo = false;
  private client: GoogleGenerativeAI;
  private modelName = 'gemini-2.0-flash';

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async analyzeDocument(doc: ParsedDocument): Promise<DocumentAnalysis> {
    const prompt = DOCUMENT_ANALYSIS_PROMPT + doc.rawText.slice(0, 100000);
    const result = await this.generateJSON(prompt);

    const parsed = documentAnalysisSchema.safeParse({
      ...result,
      documentId: doc.id,
      analyzedAt: new Date().toISOString(),
    });

    if (!parsed.success) {
      // Retry once with correction
      const retryPrompt = `The previous response had validation errors: ${parsed.error.message}. Please fix and return valid JSON.\n\n${prompt}`;
      const retryResult = await this.generateJSON(retryPrompt);
      const retryParsed = documentAnalysisSchema.safeParse({
        ...retryResult,
        documentId: doc.id,
        analyzedAt: new Date().toISOString(),
      });
      if (!retryParsed.success) {
        throw new Error('AI response failed validation after retry');
      }
      return retryParsed.data as DocumentAnalysis;
    }

    return parsed.data as DocumentAnalysis;
  }

  async answerQuestion(
    question: string,
    _doc: ParsedDocument,
    _analysis: DocumentAnalysis,
    relevantChunks: DocumentChunk[],
  ): Promise<GroundedAnswer> {
    const chunksText = relevantChunks
      .map(c => `[Chunk ${c.id} | Section: ${c.section || 'N/A'} | Page: ${c.pageNumber || 'N/A'}]\n${c.text}`)
      .join('\n\n---\n\n');

    const prompt = QUESTION_ANSWERING_PROMPT + chunksText + '\n\n---\n\nUSER QUESTION:\n' + question;
    const result = await this.generateJSON(prompt);

    const parsed = groundedAnswerSchema.safeParse(result);
    if (!parsed.success) {
      return {
        answer: 'I encountered an issue processing the AI response. The information below may be incomplete.',
        evidence: [],
        uncertainties: ['AI response validation failed'],
        suggestedLawyerQuestions: ['Consider reviewing this question with a legal professional.'],
        isFromDocument: false,
      };
    }

    return parsed.data as GroundedAnswer;
  }

  async compareDocuments(
    docA: ParsedDocument,
    docB: ParsedDocument,
    _analysisA: DocumentAnalysis,
    _analysisB: DocumentAnalysis,
  ): Promise<ComparisonResult> {
    const prompt = COMPARISON_PROMPT +
      docA.rawText.slice(0, 50000) +
      '\n\n---\n\nDOCUMENT B:\n---\n' +
      docB.rawText.slice(0, 50000);

    const result = await this.generateJSON(prompt);

    const parsed = comparisonResultSchema.safeParse({
      ...result,
      documentAId: docA.id,
      documentBId: docB.id,
      documentATitle: docA.title,
      documentBTitle: docB.title,
      analyzedAt: new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new Error('Comparison result failed validation');
    }

    return parsed.data as ComparisonResult;
  }

  async generateActionPlan(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
  ): Promise<ActionPlan> {
    const analysisJson = JSON.stringify({
      title: analysis.title,
      clauses: analysis.clauses.map(c => ({ title: c.title, category: c.category, plainLanguage: c.plainLanguage, importance: c.importance })),
      obligations: analysis.obligations,
      deadlines: analysis.deadlines,
      risks: analysis.risks.map(r => ({ title: r.title, description: r.description, suggestedQuestion: r.suggestedQuestion })),
    });

    const prompt = ACTION_PLAN_PROMPT + analysisJson;
    const result = await this.generateJSON(prompt);

    const parsed = actionPlanSchema.safeParse({ ...result, documentId: doc.id });
    if (!parsed.success) {
      throw new Error('Action plan failed validation');
    }

    return parsed.data as ActionPlan;
  }

  async generateLawyerBrief(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
    userNotes: string[],
  ): Promise<LawyerBrief> {
    const analysisJson = JSON.stringify({
      title: analysis.title,
      summary: analysis.summary,
      clauses: analysis.clauses,
      obligations: analysis.obligations,
      deadlines: analysis.deadlines,
      monetaryTerms: analysis.monetaryTerms,
      risks: analysis.risks,
      inconsistencies: analysis.inconsistencies,
      recommendedReviewAreas: analysis.recommendedReviewAreas,
      userNotes,
    });

    const prompt = LAWYER_BRIEF_PROMPT + analysisJson;
    const result = await this.generateJSON(prompt);

    const parsed = lawyerBriefSchema.safeParse({ ...result, documentId: doc.id });
    if (!parsed.success) {
      throw new Error('Lawyer brief failed validation');
    }

    return parsed.data as LawyerBrief;
  }

  private async generateJSON(prompt: string): Promise<Record<string, unknown>> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
