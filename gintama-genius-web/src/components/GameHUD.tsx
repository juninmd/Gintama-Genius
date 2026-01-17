import { motion, AnimatePresence } from 'framer-motion';
import type { GameState, Difficulty } from '../hooks/useGameLogic';
import { Clock, Zap, Trophy, Flame } from 'lucide-react';

interface GameHUDProps {
  score: number;
  level: number;
  timeLeft: number;
  difficulty: Difficulty;
  message: string | null;
  streak: number;
  gameState: GameState;
}

export default function GameHUD({
  score,
  level,
  timeLeft,
  message,
  streak,
  gameState,
}: GameHUDProps) {

  // Visual urgency for low time
  const isUrgent = timeLeft <= 10 && gameState !== 'GAME_OVER';

  return (
    <>
      {/* Top HUD Bar */}
      <motion.div
        className="hud"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hud-group">
          <div className="hud-item">
            <Trophy size={20} className="text-yellow-400" />
            <motion.span
               key={score}
               initial={{ scale: 1.5, color: '#FFD700' }}
               animate={{ scale: 1, color: '#ffffff' }}
            >
              {score}
            </motion.span>
          </div>
          <div className="hud-item">
            <Zap size={20} className="text-blue-400" />
            <motion.span
               key={level}
               initial={{ scale: 1.5, color: '#00BFFF' }}
               animate={{ scale: 1, color: '#ffffff' }}
            >
              Lvl {level}
            </motion.span>
          </div>
        </div>

        <div className="hud-group">
           <div className={`hud-item ${isUrgent ? 'urgent-pulse' : ''}`}>
             <Clock size={20} className={isUrgent ? 'text-red-500' : 'text-white'} />
             <span>{timeLeft === Infinity ? '∞' : `${timeLeft}s`}</span>
           </div>

           {/* Streak Indicator - Only show if > 1 */}
           <AnimatePresence>
             {streak > 1 && (
               <motion.div
                 className="hud-item hud-streak"
                 initial={{ scale: 0, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 exit={{ scale: 0 }}
                 key="streak-badge"
               >
                 <Flame size={20} className="text-orange-500" />
                 <span>{streak}x</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Center Message Overlay */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            className="message-overlay"
            key={message} // Re-trigger animation on new message
            initial={{ scale: 0.5, opacity: 0, y: '-50%', x: '-50%' }}
            animate={{ scale: 1.1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ scale: 1.5, opacity: 0, y: '-50%', x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
             <div className="glow-text">
               {message}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgent Warning Overlay Border */}
      <AnimatePresence>
        {isUrgent && (
           <motion.div
             className="urgency-border"
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.5 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
           />
        )}
      </AnimatePresence>
    </>
  );
}
