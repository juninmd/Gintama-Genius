import { useState, useCallback } from 'react';

export interface ScoreEntry {
  score: number;
  date: string;
  difficulty: string;
  timeMode: string;
  level: number;
}

const STORAGE_KEY = 'gintama_genius_history';
const MAX_ENTRIES = 10;

const isScoreEntry = (x: unknown): x is ScoreEntry => {
  if (typeof x !== 'object' || x === null) return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e.score === 'number' && Number.isFinite(e.score) && e.score >= 0 &&
    typeof e.level === 'number' && Number.isFinite(e.level) &&
    typeof e.date === 'string' &&
    typeof e.difficulty === 'string' &&
    typeof e.timeMode === 'string'
  );
};

const loadHistory = (): ScoreEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.filter(isScoreEntry).slice(0, MAX_ENTRIES);
    }
  } catch (e) {
    console.warn('Falha ao carregar histórico:', e);
  }
  return [];
};

export const useScoreHistory = () => {
  const [history, setHistory] = useState<ScoreEntry[]>(loadHistory);
  const [isLoaded] = useState(true);

  const addEntry = useCallback((entry: Omit<ScoreEntry, 'date'>) => {
    if (entry.score <= 0) return;

    const newEntry: ScoreEntry = {
      ...entry,
      date: new Date().toLocaleString('pt-BR'),
    };

    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Falha ao salvar histórico:', e);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Falha ao limpar histórico:', e);
    }
  }, []);

  const getBestScore = useCallback(() => {
    if (history.length === 0) return 0;
    return Math.max(...history.map(h => h.score));
  }, [history]);

  return { history, addEntry, clearHistory, getBestScore, isLoaded };
};
