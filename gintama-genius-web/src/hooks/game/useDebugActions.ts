import { useState } from 'react';
import { GameState } from '../../constants';

interface DebugDependencies {
    gameState: GameState;
    addScore: (score: number) => void;
    setKaguraActive: (active: boolean) => void;
    playSound: (sound: string | number) => void;
    setGameState: (state: GameState) => void;
    clearTimer: () => void;
    setTimeLeft: (time: number) => void;
    setLevel: (setter: (prev: number) => number) => void;
    setIsInputLocked: (locked: boolean) => void;
    addToSequence: () => void;
    playSequence: () => void;
}

export const useDebugActions = (deps: DebugDependencies) => {
    const [debugMode, setDebugMode] = useState(false);

    return {
        isDebug: debugMode,
        toggleDebug: () => setDebugMode(prev => !prev),
        addScore: deps.addScore,
        triggerBonus: () => {
            deps.setKaguraActive(true);
            deps.playSound('vapo');
            setTimeout(() => deps.setKaguraActive(false), 2000);
        },
        setGameOver: () => {
            deps.setGameState('GAME_OVER');
            deps.playSound('gameOver');
            deps.clearTimer();
        },
        setTimer: (s: number) => deps.setTimeLeft(s),
        winLevel: () => {
            if (deps.gameState === 'IDLE' || deps.gameState === 'GAME_OVER') return;
            deps.addScore(10);
            deps.setLevel((prev) => prev + 1);
            deps.setIsInputLocked(true);
            setTimeout(() => {
                deps.addToSequence();
                deps.setGameState('PLAYING_SEQUENCE');
                deps.playSequence();
            }, 500);
        }
    };
};
