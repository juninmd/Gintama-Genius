import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGameEngine } from '../useGameEngine';

type Result = 'wrong' | 'complete' | 'correct' | 'locked';

const setup = (result: Result) => {
  const playSound = vi.fn();
  const addScore = vi.fn();
  const incrementStreak = vi.fn(() => 1);
  const hook = renderHook(() => useGameEngine(
    playSound, vi.fn(), addScore, incrementStreak, vi.fn(), 0, vi.fn(), vi.fn(), vi.fn(),
    () => result, vi.fn(), vi.fn(), vi.fn(), vi.fn(),
    { difficulty: 'NORMAL', timeMode: '60s' }, vi.fn(), 'WAITING_FOR_INPUT', vi.fn(),
  ));
  return { ...hook, playSound, addScore, incrementStreak };
};

describe('useGameEngine input lock', () => {
  it('ignores clicks during the post-round lock (no score, streak or sound)', () => {
    const h = setup('locked');
    for (let i = 0; i < 5; i++) act(() => h.result.current.handleColorClick(0));
    expect(h.addScore).not.toHaveBeenCalled();
    expect(h.incrementStreak).not.toHaveBeenCalled();
    expect(h.playSound).not.toHaveBeenCalled();
  });

  it('still scores a correct click', () => {
    const h = setup('correct');
    act(() => h.result.current.handleColorClick(0));
    expect(h.addScore).toHaveBeenCalledWith(1);
    expect(h.incrementStreak).toHaveBeenCalledTimes(1);
  });
});
