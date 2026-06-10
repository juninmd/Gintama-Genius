import React from 'react';
import { HUDHeader, FeedbackOverlay, NewRoundBanner } from './hud';
import Countdown from './Countdown';
import type { GameState, Difficulty } from '../constants';
import type { Feedback } from '../hooks/useGameLogic';

interface AppHUDProps {
  gameState: GameState;
  score: number;
  level: number;
  timeLeft: number;
  difficulty: Difficulty;
  isMuted: boolean;
  toggleMute: () => void;
  countdownValue: number;
  feedback: Feedback | null;
  streak: number;
  kaguraActive: boolean;
}

export const AppHUD: React.FC<AppHUDProps> = ({
  gameState, score, level, timeLeft, difficulty, isMuted, toggleMute,
  countdownValue, feedback, streak, kaguraActive
}) => {
  return (
    <>
      {gameState !== 'IDLE' && (
        <HUDHeader
          score={score}
          level={level}
          timeLeft={timeLeft}
          difficulty={difficulty}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}

      {gameState !== 'IDLE' && (
        <>
            {gameState === 'COUNTDOWN' && <Countdown value={countdownValue} />}
            <NewRoundBanner feedback={feedback} />
            <FeedbackOverlay feedback={feedback} streak={streak} />

            {kaguraActive && (
                <div className="kagura-bonus">
                   <img src="/assets/images/uow.png" alt="Bônus Kagura" />
                </div>
            )}
        </>
      )}
    </>
  );
};
