import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameScore } from '../useGameScore';

describe('useGameScore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with 0 score and streak', () => {
    const { result } = renderHook(() => useGameScore());
    expect(result.current.score).toBe(0);
    expect(result.current.streak).toBe(0);
  });

  it('should increment score and streak', () => {
    const { result } = renderHook(() => useGameScore());

    act(() => {
      result.current.addScore(10);
      result.current.incrementStreak();
    });

    expect(result.current.score).toBe(10);
    expect(result.current.streak).toBe(1);
  });

  it('should update highscore', () => {
    const { result } = renderHook(() => useGameScore());

    act(() => {
      result.current.addScore(100);
    });

    expect(result.current.highScore).toBe(100);
    expect(localStorage.getItem('gintama_highscore')).toBe('100');
  });

  it('should reset score and streak', () => {
    const { result } = renderHook(() => useGameScore());

    act(() => {
      result.current.addScore(10);
      result.current.incrementStreak();
      result.current.resetScore();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.streak).toBe(0);
  });
});
