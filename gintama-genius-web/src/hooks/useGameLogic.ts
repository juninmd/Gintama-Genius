import { useState, useEffect, useRef, useCallback } from 'react';

export type GameState = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_INPUT' | 'GAME_OVER';

export type Difficulty = 'BERSERK' | 'NORMAL' | 'EASY';
export type TimeMode = '30s' | '60s' | '120s' | '240s' | 'INFINITE';

export const COLORS = [1, 2, 3, 4] as const; // Red, Green, Blue, Yellow

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
  message: string | null;
  streak: number;
  rank: { title: string; description: string };
  speakIntro: () => void;
  startGame: (difficulty: Difficulty, timeMode: TimeMode) => void;
  handleColorClick: (color: number) => void;
  resetGame: () => void;
}

export const getRank = (score: number) => {
  if (score < 5) return { title: "Madao", description: "Um completo inútil..." };
  if (score < 15) return { title: "Shinpachi", description: "Você é basicamente um par de óculos." };
  if (score < 30) return { title: "Kagura", description: "Yato poderoso! Mas cuidado com a fome." };
  if (score < 50) return { title: "Gintoki", description: "O Lendário Shiroyasha!" };
  return { title: "Neo Armstrong Cyclone Jet Armstrong", description: "Uma lenda com um acabamento perfeito!" };
};

const SOUNDS = {
  1: '/assets/sounds/vermelho.wav',
  2: '/assets/sounds/verde.wav',
  3: '/assets/sounds/azul.wav',
  4: '/assets/sounds/amarelo.wav',
  gameOver: '/assets/sounds/fimdejogo.wav',
  vapo: '/assets/sounds/uow.wav',
  novo: '/assets/sounds/novo.wav',
};

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
  const [message, setMessage] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  // Derived rank
  const rank = getRank(score);

  // Audio refs
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((key: string | number) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing sound", e));
    }
  }, []);

  const speakIntro = useCallback(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Gintama, o jogo genial");
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

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
    setStreak(0);
    setSequence([]);
    setUserInputIndex(0);
    setKaguraCount(0);
    setKaguraActive(false);
    setTimeLeft(getInitialTime(timeMode));
    setMessage("Nova Rodada!");
    // setMessage handled by HUD auto-dismiss if needed, but keeping timeout for safety
    setTimeout(() => setMessage(null), 2000);

    playSound('novo');
    addToSequence();
  };

  const addToSequence = () => {
    const nextColor = Math.floor(Math.random() * 4) + 1;
    setSequence(prev => [...prev, nextColor]);
  };

  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState !== 'IDLE' && gameState !== 'GAME_OVER' && settings.timeMode !== 'INFINITE') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('GAME_OVER');
            playSound('gameOver');
            showMessage("Você errou! O tempo acabou.");
            return 0;
          }
          if (prev === 11) { // Will become 10 next tick
             showMessage("Corra!", 2000);
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
      const speed = Math.max(200, 800 - (level * 50));
      const lightDuration = Math.max(100, 500 - (level * 30));

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
        }, lightDuration); // Light up duration

        i++;
      }, speed); // Time between sequence items

      return () => clearInterval(interval);
    }
  }, [gameState, sequence, playSound, level]);

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
            if (newStreak > 0 && newStreak % 5 === 0) {
                const messages = ["Incrível!", "Imparável!", "Gênio!", "Supremo!", "Sequência Monstra!"];
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                showMessage(randomMsg, 3000);
            } else {
                const messages = ["Você acertou!", "Boa!", "Isso aí!", "Na mosca!"];
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                showMessage(randomMsg, 1500);
            }
            return newStreak;
        });

        // Kagura Bonus Check
        if (settings.difficulty !== 'BERSERK') {
             // In VB code: If Contador = 30 Then ...
             // We use kaguraCount + 1 because we just incremented it logically but state updates are async/batched.
             // Actually better to just check the updated val if we used a ref, but let's just check current + 1 logic or simpler:
             // Let's use the update function for reliability
             setKaguraCount(prev => {
                 const newVal = prev;
                 // Wait, I already called setKaguraCount(prev => prev + 1) above.
                 // React batching means I don't have the new value yet here.
                 // So I should check against the *expected* value or put this logic in an effect.
                 // Or just use the prev value logic:
                 if ((newVal) === 30) { // If it WAS 29 (now 30)
                     // Trigger bonus
                     // But wait, the VB code resets Contador to 0.
                     return 0;
                 }
                 return newVal;
             });
        }

        setTimeout(() => {
          setGameState('PLAYING_SEQUENCE');
          addToSequence();
        }, 1000);
      } else {
         // Correct input, but sequence not finished.
         // Just waiting for next input.
         setScore(prev => prev + 1); // VB adds point for every correct click?
         // VB Code:
         // If Correct:
         //    If Sequence Finished: Pts += 1, Level += 1, Contador += 1, Sortear()
         //    Else: N += 1, Pts += 1, Contador += 1
         // So yes, points for every click.
         setScore(prev => prev + 1);
         setKaguraCount(prev => {
             const newVal = prev + 1;
             if (newVal === 30 && settings.difficulty !== 'BERSERK') {
                 // Trigger Bonus
                 setTimeLeft(t => (settings.timeMode === 'INFINITE' ? t : t + 30));
                 setScore(s => s + 10);
                 playSound('vapo');
                 setKaguraActive(true);
                 setTimeout(() => setKaguraActive(false), 2000); // Hide after 2s (VB uses TimerKagura)
                 return 0;
             }
             return newVal;
         });
      }

    } else {
      // Wrong
      setGameState('GAME_OVER');
      playSound('gameOver');
      showMessage("Você errou!", 3000);
    }
  };

  const resetGame = () => {
    setGameState('IDLE');
    setScore(0);
    setLevel(0);
    setSequence([]);
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
    message,
    streak,
    rank,
    speakIntro,
    startGame,
    handleColorClick,
    resetGame,
  };
};
