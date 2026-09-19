/**
 * Zod schemas for validating AI responses and user inputs.
 * These schemas ensure we never trust arbitrary model JSON.
 */
import { z } from 'zod';

export const sourceLocationSchema = z.object({
  page: z.preprocess((v) => (v === null ? undefined : v), z.number().optional()),
  section: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  chunkId: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  charStart: z.preprocess((v) => (v === null ? undefined : v), z.number().optional()),
  charEnd: z.preprocess((v) => (v === null ? undefined : v), z.number().optional()),
});

export const evidenceSourceSchema = z.object({
  claim: z.string(),
  sourceId: z.string(),
  page: z.number().optional(),
  section: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
  originalText: z.string().optional(),
});

export const analyzedClauseSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  originalText: z.string(),
  plainLanguage: z.string(),
  importance: z.enum(['critical', 'important', 'standard', 'informational']),
  riskLevel: z.enum(['high', 'medium', 'low', 'info']),
  appliesTo: z.string(),
  sourceLocation: sourceLocationSchema,
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
});

export const obligationSchema = z.object({
  id: z.string(),
  description: z.string(),
  party: z.string(),
  type: z.enum(['obligation', 'right', 'restriction']),
  deadline: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  sourceLocation: sourceLocationSchema,
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
});

export const deadlineSchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  period: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  isRecurring: z.boolean(),
  sourceLocation: sourceLocationSchema,
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
});

export const monetaryTermSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  frequency: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  conditions: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  type: z.enum(['payment', 'penalty', 'fee', 'other']).catch('other'),
  sourceLocation: sourceLocationSchema,
  confidence: z.enum(['high', 'medium', 'low', 'unverified']).catch('unverified'),
});

export const riskSignalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  riskLevel: z.enum(['high', 'medium', 'low', 'info']),
  category: z.string(),
  evidence: z.string(),
  sourceLocation: sourceLocationSchema,
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
  suggestedQuestion: z.string(),
});

export const generatedQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.string(),
  relevance: z.string(),
  sourceClauseId: z.string().optional(),
});

export const inconsistencySchema = z.object({
  id: z.string(),
  description: z.string(),
  locations: z.array(sourceLocationSchema),
  severity: z.enum(['high', 'medium', 'low', 'info']),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
});

export const documentAnalysisSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  documentType: z.string(),
  jurisdictionMentioned: z.string().optional(),
  summary: z.string(),
  keyFacts: z.array(z.string()),
  clarityStatus: z.enum(['clear', 'needs-attention', 'complex']),
  clauses: z.array(analyzedClauseSchema),
  obligations: z.array(obligationSchema),
  deadlines: z.array(deadlineSchema),
  monetaryTerms: z.array(monetaryTermSchema),
  risks: z.array(riskSignalSchema),
  questions: z.array(generatedQuestionSchema),
  inconsistencies: z.array(inconsistencySchema),
  recommendedReviewAreas: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
  sourceReferences: z.array(evidenceSourceSchema),
  analyzedAt: z.string(),
});

export const groundedAnswerSchema = z.object({
  answer: z.string(),
  evidence: z.array(evidenceSourceSchema),
  uncertainties: z.array(z.string()),
  suggestedLawyerQuestions: z.array(z.string()),
  isFromDocument: z.boolean(),
});

export const materialChangeSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  before: z.string(),
  after: z.string(),
  sourceA: sourceLocationSchema,
  sourceB: sourceLocationSchema,
});

export const comparisonChangeSchema = z.object({
  id: z.string(),
  type: z.enum(['unchanged', 'modified', 'added', 'removed']),
  category: z.string().optional(),
  significance: z.enum(['high', 'medium', 'low']),
  sectionA: z.string().optional(),
  sectionB: z.string().optional(),
  contentA: z.string().optional(),
  contentB: z.string().optional(),
  explanation: z.string().optional(),
});

export const comparisonResultSchema = z.object({
  documentAId: z.string(),
  documentBId: z.string(),
  documentATitle: z.string(),
  documentBTitle: z.string(),
  summary: z.string(),
  changes: z.array(comparisonChangeSchema),
  materialChanges: z.array(materialChangeSchema),
  analyzedAt: z.string(),
});

export const actionPlanSchema = z.object({
  documentId: z.string(),
  beforeSigning: z.array(z.object({
    id: z.string(),
    text: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    completed: z.boolean(),
    relatedClauseId: z.string().optional(),
  })),
  afterSigning: z.array(z.object({
    id: z.string(),
    text: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    completed: z.boolean(),
    relatedClauseId: z.string().optional(),
  })),
  questionsForCounsel: z.array(z.string()),
  datesToRemember: z.array(deadlineSchema),
  informationToGather: z.array(z.string()),
});

export const lawyerBriefSchema = z.object({
  documentId: z.string(),
  overview: z.string(),
  parties: z.array(z.string()),
  purpose: z.string(),
  importantObligations: z.array(z.string()),
  keyDates: z.array(z.string()),
  monetaryTerms: z.array(z.string()),
  attentionAreas: z.array(z.string()),
  ambiguities: z.array(z.string()),
  keyQuestions: z.array(z.string()),
  sectionsRequiringReview: z.array(z.string()),
  userNotes: z.array(z.string()),
  sourceReferences: z.array(evidenceSourceSchema),
  generatedAt: z.string(),
});

/** File upload validation */
export const fileUploadSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(10 * 1024 * 1024, 'File must be under 10MB'),
  type: z.string(),
});

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.docx'] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_CONTENT_LENGTH = 500_000; // ~500K chars
