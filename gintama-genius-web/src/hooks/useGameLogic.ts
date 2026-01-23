import { useState, useEffect, useCallback } from 'react';
import { audioController } from '../utils/audio';

export type GameState = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_INPUT' | 'GAME_OVER';

export type Difficulty = 'BERSERK' | 'NORMAL' | 'EASY';
export type TimeMode = '30s' | '60s' | '120s' | '240s' | 'INFINITE';

export const COLORS = [1, 2, 3, 4] as const; // Red, Green, Blue, Yellow

export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UseGameLogicReturn {
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  activeColor: number | null; // The color currently lit up
  sequence: number[];
  userInputIndex: number;
  settings: {
    difficulty: Difficulty;
    timeMode: TimeMode;
  };
  kaguraActive: boolean;
  streak: number;
  feedback: Feedback | null;
  startGame: (difficulty: Difficulty, timeMode: TimeMode) => void;
  handleColorClick: (color: number) => void;
  resetGame: () => void;
  debugActions: {
    isDebug: boolean;
    toggleDebug: () => void;
    addScore: (amount: number) => void;
    triggerBonus: () => void;
    setGameOver: () => void;
    setTimer: (seconds: number) => void;
    winLevel: () => void;
  };
}

const MESSAGES_SUCCESS = [
  "Você acertou!",
  "Mandou bem!",
  "Isso aí!",
  "Beba leite com morango!", // Gintoki likes sweet stuff
  "Isso é o jeito dos samurais!",
  "A alma prateada brilha!",
  "Não é Zura, é Katsura!",
  "Just Do It!", // Gintama classic
  "Shinpachi, seus óculos brilharam!",
  "Yorozuya Forever!",
  "Explosão Neo Armstrong!",
  "Você tem a alma de um samurai!",
  "Oshi oshi oshi!", // Kagura eating
];

const MESSAGES_ERROR = [
  "Você errou!",
  "Tente novamente!",
  "Errou feio!",
  "Seppuku!",
  "Você falhou, Shinpachi!",
  "Zura ja nai, Katsura da!",
  "Oi oi oi!",
  "Elizabeth está desapontado!",
  "Madao...",
  "Sua alma quebrou!",
  "Vai levar uma espadada de madeira!",
];

const MESSAGES_NEW_ROUND = [
  "Nova Rodada!",
  "Próximo episódio!",
  "Atenção, Yorozuya!",
  "Abra bem os olhos (exceto o Gin)!",
  "Lá vem o pedido!",
  "Prepare-se para o trabalho!",
];

const getRandomMessage = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const useGameLogic = (): UseGameLogicReturn => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInputIndex, setUserInputIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [settings, setSettings] = useState<{ difficulty: Difficulty; timeMode: TimeMode }>({
    difficulty: 'NORMAL',
    timeMode: '60s',
  });
  const [, setKaguraCount] = useState(0);
  const [kaguraActive, setKaguraActive] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Resume audio context on first interaction
  useEffect(() => {
    const unlockAudio = () => audioController.resume();
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const playSound = useCallback((key: string | number) => {
    audioController.play(key);
  }, []);

  const getInitialTime = (mode: TimeMode): number => {
    switch (mode) {
      case '30s': return 30;
      case '60s': return 60;
      case '120s': return 120;
      case '240s': return 240;
      case 'INFINITE': return Infinity;
      default: return 60;
    }
  };

  const startGame = (difficulty: Difficulty, timeMode: TimeMode) => {
    setSettings({ difficulty, timeMode });
    setGameState('PLAYING_SEQUENCE');
    setScore(0);
    setLevel(0);
    setSequence([]);
    setUserInputIndex(0);
    setKaguraCount(0);
    setKaguraActive(false);
    setStreak(0);
    setFeedback(null);
    setTimeLeft(getInitialTime(timeMode));

    playSound('novo');
    addToSequence();
  };

  const addToSequence = () => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence(prev => [...prev, nextColor]);
    if (sequence.length > 0) { // Don't show on very first round to let user focus? Or yes?
      // Actually let's show it.
      setFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState !== 'IDLE' && gameState !== 'GAME_OVER' && settings.timeMode !== 'INFINITE') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 10 && prev > 1) {
            // Prioritize "Corra!" but respect recent success messages for a brief moment
            setFeedback(current => {
                 if (current?.type === 'success' || current?.type === 'error') return current;
                 return { message: "Corra!", type: 'warning' };
            });
          }

          if (prev <= 1) {
            setGameState('GAME_OVER');
            playSound('gameOver');
            setFeedback({ message: "Tempo Esgotado!", type: 'error' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, settings.timeMode, playSound]);

  // Sequence Playback Effect
  useEffect(() => {
    if (gameState === 'PLAYING_SEQUENCE' && sequence.length > 0) {
      let i = 0;
      // Delay slightly before starting sequence so user sees "Nova Rodada"
      const startDelay = setTimeout(() => {
          const interval = setInterval(() => {
            if (i >= sequence.length) {
              clearInterval(interval);
              setActiveColor(null);
              setGameState('WAITING_FOR_INPUT');
              setUserInputIndex(0);
              return;
            }

            const color = sequence[i];
            setActiveColor(color);
            playSound(color);

            setTimeout(() => {
              setActiveColor(null);
            }, 500); // Light up duration

            i++;
          }, 800); // Time between sequence items
      }, 1000);

      return () => clearTimeout(startDelay);
    }
  }, [gameState, sequence, playSound]);

  const handleColorClick = (color: number) => {
    if (gameState !== 'WAITING_FOR_INPUT') return;

    playSound(color);

    // Check correctness
    if (color === sequence[userInputIndex]) {
      // Correct
      const nextIndex = userInputIndex + 1;
      setUserInputIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Completed sequence
        setScore(prev => prev + 1);
        setLevel(prev => prev + 1);
        setKaguraCount(prev => prev + 1);
        setStreak(prev => {
          const newStreak = prev + 1;
          if (newStreak % 5 === 0) {
             setFeedback({ message: "Sequência de acertos!", type: 'success' });
          } else if (newStreak <= 3) {
             setFeedback({ message: "Você acertou!", type: 'success' });
          } else {
             setFeedback({ message: getRandomMessage(MESSAGES_SUCCESS), type: 'success' });
          }
          return newStreak;
        });
        setTimeout(() => setFeedback(null), 1000);

        // Kagura Bonus Check
        if (settings.difficulty !== 'BERSERK') {
             setKaguraCount(prev => {
                 const newVal = prev;
                 if ((newVal) === 30) {
                     return 0;
                 }
                 return newVal;
             });
        } else {
             // In Berserk mode, maybe give random praise for surviving?
             if (Math.random() < 0.3) {
                setFeedback({ message: "Incrível!", type: 'success' });
             }
        }

        setTimeout(() => {
          setGameState('PLAYING_SEQUENCE');
          addToSequence();
        }, 1000);
      } else {
         // Correct input, but sequence not finished.
         setScore(prev => prev + 1);
         setStreak(prev => {
            const newStreak = prev + 1;
            if (newStreak % 5 === 0) {
              setFeedback({ message: "Sequência de acertos!", type: 'success' });
              setTimeout(() => setFeedback(null), 1500);
            }
            return newStreak;
         });

         // No feedback for individual correct hits mid-sequence to avoid clutter?
         // Actually user likes "Você acertou".
         // Let's only show random success occasionally or if streak is high?
         // Or just small feedback?
         // For now, keep it cleaner: only streak milestones or end of sequence.
         // Wait, the user wants "Você acertou".
         // If I show it on every click, it's annoying.
         // I'll show it only on Sequence Complete (above) OR Milestone.

         setKaguraCount(prev => {
             const newVal = prev + 1;
             if (newVal === 30 && settings.difficulty !== 'BERSERK') {
                 // Trigger Bonus
                 setTimeLeft(t => (settings.timeMode === 'INFINITE' ? t : t + 30));
                 setScore(s => s + 10);
                 playSound('vapo');
                 setKaguraActive(true);
                 setTimeout(() => setKaguraActive(false), 2000);
                 return 0;
             }
             return newVal;
         });
      }

    } else {
      // Wrong
      setGameState('GAME_OVER');
      playSound('gameOver');
      setStreak(0);
      setFeedback({ message: getRandomMessage(MESSAGES_ERROR), type: 'error' });
    }
  };

  const resetGame = () => {
    setGameState('IDLE');
    setScore(0);
    setLevel(0);
    setSequence([]);
    setStreak(0);
    setFeedback(null);
  };

  // Debug Actions
  const debugActions = {
    isDebug: debugMode,
    toggleDebug: () => setDebugMode(prev => !prev),
    addScore: (amount: number) => setScore(prev => prev + amount),
    triggerBonus: () => {
      setKaguraActive(true);
      playSound('vapo');
      setTimeout(() => setKaguraActive(false), 2000);
    },
    setGameOver: () => {
      setGameState('GAME_OVER');
      playSound('gameOver');
    },
    setTimer: (seconds: number) => setTimeLeft(seconds),
    winLevel: () => {
        if (gameState !== 'IDLE' && gameState !== 'GAME_OVER') {
            setScore(prev => prev + 10);
            setLevel(prev => prev + 1);
            setKaguraCount(prev => prev + 1);
            setTimeout(() => {
                setGameState('PLAYING_SEQUENCE');
                addToSequence();
            }, 500);
        }
    }
  };

  return {
    gameState,
    score,
    level,
    timeLeft,
    activeColor,
    sequence,
    userInputIndex,
    settings,
    kaguraActive,
    streak,
    feedback,
    startGame,
    handleColorClick,
    resetGame,
    debugActions,
  };
};
