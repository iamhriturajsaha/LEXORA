import { describe, it, expect } from 'vitest';
import { v4Style } from './utils';

describe('Document Utils', () => {
  describe('v4Style', () => {
    it('generates a valid v4 UUID string', () => {
      const uuid = v4Style();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });
});
