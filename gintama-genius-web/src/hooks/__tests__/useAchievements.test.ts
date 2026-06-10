import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAchievements } from '../useAchievements';

describe('useAchievements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with all achievements locked', () => {
    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(0);
    expect(result.current.totalCount).toBe(12);
    result.current.achievements.forEach(a => {
      expect(a.unlocked).toBe(false);
    });
  });

  it('should unlock achievement by id', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    const firstGame = result.current.achievements.find(a => a.id === 'first_game');
    expect(firstGame?.unlocked).toBe(true);
    expect(result.current.unlockedCount).toBe(1);
  });

  it('should set recentlyUnlocked when unlocking', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    expect(result.current.recentlyUnlocked?.id).toBe('first_game');
  });

  it('should clear recentlyUnlocked after 3 seconds', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    expect(result.current.recentlyUnlocked).not.toBeNull();
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.recentlyUnlocked).toBeNull();
    vi.useRealTimers();
  });

  it('should not unlock the same achievement twice', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    act(() => { result.current.unlockFirstGame(); });
    expect(result.current.unlockedCount).toBe(1);
  });

  it('should persist unlocked achievements to localStorage', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    const stored = JSON.parse(localStorage.getItem('gintama_genius_achievements') || '[]');
    expect(stored).toContain('first_game');
  });

  it('should load achievements from localStorage on init', () => {
    localStorage.setItem('gintama_genius_achievements', JSON.stringify(['first_game', 'score_10']));
    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(2);
    expect(result.current.achievements.find(a => a.id === 'first_game')?.unlocked).toBe(true);
  });

  it('should check and unlock score-based achievements', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 30, streak: 0, level: 0 }); });
    expect(result.current.achievements.find(a => a.id === 'score_10')?.unlocked).toBe(true);
    expect(result.current.achievements.find(a => a.id === 'score_30')?.unlocked).toBe(true);
    expect(result.current.achievements.find(a => a.id === 'score_50')?.unlocked).toBe(false);
  });

  it('should check and unlock streak-based achievements', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 0, streak: 10, level: 0 }); });
    expect(result.current.achievements.find(a => a.id === 'streak_5')?.unlocked).toBe(true);
    expect(result.current.achievements.find(a => a.id === 'streak_10')?.unlocked).toBe(true);
    expect(result.current.achievements.find(a => a.id === 'streak_20')?.unlocked).toBe(false);
  });

  it('should check and unlock level-based achievements', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 0, streak: 0, level: 10 }); });
    expect(result.current.achievements.find(a => a.id === 'level_5')?.unlocked).toBe(true);
    expect(result.current.achievements.find(a => a.id === 'level_10')?.unlocked).toBe(true);
  });

  it('should unlock hardcore_win when hardcore with no errors', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 10, streak: 0, level: 0, isHardcore: true, errors: 0 }); });
    expect(result.current.achievements.find(a => a.id === 'hardcore_win')?.unlocked).toBe(true);
  });

  it('should not unlock hardcore_win when there are errors', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 10, streak: 0, level: 0, isHardcore: true, errors: 1 }); });
    expect(result.current.achievements.find(a => a.id === 'hardcore_win')?.unlocked).toBe(false);
  });

  it('should unlock perfect_game when no errors and score > 0', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.checkAndUnlock({ score: 10, streak: 0, level: 1, errors: 0 }); });
    expect(result.current.achievements.find(a => a.id === 'perfect_game')?.unlocked).toBe(true);
  });

  it('should reset all achievements', () => {
    const { result } = renderHook(() => useAchievements());
    act(() => { result.current.unlockFirstGame(); });
    expect(result.current.unlockedCount).toBe(1);
    act(() => { result.current.resetAchievements(); });
    expect(result.current.unlockedCount).toBe(0);
    expect(localStorage.getItem('gintama_genius_achievements')).toBeNull();
  });

  it('should handle localStorage corruption gracefully', () => {
    localStorage.setItem('gintama_genius_achievements', 'invalid-json');
    const { result } = renderHook(() => useAchievements());
    expect(result.current.unlockedCount).toBe(0);
  });
});
