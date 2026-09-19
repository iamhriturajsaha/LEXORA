/**
 * Core domain types for LEXORA document intelligence.
 * These types represent the structured output of the AI analysis pipeline.
 */

/** Supported document file types */
export type SupportedFileType = 'pdf' | 'txt' | 'md' | 'docx';

/** Source location within a document */
export interface SourceLocation {
  page?: number;
  section?: string;
  chunkId?: string;
  charStart?: number;
  charEnd?: number;
}

/** Evidence source for any AI-generated claim */
export interface EvidenceSource {
  claim: string;
  sourceId: string;
  page?: number;
  section?: string;
  confidence: ConfidenceLevel;
  originalText?: string;
}

/** Confidence levels for AI assessments */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified';

/** Risk severity levels */
export type RiskLevel = 'high' | 'medium' | 'low' | 'info';

/** Importance levels for clauses */
export type ImportanceLevel = 'critical' | 'important' | 'standard' | 'informational';

/** Clause categories - deterministic taxonomy */
export type ClauseCategory =
  | 'payment'
  | 'compensation'
  | 'term'
  | 'renewal'
  | 'termination'
  | 'notice'
  | 'confidentiality'
  | 'intellectual-property'
  | 'non-compete'
  | 'non-solicitation'
  | 'liability'
  | 'indemnity'
  | 'warranty'
  | 'data-privacy'
  | 'dispute-resolution'
  | 'governing-law'
  | 'jurisdiction'
  | 'arbitration'
  | 'insurance'
  | 'exclusivity'
  | 'restrictive-covenant'
  | 'assignment'
  | 'force-majeure'
  | 'automatic-renewal'
  | 'late-fees'
  | 'penalties'
  | 'security-deposit'
  | 'performance-obligations'
  | 'deliverables'
  | 'exceptions'
  | 'definitions'
  | 'unknown';

/** Display labels for clause categories */
export const CLAUSE_CATEGORY_LABELS: Record<ClauseCategory, string> = {
  'payment': 'Payment',
  'compensation': 'Compensation',
  'term': 'Term',
  'renewal': 'Renewal',
  'termination': 'Termination',
  'notice': 'Notice',
  'confidentiality': 'Confidentiality',
  'intellectual-property': 'Intellectual Property',
  'non-compete': 'Non-Compete',
  'non-solicitation': 'Non-Solicitation',
  'liability': 'Liability',
  'indemnity': 'Indemnity',
  'warranty': 'Warranty',
  'data-privacy': 'Data / Privacy',
  'dispute-resolution': 'Dispute Resolution',
  'governing-law': 'Governing Law',
  'jurisdiction': 'Jurisdiction',
  'arbitration': 'Arbitration',
  'insurance': 'Insurance',
  'exclusivity': 'Exclusivity',
  'restrictive-covenant': 'Restrictive Covenant',
  'assignment': 'Assignment',
  'force-majeure': 'Force Majeure',
  'automatic-renewal': 'Automatic Renewal',
  'late-fees': 'Late Fees',
  'penalties': 'Penalties',
  'security-deposit': 'Security / Deposit',
  'performance-obligations': 'Performance Obligations',
  'deliverables': 'Deliverables',
  'exceptions': 'Exceptions',
  'definitions': 'Definitions',
  'unknown': 'Unknown / Review',
};

/** Clarity status for a document */
export type ClarityStatus = 'clear' | 'needs-attention' | 'complex';

/** A parsed document */
export interface ParsedDocument {
  id: string;
  fileName: string;
  fileType: SupportedFileType;
  title: string;
  rawText: string;
  pages: DocumentPage[];
  sections: DocumentSection[];
  chunks: DocumentChunk[];
  metadata: DocumentMetadata;
  uploadedAt: string;
}

/** A page in a document */
export interface DocumentPage {
  pageNumber: number;
  content: string;
  startOffset: number;
  endOffset: number;
}

/** A section detected in a document */
export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  content: string;
  pageNumber?: number;
  startOffset: number;
  endOffset: number;
  children?: DocumentSection[];
}

/** A text chunk for retrieval */
export interface DocumentChunk {
  id: string;
  text: string;
  pageNumber?: number;
  section?: string;
  startOffset: number;
  endOffset: number;
  tokenEstimate: number;
}

/** Document metadata */
export interface DocumentMetadata {
  pageCount: number;
  wordCount: number;
  characterCount: number;
  detectedType?: string;
  detectedJurisdiction?: string;
  parties?: string[];
}

/** An analyzed clause */
export interface AnalyzedClause {
  id: string;
  title: string;
  category: ClauseCategory;
  originalText: string;
  plainLanguage: string;
  importance: ImportanceLevel;
  riskLevel: RiskLevel;
  appliesTo: string;
  sourceLocation: SourceLocation;
  confidence: ConfidenceLevel;
}

/** An identified obligation */
export interface Obligation {
  id: string;
  description: string;
  party: string;
  type: 'obligation' | 'right' | 'restriction';
  deadline?: string;
  sourceLocation: SourceLocation;
  confidence: ConfidenceLevel;
}

/** A deadline or important date */
export interface Deadline {
  id: string;
  description: string;
  date?: string;
  period?: string;
  isRecurring: boolean;
  sourceLocation: SourceLocation;
  confidence: ConfidenceLevel;
}

/** A monetary term */
export interface MonetaryTerm {
  id: string;
  description: string;
  amount?: string;
  frequency?: string;
  conditions?: string;
  sourceLocation: SourceLocation;
  confidence: ConfidenceLevel;
}

/** A risk or attention signal */
export interface RiskSignal {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  riskLevel: RiskLevel;
  category: string;
  evidence: string;
  sourceLocation: SourceLocation;
  confidence: ConfidenceLevel;
  suggestedQuestion: string;
  marketStandard?: string;
  marketDeviation?: 'favorable' | 'standard' | 'unfavorable' | 'highly-unfavorable';
}

/** A generated question about the document */
export interface GeneratedQuestion {
  id: string;
  question: string;
  category: string;
  relevance: string;
  sourceClauseId?: string;
}

/** An inconsistency detected in the document */
export interface Inconsistency {
  id: string;
  description: string;
  locations: SourceLocation[];
  severity: RiskLevel;
  confidence: ConfidenceLevel;
}

/** Full document analysis result */
export interface DocumentAnalysis {
  documentId: string;
  title: string;
  documentType: string;
  jurisdictionMentioned?: string;
  summary: string;
  keyFacts: string[];
  clarityStatus: ClarityStatus;
  clauses: AnalyzedClause[];
  obligations: Obligation[];
  deadlines: Deadline[];
  monetaryTerms: MonetaryTerm[];
  risks: RiskSignal[];
  questions: GeneratedQuestion[];
  inconsistencies: Inconsistency[];
  recommendedReviewAreas: string[];
  confidence: ConfidenceLevel;
  sourceReferences: EvidenceSource[];
  analyzedAt: string;
}

/** Risk radar dimensions */
export interface RiskRadar {
  financialExposure: RiskLevel;
  timeSensitivity: RiskLevel;
  terminationConstraints: RiskLevel;
  liabilityExposure: RiskLevel;
  ipOwnership: RiskLevel;
  dataPrivacy: RiskLevel;
  automaticRenewal: RiskLevel;
  asymmetricObligations: RiskLevel;
  ambiguity: RiskLevel;
}

/** Q&A message */
export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  evidence?: EvidenceSource[];
  uncertainties?: string[];
  suggestedLawyerQuestions?: string[];
  timestamp: string;
}

/** Q&A answer structure */
export interface GroundedAnswer {
  answer: string;
  evidence: EvidenceSource[];
  uncertainties: string[];
  suggestedLawyerQuestions: string[];
  isFromDocument: boolean;
}

/** Comparison result between two documents */
export interface ComparisonResult {
  documentAId: string;
  documentBId: string;
  documentATitle: string;
  documentBTitle: string;
  summary: string;
  changes: ComparisonChange[];
  materialChanges: MaterialChange[];
  analyzedAt: string;
}

/** A single comparison change */
export interface ComparisonChange {
  id: string;
  type: 'unchanged' | 'modified' | 'added' | 'removed';
  category?: ClauseCategory;
  significance: 'high' | 'medium' | 'low';
  sectionA?: string;
  sectionB?: string;
  contentA?: string;
  contentB?: string;
  explanation?: string;
}

/** A material/semantic change */
export interface MaterialChange {
  id: string;
  title: string;
  category: ClauseCategory;
  description: string;
  whyItMatters: string;
  before: string;
  after: string;
  sourceA: SourceLocation;
  sourceB: SourceLocation;
}

/** Action plan */
export interface ActionPlan {
  documentId: string;
  beforeSigning: ActionItem[];
  afterSigning: ActionItem[];
  questionsForCounsel: string[];
  datesToRemember: Deadline[];
  informationToGather: string[];
}

/** A single action item */
export interface ActionItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  relatedClauseId?: string;
}

/** Lawyer brief */
export interface LawyerBrief {
  documentId: string;
  overview: string;
  parties: string[];
  purpose: string;
  importantObligations: string[];
  keyDates: string[];
  monetaryTerms: string[];
  attentionAreas: string[];
  ambiguities: string[];
  keyQuestions: string[];
  sectionsRequiringReview: string[];
  userNotes: string[];
  sourceReferences: EvidenceSource[];
  generatedAt: string;
}

/** User note */
export interface UserNote {
  id: string;
  documentId: string;
  text: string;
  type: 'note' | 'question' | 'highlight';
  clauseId?: string;
  sourceLocation?: SourceLocation;
  createdAt: string;
  updatedAt: string;
}

/** Document history entry */
export interface DocumentHistoryEntry {
  id: string;
  title: string;
  fileName: string;
  fileType: SupportedFileType;
  documentType: string;
  uploadedAt: string;
  lastViewedAt: string;
  hasAnalysis: boolean;
}

/** Search result */
export interface SearchResult {
  id: string;
  type: 'document' | 'clause' | 'summary' | 'question';
  title: string;
  excerpt: string;
  sourceLocation?: SourceLocation;
  relevanceScore: number;
}
