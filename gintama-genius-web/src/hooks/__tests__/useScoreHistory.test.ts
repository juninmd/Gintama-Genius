import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useScoreHistory } from '../useScoreHistory';

describe('useScoreHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useScoreHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should add a score entry', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: 100, difficulty: 'NORMAL', timeMode: '60s', level: 5 });
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].score).toBe(100);
    expect(result.current.history[0].difficulty).toBe('NORMAL');
    expect(result.current.history[0].level).toBe(5);
    expect(result.current.history[0].date).toBeDefined();
  });

  it('should not add entry with score 0 or less', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: 0, difficulty: 'NORMAL', timeMode: '60s', level: 0 });
    });
    expect(result.current.history).toHaveLength(0);
  });

  it('should not add entry with negative score', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: -5, difficulty: 'NORMAL', timeMode: '60s', level: 0 });
    });
    expect(result.current.history).toHaveLength(0);
  });

  it('should limit history to 10 entries', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      for (let i = 1; i <= 15; i++) {
        result.current.addEntry({ score: i, difficulty: 'NORMAL', timeMode: '60s', level: i });
      }
    });
    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0].score).toBe(15);
  });

  it('should persist history to localStorage', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: 50, difficulty: 'EASY', timeMode: '30s', level: 3 });
    });
    const stored = JSON.parse(localStorage.getItem('gintama_genius_history') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].score).toBe(50);
  });

  it('should load history from localStorage on init', () => {
    localStorage.setItem('gintama_genius_history', JSON.stringify([
      { score: 80, date: '01/01/2025', difficulty: 'NORMAL', timeMode: '60s', level: 4 }
    ]));
    const { result } = renderHook(() => useScoreHistory());
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].score).toBe(80);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: 100, difficulty: 'NORMAL', timeMode: '60s', level: 5 });
    });
    expect(result.current.history).toHaveLength(1);
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('gintama_genius_history')).toBeNull();
  });

  it('should return best score', () => {
    const { result } = renderHook(() => useScoreHistory());
    act(() => {
      result.current.addEntry({ score: 10, difficulty: 'EASY', timeMode: '30s', level: 1 });
      result.current.addEntry({ score: 50, difficulty: 'NORMAL', timeMode: '60s', level: 3 });
      result.current.addEntry({ score: 25, difficulty: 'EASY', timeMode: '30s', level: 2 });
    });
    expect(result.current.getBestScore()).toBe(50);
  });

  it('should return 0 for best score when history is empty', () => {
    const { result } = renderHook(() => useScoreHistory());
    expect(result.current.getBestScore()).toBe(0);
  });

  it('should handle localStorage corruption gracefully', () => {
    localStorage.setItem('gintama_genius_history', 'bad-json');
    const { result } = renderHook(() => useScoreHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should be loaded by default', () => {
    const { result } = renderHook(() => useScoreHistory());
    expect(result.current.isLoaded).toBe(true);
  });
});
