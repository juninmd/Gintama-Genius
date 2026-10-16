import { COLOR_HEX_MAP, COLOR_MAP } from '../constants';

/** Start angle (rad) of each quadrant, keyed by color id. Phaser angles grow clockwise from +x. */
const QUADRANT_START: Record<number, number> = {
  2: Math.PI, // verde: top-left
  1: Math.PI * 1.5, // vermelho: top-right
  3: 0, // azul: bottom-right
  4: Math.PI / 2, // amarelo: bottom-left
};

export const getQuadrantStart = (color: number): number => QUADRANT_START[color];

export const getColorHex = (color: number): number =>
  Number.parseInt(COLOR_HEX_MAP[COLOR_MAP[color]].slice(1), 16);

/** Returns the color id under a point, or null when outside the ring or inside the center hub. */
export const colorAt = (x: number, y: number, size: number): number | null => {
  const half = size / 2;
  const dx = x - half;
  const dy = y - half;
  const dist = Math.hypot(dx, dy);
  if (dist > half || dist < half * 0.32) return null;
  if (dy < 0) return dx < 0 ? 2 : 1;
  return dx < 0 ? 4 : 3;
};
