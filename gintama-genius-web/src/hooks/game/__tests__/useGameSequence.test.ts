import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameSequence } from '../useGameSequence';

describe('useGameSequence', () => {
  const mockPlaySound = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useGameSequence(mockPlaySound));
    expect(result.current.sequence).toEqual([]);
    expect(result.current.userInputIndex).toBe(0);
    expect(result.current.isInputLocked).toBe(false);
  });

  it('should add to sequence', () => {
    const { result } = renderHook(() => useGameSequence(mockPlaySound));

    act(() => {
      result.current.addToSequence();
    });

    expect(result.current.sequence.length).toBe(1);
  });

  it('should play sequence', async () => {
    const { result } = renderHook(() => useGameSequence(mockPlaySound));

    act(() => {
      // Manually set sequence for predictable test
      result.current.setSequence([1, 2]);
    });

    act(() => {
      result.current.playSequence();
    });

    // Should start playback
    // Force effects to run
    // Wait for state update? No, hooks update immediately in act.

    // Advance to light up first color
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockPlaySound).toHaveBeenCalledWith(1);
    expect(result.current.activeColor).toBe(1);
  });

  it('should validate input correctly', () => {
    const { result } = renderHook(() => useGameSequence(mockPlaySound));

    act(() => {
      result.current.setSequence([1, 2]);
      result.current.setIsInputLocked(false);
    });

    let validation;
    act(() => {
      validation = result.current.validateInput(1);
    });

    expect(validation).toBe('correct');
    // userInputIndex updates on next render, but result.current tracks it
    // Wait, result.current inside the test function is a proxy that updates.
    expect(result.current.userInputIndex).toBe(1);

    act(() => {
      validation = result.current.validateInput(2);
    });

    expect(validation).toBe('complete');
  });

  it('should fail on wrong input', () => {
    const { result } = renderHook(() => useGameSequence(mockPlaySound));

    act(() => {
      result.current.setSequence([1, 2]);
      result.current.setIsInputLocked(false);
    });

    let validation;
    act(() => {
      validation = result.current.validateInput(3); // Wrong
    });

    expect(validation).toBe('wrong');
    expect(result.current.isInputLocked).toBe(true);
  });
});
