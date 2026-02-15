import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameTimer } from '../useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct time', () => {
    const { result } = renderHook(() => useGameTimer('30s', vi.fn()));

    act(() => {
        result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(30);
  });

  it('should countdown', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useGameTimer('60s', onTimeUp));

    act(() => {
        result.current.resetTimer();
        result.current.startTimer();
    });

    expect(result.current.timeLeft).toBe(60);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(59);
  });

  it('should call onTimeUp when time runs out', () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() => useGameTimer('30s', onTimeUp));

    act(() => {
        result.current.resetTimer();
        result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(onTimeUp).toHaveBeenCalled();
    expect(result.current.timeLeft).toBe(0);
  });

  it('should handle countdown value', () => {
    const { result } = renderHook(() => useGameTimer('30s', vi.fn()));

    act(() => {
      result.current.startCountdown(3);
    });

    expect(result.current.countdownValue).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.countdownValue).toBe(2);
  });
});
