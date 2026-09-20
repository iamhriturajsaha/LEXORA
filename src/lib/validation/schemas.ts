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
  id: z.string().catch(() => `cl-${Math.random().toString(36).substring(7)}`),
  title: z.string().catch('Untitled Clause'),
  category: z.string().catch('unknown'),
  originalText: z.string().catch(''),
  plainLanguage: z.string().catch(''),
  importance: z.enum(['critical', 'important', 'standard', 'informational']).catch('standard'),
  riskLevel: z.enum(['high', 'medium', 'low', 'info']).catch('info'),
  appliesTo: z.string().catch('Both parties'),
  sourceLocation: sourceLocationSchema.catch({}),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']).catch('unverified'),
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
  title: z.string().catch('Unknown Document'),
  documentType: z.string().catch('Unknown Type'),
  jurisdictionMentioned: z.preprocess((v) => (v === null ? undefined : v), z.string().optional()),
  summary: z.string().catch(''),
  keyFacts: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  clarityStatus: z.enum(['clear', 'needs-attention', 'complex']).catch('needs-attention'),
  clauses: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(analyzedClauseSchema)).catch([]),
  obligations: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(obligationSchema)).catch([]),
  deadlines: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(deadlineSchema)).catch([]),
  monetaryTerms: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(monetaryTermSchema)).catch([]),
  risks: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(riskSignalSchema)).catch([]),
  questions: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(generatedQuestionSchema)).catch([]),
  inconsistencies: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(inconsistencySchema)).catch([]),
  recommendedReviewAreas: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']).catch('unverified'),
  sourceReferences: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(evidenceSourceSchema)).catch([]),
  analyzedAt: z.string(),
});

export const groundedAnswerSchema = z.object({
  answer: z.string().catch('I could not process the answer.'),
  evidence: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(evidenceSourceSchema)).catch([]),
  uncertainties: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  suggestedLawyerQuestions: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  isFromDocument: z.boolean().catch(false),
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
  beforeSigning: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.object({
    id: z.string().catch(() => `ts-${Math.random().toString(36).substring(7)}`),
    text: z.string(),
    priority: z.enum(['high', 'medium', 'low']).catch('medium'),
    completed: z.boolean().catch(false),
    relatedClauseId: z.string().optional(),
  }))).catch([]),
  afterSigning: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.object({
    id: z.string().catch(() => `ts-${Math.random().toString(36).substring(7)}`),
    text: z.string(),
    priority: z.enum(['high', 'medium', 'low']).catch('medium'),
    completed: z.boolean().catch(false),
    relatedClauseId: z.string().optional(),
  }))).catch([]),
  questionsForCounsel: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  datesToRemember: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(deadlineSchema)).catch([]),
  informationToGather: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
});

export const lawyerBriefSchema = z.object({
  documentId: z.string(),
  overview: z.string().catch(''),
  parties: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  purpose: z.string().catch(''),
  importantObligations: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  keyDates: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  monetaryTerms: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  attentionAreas: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  ambiguities: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  keyQuestions: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  sectionsRequiringReview: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  userNotes: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())).catch([]),
  sourceReferences: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(evidenceSourceSchema)).catch([]),
  generatedAt: z.string().catch(() => new Date().toISOString()),
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
