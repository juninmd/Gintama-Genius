import type { Difficulty, TimeMode } from '../../constants';

export const createHandleGameOver = (
  checkAchievements: (args: { score: number; streak: number; level: number; isHardcore: boolean; errors: number }) => void,
  addEntry: (args: { score: number; difficulty: Difficulty; timeMode: TimeMode; level: number }) => void,
  settings: { difficulty: Difficulty; timeMode: TimeMode },
  streak: number,
  errorCountRef: React.MutableRefObject<number>
) => {
  return (finalScore: number, finalLevel: number) => {
    checkAchievements({
      score: finalScore,
      streak: streak,
      level: finalLevel,
      isHardcore: settings.difficulty === 'HARDCORE',
      errors: errorCountRef.current
    });
    addEntry({
      score: finalScore,
      difficulty: settings.difficulty,
      timeMode: settings.timeMode,
      level: finalLevel
    });
  };
};
