import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameLogic } from '../useGameLogic';

vi.mock('../game/useAudio', () => {
  const audio = { isMuted: true, toggleMute: () => {}, playSound: () => {} };
  return { useAudio: () => audio };
});

const advanceUntil = (done: () => boolean, maxMs = 10000) => {
  for (let t = 0; t < maxMs && !done(); t += 100) act(() => { vi.advanceTimersByTime(100); });
  expect(done()).toBe(true);
};

describe('useGameLogic pause between rounds', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps the timer running when Escape is pressed while the next round is being prepared', () => {
    const { result } = renderHook(() => useGameLogic());
    act(() => result.current.startGame('NORMAL', '60s'));
    advanceUntil(() => result.current.gameState === 'WAITING_FOR_INPUT');

    act(() => result.current.handleColorClick(result.current.sequence[0]));
    act(() => result.current.togglePause());
    advanceUntil(() => result.current.gameState === 'WAITING_FOR_INPUT' && result.current.sequence.length === 2);

    const before = result.current.timeLeft;
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.timeLeft).toBeLessThan(before);
  });

  it('still pauses while waiting for input', () => {
    const { result } = renderHook(() => useGameLogic());
    act(() => result.current.startGame('NORMAL', '60s'));
    advanceUntil(() => result.current.gameState === 'WAITING_FOR_INPUT');

    act(() => result.current.togglePause());
    expect(result.current.gameState).toBe('PAUSED');
    const frozen = result.current.timeLeft;
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.timeLeft).toBe(frozen);
  });
  it('starts a new game with the full time of the newly selected mode', () => {
    const { result } = renderHook(() => useGameLogic());
    act(() => result.current.startGame('NORMAL', '60s'));
    advanceUntil(() => result.current.gameState === 'WAITING_FOR_INPUT');
    act(() => { vi.advanceTimersByTime(5000); });

    act(() => result.current.startGame('NORMAL', '30s'));
    expect(result.current.gameState).toBe('COUNTDOWN');
    expect(result.current.timeLeft).toBe(30);
  });
});
