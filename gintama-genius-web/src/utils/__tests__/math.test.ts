import { describe, it, expect } from 'vitest';
import { generateEntropy } from '../math';

describe('generateEntropy', () => {
  it('should return a number between 0 (inclusive) and 1 (exclusive)', () => {
    for (let i = 0; i < 100; i++) {
      const value = generateEntropy();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should produce varying values', () => {
    const values = new Set<number>();
    for (let i = 0; i < 50; i++) {
      values.add(generateEntropy());
    }
    expect(values.size).toBeGreaterThan(1);
  });

  it('should not return NaN', () => {
    for (let i = 0; i < 20; i++) {
      const value = generateEntropy();
      expect(Number.isNaN(value)).toBe(false);
    }
  });
});
