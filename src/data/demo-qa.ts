/**
 * Precomputed Q&A responses for demo mode.
 */
import type { GroundedAnswer } from '@/types/document';

export const DEMO_QA_RESPONSES: Record<string, GroundedAnswer> = {
  'When can I terminate this agreement?': {
    answer: 'Based on the document, either party can terminate this agreement in two ways:\n\n1. **For convenience**: By providing 30 days\' prior written notice (Section 2.3). Upon termination, you would be compensated for all services satisfactorily performed through the termination date.\n\n2. **For cause**: Immediately upon written notice if the other party materially breaches the agreement and fails to cure the breach within 15 days of receiving notice (Section 2.4).\n\nAdditionally, you can prevent automatic renewal by providing written notice of non-renewal at least 30 days before the end of the current term (Section 2.2).',
    evidence: [
      { claim: 'Either party may terminate with 30 days written notice', sourceId: 'section-2.3', section: 'Section 2.3', confidence: 'high', originalText: 'Either party may terminate this Agreement at any time by providing the other party with thirty (30) days\' prior written notice.' },
      { claim: 'Immediate termination available for material breach with 15-day cure period', sourceId: 'section-2.4', section: 'Section 2.4', confidence: 'high', originalText: 'Either party may terminate this Agreement immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within fifteen (15) days.' },
    ],
    uncertainties: ['The agreement does not define what constitutes "satisfactorily performed" services for purposes of final payment upon termination.'],
    suggestedLawyerQuestions: ['What counts as a "material breach" that would allow immediate termination?', 'If I give notice during a renewal period, do I need to complete the full 30-day notice period, or can I time it with the end of the renewal term?'],
    isFromDocument: true,
  },
  'Who owns the final deliverables?': {
    answer: 'Based on the document, **the Client owns all work product**. The agreement establishes this through two mechanisms:\n\n1. All work product is classified as "work made for hire" under U.S. copyright law, meaning the Client is the author and owner from the moment of creation (Section 4.1).\n\n2. As a backup, if something doesn\'t qualify as work for hire, the Contractor assigns all rights to the Client (Section 4.2).\n\n**However**, the Contractor retains rights to pre-existing tools, libraries, and frameworks ("Contractor Tools") that were owned before or developed independently outside this agreement. The Client gets a non-exclusive, perpetual, royalty-free license to use any Contractor Tools incorporated into the work product (Section 4.3).\n\nThe Contractor may display completed work in a portfolio with the Client\'s prior written approval (Section 4.4).',
    evidence: [
      { claim: 'All work product belongs to the Client as work made for hire', sourceId: 'section-4.1', section: 'Section 4.1', confidence: 'high', originalText: 'All work product...shall be considered "work made for hire" as defined by the United States Copyright Act.' },
      { claim: 'Backup assignment of rights for non-qualifying work', sourceId: 'section-4.2', section: 'Section 4.2', confidence: 'high', originalText: 'Contractor hereby irrevocably assigns to Client all right, title, and interest in and to such Work Product.' },
      { claim: 'Contractor retains pre-existing tools', sourceId: 'section-4.3', section: 'Section 4.3', confidence: 'high', originalText: 'Contractor retains all rights in pre-existing tools, libraries, frameworks, and methodologies owned by Contractor prior to this Agreement.' },
    ],
    uncertainties: ['The agreement does not clearly define how to determine whether something is a "Contractor Tool" vs. new work product created for this engagement.'],
    suggestedLawyerQuestions: ['How should I document which tools are pre-existing "Contractor Tools" to protect my rights?', 'Does this IP assignment extend to general knowledge and skills gained during the engagement?'],
    isFromDocument: true,
  },
  'How and when do I get paid?': {
    answer: 'Based on the document, the payment structure works as follows:\n\n1. **Monthly retainer**: $2,500 per month for up to 40 hours of work (Section 3.1)\n2. **Overtime rate**: $75 per hour for hours exceeding 40 per month (Section 3.1)\n3. **Invoicing**: You submit invoices on the first business day of each month for work done in the prior month (Section 3.2)\n4. **Payment timeline**: The Client must pay within 30 days of receiving your invoice (Section 3.3)\n5. **Payment method**: Electronic bank transfer (Section 3.3)\n6. **Late payment protection**: Unpaid invoices accrue 1.5% monthly interest after 30 days (Section 3.4)\n7. **Expenses**: Pre-approved expenses are reimbursed; receipts required for expenses over $50 (Section 3.5)',
    evidence: [
      { claim: '$2,500 monthly retainer for up to 40 hours', sourceId: 'section-3.1', section: 'Section 3.1', confidence: 'high', originalText: 'Client shall pay Contractor a monthly retainer of Two Thousand Five Hundred Dollars ($2,500.00) for up to forty (40) hours of Services per month.' },
      { claim: 'Payment within 30 days via electronic transfer', sourceId: 'section-3.3', section: 'Section 3.3', confidence: 'high', originalText: 'Client shall pay each invoice within thirty (30) days of receipt. Payments shall be made via electronic bank transfer.' },
    ],
    uncertainties: ['The agreement does not specify what happens if the Client disputes an invoice amount.'],
    suggestedLawyerQuestions: ['What happens if the Client disputes an invoice? Is there a formal process?', 'Are there any protections if the Client consistently pays late?'],
    isFromDocument: true,
  },
  'Does the agreement automatically renew?': {
    answer: 'Yes, based on the document, **this agreement does automatically renew**.\n\nAfter the initial six-month term ends, the agreement automatically renews for successive three-month periods (Section 2.2). This continues indefinitely unless one of the parties provides written notice of non-renewal at least 30 days before the end of the current term.\n\n**What this means in practice**: If you want to stop the agreement, you need to send written notice at least 30 days before your current period ends. If you miss this window, you\'re committed for another 3 months.',
    evidence: [
      { claim: 'Agreement auto-renews for 3-month periods', sourceId: 'section-2.2', section: 'Section 2.2', confidence: 'high', originalText: 'This Agreement shall automatically renew for successive three (3) month periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.' },
    ],
    uncertainties: [],
    suggestedLawyerQuestions: ['What happens if notice is sent a few days late — am I definitely locked in for the full renewal period?'],
    isFromDocument: true,
  },
  'What happens if something goes wrong?': {
    answer: 'Based on the document, here is how disputes and problems are handled:\n\n1. **Liability cap**: Neither party\'s total liability can exceed the fees paid in the 6 months before the issue (Section 7.1)\n2. **No consequential damages**: Neither party is liable for indirect, incidental, or punitive damages including lost profits (Section 7.2)\n3. **Exceptions**: The liability limits do NOT apply to confidentiality breaches, IP infringement, or willful misconduct (Section 7.3)\n4. **Dispute resolution process**: First try negotiation, then mediation, then binding arbitration in Austin, Texas (Sections 11.1–11.3)\n5. **Indemnification**: Each party must protect the other from claims arising from their breach, negligence, or willful misconduct (Section 10)\n\nThe document does not specify who pays arbitration costs.',
    evidence: [
      { claim: 'Liability capped at 6 months of fees', sourceId: 'section-7.1', section: 'Section 7.1', confidence: 'high', originalText: 'IN NO EVENT SHALL EITHER PARTY\'S TOTAL LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE TO CONTRACTOR DURING THE SIX (6) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.' },
      { claim: 'Three-step dispute resolution process', sourceId: 'section-11', section: 'Sections 11.1–11.3', confidence: 'high', originalText: 'The parties shall first attempt to resolve any dispute...through good-faith negotiation...If negotiation fails...submit the dispute to mediation...If mediation fails...binding arbitration.' },
    ],
    uncertainties: ['The agreement does not specify who bears arbitration costs.', 'The agreement does not define what constitutes "material breach."'],
    suggestedLawyerQuestions: ['Who pays for the arbitration costs?', 'Is the liability cap sufficient given the scope of the engagement?', 'What constitutes "willful misconduct" that would override the liability cap?'],
    isFromDocument: true,
  },
  '__insufficient_evidence__': {
    answer: 'I can\'t find enough information in this document to answer that confidently.',
    evidence: [],
    uncertainties: ['The document does not appear to contain information directly addressing this question.'],
    suggestedLawyerQuestions: ['You may want to discuss this topic with a legal professional, as the document does not specifically address it.'],
    isFromDocument: false,
  },
};

/**
 * Precomputed comparison result between V1 and V2 of the Freelance Agreement.
 */
import type { ComparisonResult } from '@/types/document';

export const DEMO_COMPARISON: ComparisonResult = {
  documentAId: 'demo-freelance-v1',
  documentBId: 'demo-freelance-v2',
  documentATitle: 'Freelance Services Agreement (Original)',
  documentBTitle: 'Freelance Services Agreement (Revised)',
  summary: 'The revised agreement contains several significant changes that generally favor the Client. Key modifications include increased compensation but with longer payment terms, extended notice periods, reduced liability cap, restricted portfolio rights, and a longer non-solicitation period. These changes materially alter the financial and practical terms of the engagement.',
  changes: [
    { id: 'ch-1', type: 'modified', category: 'term', significance: 'high', sectionA: 'Section 2.1', sectionB: 'Section 2.1', contentA: 'six (6) months', contentB: 'twelve (12) months', explanation: 'Initial term doubled from 6 months to 12 months' },
    { id: 'ch-2', type: 'modified', category: 'renewal', significance: 'high', sectionA: 'Section 2.2', sectionB: 'Section 2.2', contentA: 'three (3) month periods / thirty (30) days notice', contentB: 'six (6) month periods / sixty (60) days notice', explanation: 'Renewal period doubled and notice period for non-renewal increased to 60 days' },
    { id: 'ch-3', type: 'modified', category: 'termination', significance: 'high', sectionA: 'Section 2.3', sectionB: 'Section 2.3', contentA: 'thirty (30) days notice', contentB: 'sixty (60) days notice', explanation: 'Termination notice period doubled from 30 to 60 days' },
    { id: 'ch-4', type: 'modified', category: 'termination', significance: 'medium', sectionA: 'Section 2.4', sectionB: 'Section 2.4', contentA: 'fifteen (15) days cure period', contentB: 'ten (10) days cure period', explanation: 'Breach cure period reduced from 15 to 10 days' },
    { id: 'ch-5', type: 'modified', category: 'payment', significance: 'high', sectionA: 'Section 3.1', sectionB: 'Section 3.1', contentA: '$2,500.00 retainer / $75.00 overtime', contentB: '$3,500.00 retainer / $100.00 overtime', explanation: 'Monthly retainer increased from $2,500 to $3,500; overtime rate increased from $75 to $100/hour' },
    { id: 'ch-6', type: 'modified', category: 'payment', significance: 'medium', sectionA: 'Section 3.3', sectionB: 'Section 3.3', contentA: 'thirty (30) days', contentB: 'forty-five (45) days', explanation: 'Payment terms extended from 30 to 45 days — you wait longer to get paid' },
    { id: 'ch-7', type: 'modified', category: 'late-fees', significance: 'low', sectionA: 'Section 3.4', sectionB: 'Section 3.4', contentA: '1.5% per month', contentB: '2.0% per month', explanation: 'Late payment interest increased from 1.5% to 2.0% per month' },
    { id: 'ch-8', type: 'modified', category: 'intellectual-property', significance: 'high', sectionA: 'Section 4.4', sectionB: 'Section 4.4', contentA: 'Portfolio rights with approval (not unreasonably withheld)', contentB: 'No portfolio rights without express prior written consent', explanation: 'Portfolio rights significantly restricted — removed "shall not be unreasonably withheld" language' },
    { id: 'ch-9', type: 'modified', category: 'confidentiality', significance: 'medium', sectionA: 'Section 5.4', sectionB: 'Section 5.4', contentA: 'two (2) years', contentB: 'five (5) years', explanation: 'Confidentiality obligation extended from 2 to 5 years post-termination' },
    { id: 'ch-10', type: 'added', category: 'confidentiality', significance: 'medium', sectionB: 'Section 5.5', contentB: 'Return or destroy all Confidential Information upon termination and certify in writing', explanation: 'New requirement to return/destroy confidential information with written certification' },
    { id: 'ch-11', type: 'modified', category: 'liability', significance: 'high', sectionA: 'Section 7.1', sectionB: 'Section 7.1', contentA: 'six (6) month period', contentB: 'three (3) month period', explanation: 'Liability cap reduced from 6 months to 3 months of fees — your recovery is now capped at a lower amount' },
    { id: 'ch-12', type: 'modified', category: 'non-solicitation', significance: 'medium', sectionA: 'Section 9.1', sectionB: 'Section 9.1', contentA: 'twelve (12) months', contentB: 'eighteen (18) months', explanation: 'Non-solicitation period extended from 12 to 18 months post-termination' },
    { id: 'ch-13', type: 'modified', category: 'assignment', significance: 'medium', sectionA: 'Section 12.7', sectionB: 'Section 12.5', contentA: 'Contractor cannot assign; Client can assign to successor', contentB: 'Neither party may assign without other party\'s consent', explanation: 'Assignment is now symmetric — neither party can assign without consent' },
    { id: 'ch-14', type: 'removed', category: 'dispute-resolution', significance: 'low', sectionA: 'Section 11.2', contentA: 'Mediation step before arbitration', explanation: 'Mediation step removed — disputes go directly from negotiation to binding arbitration' },
  ],
  materialChanges: [
    { id: 'mc-1', title: 'Compensation Increase', category: 'payment', description: 'Monthly retainer increased from $2,500 to $3,500; overtime from $75/hr to $100/hr', whyItMatters: 'Higher compensation, but consider this alongside the extended payment terms.', before: '$2,500/month retainer, $75/hour overtime', after: '$3,500/month retainer, $100/hour overtime', sourceA: { section: 'Section 3.1' }, sourceB: { section: 'Section 3.1' } },
    { id: 'mc-2', title: 'Extended Payment Terms', category: 'payment', description: 'Payment due date extended from 30 to 45 days', whyItMatters: 'You will wait up to 50% longer to receive payment for completed work.', before: 'Net 30', after: 'Net 45', sourceA: { section: 'Section 3.3' }, sourceB: { section: 'Section 3.3' } },
    { id: 'mc-3', title: 'Doubled Termination Notice', category: 'termination', description: 'Notice period for termination increased from 30 to 60 days', whyItMatters: 'You must plan further ahead if you want to end the engagement, and you remain committed for a longer period after giving notice.', before: '30 days\' notice', after: '60 days\' notice', sourceA: { section: 'Section 2.3' }, sourceB: { section: 'Section 2.3' } },
    { id: 'mc-4', title: 'Restricted Portfolio Rights', category: 'intellectual-property', description: 'Portfolio usage changed from "not unreasonably withheld" to requiring express written consent', whyItMatters: 'The Client now has effectively unlimited discretion to deny portfolio use, removing the fairness standard present in the original.', before: 'Approval not unreasonably withheld', after: 'Express prior written consent required', sourceA: { section: 'Section 4.4' }, sourceB: { section: 'Section 4.4' } },
    { id: 'mc-5', title: 'Reduced Liability Cap', category: 'liability', description: 'Maximum liability reduced from 6 months to 3 months of fees', whyItMatters: 'Your ability to recover damages is now capped at a lower amount if the Client causes harm.', before: '6 months of fees', after: '3 months of fees', sourceA: { section: 'Section 7.1' }, sourceB: { section: 'Section 7.1' } },
  ],
  analyzedAt: new Date().toISOString(),
};
