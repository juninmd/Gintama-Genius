import { useState, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const ACHIEVEMENTS_CONFIG = [
  { id: 'first_game', title: 'Primeiro Passo', description: 'Jogue sua primeira partida', icon: '🎯' },
  { id: 'score_10', title: 'Aprendiz', description: 'Alcance 10 pontos', icon: '⭐' },
  { id: 'score_30', title: 'Samurai', description: 'Alcance 30 pontos', icon: '⚔️' },
  { id: 'score_50', title: 'Shiroyasha', description: 'Alcance 50 pontos', icon: '🔥' },
  { id: 'score_100', title: 'Lendário', description: 'Alcance 100 pontos', icon: '👑' },
  { id: 'streak_5', title: 'Combo', description: 'Acertar 5 sequências seguidas', icon: '💫' },
  { id: 'streak_10', title: 'Foco Total', description: 'Acertar 10 sequências seguidas', icon: '🎯' },
  { id: 'streak_20', title: 'Mestre', description: 'Acertar 20 sequências seguidas', icon: '🏆' },
  { id: 'level_5', title: 'Subindo', description: 'Chegue ao nível 5', icon: '📈' },
  { id: 'level_10', title: 'Veterano', description: 'Chegue ao nível 10', icon: '🎖️' },
  { id: 'hardcore_win', title: 'Coragem', description: 'Vença no modo Hardcore', icon: '💀' },
  { id: 'perfect_game', title: 'Perfeito', description: 'Complete sem errar nenhum clique', icon: '✨' },
];

const STORAGE_KEY = 'gintama_genius_achievements';

const loadAchievements = (): Achievement[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const savedIds = JSON.parse(stored) as string[];
      return ACHIEVEMENTS_CONFIG.map(a => ({
        ...a,
        unlocked: savedIds.includes(a.id),
        unlockedAt: savedIds.includes(a.id) ? 'Desbloqueado' : undefined,
      }));
    }
  } catch {
    console.warn('Falha ao carregar achievements');
  }
  return ACHIEVEMENTS_CONFIG.map(a => ({ ...a, unlocked: false }));
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null);

  const unlock = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const updated = prev.map(a =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleString('pt-BR') } : a
      );

      try {
        const unlockedIds = updated.filter(a => a.unlocked).map(a => a.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
      } catch {
        console.warn('Falha ao salvar achievements');
      }

      setRecentlyUnlocked({ ...achievement, unlocked: true, unlockedAt: new Date().toLocaleString('pt-BR') });
      setTimeout(() => setRecentlyUnlocked(null), 3000);

      return updated;
    });
  }, []);

  const checkAndUnlock = useCallback((conditions: {
    score?: number;
    streak?: number;
    level?: number;
    isHardcore?: boolean;
    errors?: number;
  }) => {
    const { score = 0, streak = 0, level = 0, isHardcore = false, errors = 0 } = conditions;

    if (score >= 10) unlock('score_10');
    if (score >= 30) unlock('score_30');
    if (score >= 50) unlock('score_50');
    if (score >= 100) unlock('score_100');
    if (streak >= 5) unlock('streak_5');
    if (streak >= 10) unlock('streak_10');
    if (streak >= 20) unlock('streak_20');
    if (level >= 5) unlock('level_5');
    if (level >= 10) unlock('level_10');
    if (isHardcore && errors === 0 && score > 0) unlock('hardcore_win');
    if (errors === 0 && score > 0) unlock('perfect_game');
  }, [unlock]);

  const unlockFirstGame = useCallback(() => unlock('first_game'), [unlock]);

  const resetAchievements = useCallback(() => {
    setAchievements(ACHIEVEMENTS_CONFIG.map(a => ({ ...a, unlocked: false })));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return {
    achievements,
    recentlyUnlocked,
    checkAndUnlock,
    unlockFirstGame,
    resetAchievements,
    unlockedCount,
    totalCount: ACHIEVEMENTS_CONFIG.length,
  };
};
