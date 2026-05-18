import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDebugActions } from '../useDebugActions';
import type { GameState } from '../../../constants';

describe('useDebugActions', () => {
  const defaultDeps = {
    gameState: 'IDLE' as GameState,
    addScore: vi.fn(),
    setKaguraActive: vi.fn(),
    playSound: vi.fn(),
    setGameState: vi.fn(),
    clearTimer: vi.fn(),
    setTimeLeft: vi.fn(),
    setLevel: vi.fn(),
    setIsInputLocked: vi.fn(),
    addToSequence: vi.fn(),
    playSequence: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should initialize with debug mode disabled', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    expect(result.current.isDebug).toBe(false);
  });

  it('should toggle debug mode', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    act(() => { result.current.toggleDebug(); });
    expect(result.current.isDebug).toBe(true);
    act(() => { result.current.toggleDebug(); });
    expect(result.current.isDebug).toBe(false);
  });

  it('should add score through deps', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    result.current.addScore(50);
    expect(defaultDeps.addScore).toHaveBeenCalledWith(50);
  });

  it('should trigger bonus effects', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    act(() => { result.current.triggerBonus(); });
    expect(defaultDeps.setKaguraActive).toHaveBeenCalledWith(true);
    expect(defaultDeps.playSound).toHaveBeenCalledWith('vapo');
  });

  it('should reset kagura after 2000ms on triggerBonus', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    act(() => { result.current.triggerBonus(); });
    expect(defaultDeps.setKaguraActive).toHaveBeenCalledWith(true);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(defaultDeps.setKaguraActive).toHaveBeenCalledWith(false);
  });

  it('should set game over state', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    act(() => { result.current.setGameOver(); });
    expect(defaultDeps.setGameState).toHaveBeenCalledWith('GAME_OVER');
    expect(defaultDeps.playSound).toHaveBeenCalledWith('gameOver');
    expect(defaultDeps.clearTimer).toHaveBeenCalled();
  });

  it('should set timer value', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    result.current.setTimer(30);
    expect(defaultDeps.setTimeLeft).toHaveBeenCalledWith(30);
  });

  it('winLevel should ignore when game is IDLE', () => {
    const { result } = renderHook(() => useDebugActions(defaultDeps));
    act(() => { result.current.winLevel(); });
    expect(defaultDeps.addScore).not.toHaveBeenCalled();
  });

  it('winLevel should ignore when game is GAME_OVER', () => {
    const { result } = renderHook(() => useDebugActions({ ...defaultDeps, gameState: 'GAME_OVER' }));
    act(() => { result.current.winLevel(); });
    expect(defaultDeps.addScore).not.toHaveBeenCalled();
  });

  it('winLevel should level up when game is active', () => {
    const { result } = renderHook(() => useDebugActions({ ...defaultDeps, gameState: 'WAITING_FOR_INPUT' }));
    act(() => { result.current.winLevel(); });
    expect(defaultDeps.addScore).toHaveBeenCalledWith(10);
    expect(defaultDeps.setLevel).toHaveBeenCalled();
    expect(defaultDeps.setIsInputLocked).toHaveBeenCalledWith(true);
  });
});
