import { describe, it, expect } from 'vitest';
import { getAIProvider } from './provider';

describe('AI Provider Routing', () => {
  it('falls back to demo mode when no API keys are present', () => {
    // If process.env.OPENAI_API_KEY and process.env.GOOGLE_GEMINI_API_KEY are missing,
    // the system should gracefully default to returning the DEMO fallback.
    const originalOpenAi = process.env.OPENAI_API_KEY;
    const originalGemini = process.env.GEMINI_API_KEY;
    
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const provider = getAIProvider();
      expect(provider).toBeDefined();
      expect(provider.isDemo).toBe(true);
    } finally {
      if (originalOpenAi) process.env.OPENAI_API_KEY = originalOpenAi;
      if (originalGemini) process.env.GEMINI_API_KEY = originalGemini;
    }
  });

});
