import { describe, it, expect } from 'vitest';
import { colorAt, getColorHex, getQuadrantStart } from '../boardGeometry';

describe('boardGeometry', () => {
  it('maps points to quadrants (verde TL, vermelho TR, amarelo BL, azul BR)', () => {
    expect(colorAt(60, 60, 400)).toBe(2);
    expect(colorAt(340, 60, 400)).toBe(1);
    expect(colorAt(60, 340, 400)).toBe(4);
    expect(colorAt(340, 340, 400)).toBe(3);
  });

  it('ignores hub and outside points', () => {
    expect(colorAt(200, 200, 400)).toBeNull();
    expect(colorAt(0, 0, 400)).toBeNull();
  });

  it('exposes hex colors and quadrant angles', () => {
    expect(getColorHex(1)).toBe(0xff0055);
    expect(getQuadrantStart(3)).toBe(0);
  });
});
