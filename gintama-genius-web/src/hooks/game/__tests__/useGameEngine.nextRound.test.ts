import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameState } from '../../../constants';
import { useGameEngine } from '../useGameEngine';

const setup = (initial: GameState = 'WAITING_FOR_INPUT') => {
  const addToSequence = vi.fn();
  const playSequence = vi.fn();
  const setGameState = vi.fn();
  const hook = renderHook(({ state }) => useGameEngine(
    vi.fn(), vi.fn(), vi.fn(), () => 1, vi.fn(), 0, vi.fn(), addToSequence, playSequence,
    () => 'complete', vi.fn(), vi.fn(), vi.fn(), vi.fn(),
    { difficulty: 'NORMAL', timeMode: '60s' }, vi.fn(), state, setGameState,
  ), { initialProps: { state: initial } });
  return { ...hook, addToSequence, playSequence, setGameState };
};

describe('useGameEngine next round', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts the next round 1.5 s after a completed sequence', () => {
    const h = setup();
    act(() => h.result.current.handleColorClick(0));
    act(() => { vi.advanceTimersByTime(1500); });
    expect(h.addToSequence).toHaveBeenCalledTimes(1);
    expect(h.playSequence).toHaveBeenCalledTimes(1);
  });

  it('does not start it after quitting to the menu in that window', () => {
    const h = setup();
    act(() => h.result.current.handleColorClick(0));
    act(() => h.result.current.resetGame());
    act(() => { vi.advanceTimersByTime(1500); });
    expect(h.playSequence).not.toHaveBeenCalled();
    expect(h.setGameState).not.toHaveBeenCalledWith('PLAYING_SEQUENCE');
  });

  it('does not revive a game that timed out in that window', () => {
    const h = setup();
    act(() => h.result.current.handleColorClick(0));
    h.rerender({ state: 'GAME_OVER' });
    act(() => { vi.advanceTimersByTime(1500); });
    expect(h.addToSequence).not.toHaveBeenCalled();
    expect(h.setGameState).not.toHaveBeenCalledWith('PLAYING_SEQUENCE');
  });
});
