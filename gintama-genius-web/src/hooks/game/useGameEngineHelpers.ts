import { generateEntropy } from '../../utils/math';
import type { TimeMode, Difficulty } from '../../constants';
import type { Feedback } from '../useGameLogic';

export const MESSAGES_HARDCORE = [
  "YATO KING!",
  "REI DOS YATOS!",
  "INSTINTO ASSASSINO!",
  "ONESHOT!",
  "SENSUIIIII!",
];

/**
 * Picks a random message from an array.
 * @param arr The array of messages.
 */
export const pickMessage = (arr: string[]) => arr[Math.floor(generateEntropy() * arr.length)];

/**
 * Logic to trigger Kagura bonus.
 */
export const executeKaguraBonus = (
  difficulty: Difficulty,
  timeMode: TimeMode,
  kaguraCountRef: React.MutableRefObject<number>,
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>,
  addScore: (score: number) => void,
  playSound: (key: number | string) => void,
  setKaguraActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (difficulty === 'BERSERK' || difficulty === 'HARDCORE') return;

  kaguraCountRef.current += 1;
  if (kaguraCountRef.current < 15) return;

  kaguraCountRef.current = 0;
  if (timeMode !== 'INFINITE') {
    setTimeLeft((prev) => (Number.isFinite(prev) ? prev + 30 : prev));
  }

  addScore(10);
  playSound('vapo');
  setKaguraActive(true);
  setTimeout(() => setKaguraActive(false), 2000);
};

/**
 * Checks if the user should get a speed bonus.
 */
export const checkSpeedBonus = (
  currentTime: number,
  lastInputTime: number,
  showFeedback: (feedback: Feedback, duration?: number) => void,
  addScore: (score: number) => void
): number => {
  if (lastInputTime > 0 && currentTime - lastInputTime <= 400) {
    addScore(1);
    showFeedback({ message: 'RÁPIDO!', type: 'success' }, 800);
  }
  return currentTime;
};
