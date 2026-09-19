/**
 * AI Provider abstraction for LEXORA.
 * Allows switching between Gemini and Demo providers.
 */
import type {
  DocumentAnalysis,
  GroundedAnswer,
  ComparisonResult,
  ActionPlan,
  LawyerBrief,
  ParsedDocument,
  DocumentChunk,
} from '@/types/document';

export interface AIProvider {
  readonly name: string;
  readonly isDemo: boolean;

  /** Analyze a document and produce structured analysis */
  analyzeDocument(doc: ParsedDocument): Promise<DocumentAnalysis>;

  /** Answer a question grounded in document content */
  answerQuestion(
    question: string,
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
    relevantChunks: DocumentChunk[],
  ): Promise<GroundedAnswer>;

  /** Compare two documents */
  compareDocuments(
    docA: ParsedDocument,
    docB: ParsedDocument,
    analysisA: DocumentAnalysis,
    analysisB: DocumentAnalysis,
  ): Promise<ComparisonResult>;

  /** Generate an action plan from analysis */
  generateActionPlan(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
  ): Promise<ActionPlan>;

  /** Generate a lawyer brief from analysis */
  generateLawyerBrief(
    doc: ParsedDocument,
    analysis: DocumentAnalysis,
    userNotes: string[],
  ): Promise<LawyerBrief>;
}

/** Get the appropriate AI provider based on environment */
export function getAIProvider(): AIProvider {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (openAIKey) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OpenAIProvider } = require('./openai');
    return new OpenAIProvider(openAIKey);
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    // Dynamically import to avoid loading Gemini SDK when not needed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GeminiProvider } = require('./gemini');
    return new GeminiProvider(geminiKey);
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DemoProvider } = require('./demo');
  return new DemoProvider();
}
