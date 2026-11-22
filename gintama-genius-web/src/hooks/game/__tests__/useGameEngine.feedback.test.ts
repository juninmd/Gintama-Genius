import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Difficulty } from '../../../constants';
import { useGameEngine } from '../useGameEngine';

// 0 makes every random flavour message (BERSERK "INCRÍVEL!") fire.
vi.mock('../../../utils/math', () => ({ generateEntropy: () => 0 }));

const completeWithStreak = (difficulty: Difficulty, streak: number) => {
  const hook = renderHook(() => useGameEngine(
    vi.fn(), vi.fn(), vi.fn(), () => streak, vi.fn(), streak - 1, vi.fn(), vi.fn(), vi.fn(),
    () => 'complete', vi.fn(), vi.fn(), vi.fn(), vi.fn(),
    { difficulty, timeMode: '60s' }, vi.fn(), 'WAITING_FOR_INPUT', vi.fn(),
  ));
  act(() => hook.result.current.handleColorClick(1));
  return hook.result.current.feedback;
};

describe('useGameEngine completion feedback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each<Difficulty>(['HARDCORE', 'BERSERK', 'NORMAL'])('shows the streak milestone in %s', (difficulty) => {
    expect(completeWithStreak(difficulty, 5)?.type).toBe('combo');
  });

  it('keeps the HARDCORE flavour message outside milestones', () => {
    expect(completeWithStreak('HARDCORE', 3)?.type).toBe('success');
  });
});
