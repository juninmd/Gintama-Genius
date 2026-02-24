import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS, COLOR_MAP, KEY_TO_COLOR } from '../constants';
import { GameButton } from './GameButton';

interface GameBoardProps {
  activeColor: number | null;
  onColorClick: (color: number) => void;
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
  useEffect(() => {
    if (disabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      const mappedColor = KEY_TO_COLOR[event.key.toLowerCase()];
      if (!mappedColor) return;

      event.preventDefault();
      onColorClick(mappedColor);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [disabled, onColorClick]);

  return (
    <div className="game-board">
      <div className="simon-circle">
        <motion.div
            className="center-circle"
            animate={{ rotate: activeColor ? 360 : 0 }}
            transition={{ duration: 0.5 }}
        >
            <img src="/assets/images/genius.ico" alt="Logo" className="center-logo" />
        </motion.div>
        {COLORS.map((color) => {
          const colorName = COLOR_MAP[color];
          const isActive = activeColor === color;

          return (
             <GameButton
                key={color}
                color={color}
                colorName={colorName}
                isActive={isActive}
                onClick={() => !disabled && onColorClick(color)}
                disabled={disabled}
             />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
