import { useState, useEffect, useCallback, useRef } from 'react';
import { audioController } from '../utils/audio';

export type GameState = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_INPUT' | 'GAME_OVER' | 'COUNTDOWN';

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
  highScore: number;
  feedback: Feedback | null;
  countdownValue: number;
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
  "VOCÊ ACERTOU!",
  "MANDOU BEM!",
  "ISSO AÍ!",
  "LEITE DE MORANGO PRA VOCÊ!",
  "ALMA PRATEADA BRILHANDO!",
  "NÃO É ZURA, É KATSURA!",
  "JUST DO IT!",
  "SEUS ÓCULOS BRILHARAM!",
  "YOROZUYA FOREVER!",
  "EXPLOSÃO NEO ARMSTRONG!",
  "ALMA DE SAMURAI!",
  "OSHI OSHI OSHI!",
  "GENIAL!",
  "INCRÍVEL!",
  "SURPREENDENTE!",
  "COMBO YOROZUYA!",
  "ELIZABETH APROVA!",
  "MAIS DE 8000!",
  "QUEBRA DE LIMITE!",
  "JUSTAWAY APROVADO!",
  "BANKAI!... OPS, ERRADO.",
  "SADAHARU GOSTOU!",
  "REI DOS SAMURAIS!",
  "MITOU!",
  "LENDÁRIO!",
  "SENSA!",
];

const MESSAGES_ERROR = [
  "VOCÊ ERROU!",
  "TENTE NOVAMENTE!",
  "ERROU FEIO!",
  "SEPPUKU IMEDIATO!",
  "FALHOU, SHINPACHI!",
  "ZURA JA NAI, KATSURA DA!",
  "OI OI OI!",
  "ELIZABETH DESAPONTADO!",
  "MADAO TOTAL...",
  "SUA ALMA QUEBROU!",
  "VAI LEVAR ESPADADA!",
  "NÃO DESISTA!",
  "FALTOU CÁLCIO!",
  "FOI POR POUCO!",
  "NEO ARMSTRONG CYCLONE...",
  "PRECISA DE ÓCULOS?",
  "SHOGUN TE DESAPROVA!",
  "DON DAKE!",
  "QUE VERGONHA!",
  "PAROU POR QUÊ?",
];

const MESSAGES_NEW_ROUND = [
  "NOVA RODADA!",
  "PRÓXIMO NÍVEL!",
  "PREPARE-SE!",
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
  const [highScore, setHighScore] = useState(() => {
    try {
        return Number(localStorage.getItem('gintama_highscore')) || 0;
    } catch {
        return 0;
    }
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [countdownValue, setCountdownValue] = useState(0);

  // New State for sequence playback
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1);

  // Refs for cleanup
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resume audio context on first interaction
  useEffect(() => {
    const unlockAudio = () => audioController.resume();
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('pointerdown', unlockAudio);
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
    setScore(0);
    setLevel(0);
    setSequence([]);
    setUserInputIndex(0);
    setKaguraCount(0);
    setKaguraActive(false);
    setStreak(0);
    setFeedback(null);
    setTimeLeft(getInitialTime(timeMode));
    setPlaybackIndex(-1);

    // Start!
    playSound('novo');

    // Initialize first sequence
    const firstColor = Math.floor(Math.random() * 4) + 1;
    setSequence([firstColor]);

    setGameState('COUNTDOWN');
    setCountdownValue(3);
  };

  // Countdown Logic
  useEffect(() => {
    if (gameState === 'COUNTDOWN' && countdownValue > 0) {
        const timer = setTimeout(() => setCountdownValue(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    } else if (gameState === 'COUNTDOWN' && countdownValue === 0) {
        // Defer to avoid cascading render warning
        const t = setTimeout(() => {
            setGameState('PLAYING_SEQUENCE');
            setFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' });
            setTimeout(() => setFeedback(null), 1500);
        }, 0);
        return () => clearTimeout(t);
    }
  }, [gameState, countdownValue]);

  const addToSequence = () => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence(prev => [...prev, nextColor]);
    setPlaybackIndex(-1); // Reset playback

    // Brief delay before showing new round message
    setTimeout(() => {
        setFeedback({ message: getRandomMessage(MESSAGES_NEW_ROUND), type: 'info' });
        setTimeout(() => setFeedback(null), 1500);
    }, 200);
  };


  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState !== 'IDLE' && gameState !== 'GAME_OVER' && gameState !== 'COUNTDOWN' && settings.timeMode !== 'INFINITE') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('GAME_OVER');
            playSound('gameOver');
            setFeedback({ message: "Tempo Esgotado!", type: 'error' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      timerRef.current = timer;
    }

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, settings.timeMode, playSound]);

  // Sequence Playback Engine (The Fix)
  useEffect(() => {
    if (gameState !== 'PLAYING_SEQUENCE') {
        return;
    }

    // Initial delay before playback starts
    if (playbackIndex === -1) {
        const t = setTimeout(() => setPlaybackIndex(0), 1000);
        return () => clearTimeout(t);
    }

    // End of sequence
    if (playbackIndex >= sequence.length) {
        // Defer to avoid cascading render warning
        const t = setTimeout(() => {
             setGameState('WAITING_FOR_INPUT');
             setUserInputIndex(0);
             setActiveColor(null);
        }, 0);
        return () => clearTimeout(t);
    }

    // Play current note
    const color = sequence[playbackIndex];
    let isMounted = true;

    // 1. Light ON & Sound
    const t1 = setTimeout(() => {
        if (!isMounted) return;
        setActiveColor(color);
        playSound(color);
    }, 100);

    // 2. Light OFF
    const t2 = setTimeout(() => {
        if (!isMounted) return;
        setActiveColor(null);
    }, 600); // 500ms duration

    // 3. Next Index
    const t3 = setTimeout(() => {
        if (!isMounted) return;
        setPlaybackIndex(prev => prev + 1);
    }, 900); // 300ms gap

    return () => {
        isMounted = false;
        setActiveColor(null); // Ensure no stuck lights when leaving state
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
    };
  }, [gameState, playbackIndex, sequence, playSound]);

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
        setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
                setHighScore(newScore);
                try {
                    localStorage.setItem('gintama_highscore', newScore.toString());
                } catch (e) {
                    console.warn('Failed to save highscore', e);
                }
            }
            return newScore;
        });
        setLevel(prev => prev + 1);
        setKaguraCount(prev => prev + 1);

        // Streak Logic
        setStreak(prev => {
          const newStreak = prev + 1;
          if (newStreak % 5 === 0) {
             setFeedback({ message: "SEQUÊNCIA DE ACERTOS!", type: 'success' });
          } else if (newStreak <= 3) {
             setFeedback({ message: "VOCÊ ACERTOU!", type: 'success' });
          } else {
             setFeedback({ message: getRandomMessage(MESSAGES_SUCCESS), type: 'success' });
          }
          return newStreak;
        });

        // Clear feedback after a moment
        setTimeout(() => setFeedback(null), 1000);

        // Kagura Bonus Check
        if (settings.difficulty !== 'BERSERK') {
             setKaguraCount(prev => {
                 if (prev === 30) return 0; // Reset every 30
                 return prev;
             });
        } else {
             if (Math.random() < 0.3) {
                setFeedback({ message: "Incrível!", type: 'success' });
             }
        }

        // Move to next round
        setTimeout(() => {
            // Check for Kagura Trigger at 30?
            // The logic below was checking `newVal === 30`.
            // Let's preserve the original "Bonus Trigger" logic properly.

            // Logic: if we just hit 30 (which we tracked in prev setKaguraCount), trigger bonus.
            // But state updates are async. Let's do it simpler.
            setGameState('PLAYING_SEQUENCE');
            addToSequence();
        }, 1000);
      } else {
         // Correct input, but sequence not finished.
         setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
                setHighScore(newScore);
                try {
                    localStorage.setItem('gintama_highscore', newScore.toString());
                } catch (e) {
                    console.warn('Failed to save highscore', e);
                }
            }
            return newScore;
         });
         setStreak(prev => {
            const newStreak = prev + 1;
            // Feedback for mid-sequence milestones?
             if (newStreak % 5 === 0) {
              setFeedback({ message: "SEQUÊNCIA DE ACERTOS!", type: 'success' });
              setTimeout(() => setFeedback(null), 1000);
            }
            return newStreak;
         });

         // Bonus Check mid-sequence? Original code had it.
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

      // Combo Breaker Check
      if (streak > 5) {
          setFeedback({ message: "COMBO QUEBRADO!", type: 'error' });
      } else {
          setFeedback({ message: getRandomMessage(MESSAGES_ERROR), type: 'error' });
      }

      setStreak(0);
    }
  };

  const resetGame = () => {
    setGameState('IDLE');
    setScore(0);
    setLevel(0);
    setSequence([]);
    setStreak(0);
    setFeedback(null);
    setPlaybackIndex(-1);
    if (timerRef.current) clearInterval(timerRef.current);
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
    highScore,
    feedback,
    countdownValue,
    startGame,
    handleColorClick,
    resetGame,
    debugActions,
  };
};
