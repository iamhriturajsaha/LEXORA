import { describe, it, expect } from 'vitest';
import { actionPlanSchema, groundedAnswerSchema, lawyerBriefSchema } from './schemas';

describe('Zod Schema Fallbacks', () => {
  it('actionPlanSchema applies default empty arrays when missing', () => {
    const rawAiOutput = { documentId: 'doc-123', overview: 'Summary here.' }; // missing arrays
    const parsed = actionPlanSchema.safeParse(rawAiOutput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.beforeSigning).toEqual([]);
      expect(parsed.data.afterSigning).toEqual([]);
      expect(parsed.data.questionsForCounsel).toEqual([]);
    }
  });

  it('groundedAnswerSchema applies defaults when AI drops evidence array', () => {
    const rawAiOutput = { answer: 'It means you pay 50% upfront.' };
    const parsed = groundedAnswerSchema.safeParse(rawAiOutput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.answer).toBe('It means you pay 50% upfront.');
      expect(parsed.data.evidence).toEqual([]);
      expect(parsed.data.suggestedLawyerQuestions).toEqual([]);
    }
  });

  it('lawyerBriefSchema catches missing sections gracefully', () => {
    const rawAiOutput = { documentId: 'doc-123', overview: 'This is a brief.', missingInformation: 'None', nextSteps: 'Do this.', generatedAt: new Date().toISOString() };
    const parsed = lawyerBriefSchema.safeParse(rawAiOutput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.monetaryTerms).toEqual([]);
      expect(parsed.data.keyDates).toEqual([]);
    }
  });
});
