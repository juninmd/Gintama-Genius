import React from 'react';
import { COLORS } from '../hooks/useGameLogic';
import { motion } from 'framer-motion';

interface GameBoardProps {
  activeColor: number | null;
  onColorClick: (color: number) => void;
  disabled: boolean;
}

const colorMap: { [key: number]: string } = {
  1: 'vermelho',
  2: 'verde',
  3: 'azul',
  4: 'amarelo',
};

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
  return (
    <motion.div
        className="game-board"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="simon-circle">
        <div className="center-circle">
            <img src="/assets/images/genius.ico" alt="Logo" className="center-logo" />
        </div>
        {COLORS.map((color) => {
          const colorName = colorMap[color];
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
    </motion.div>
  );
};

const GameButton: React.FC<{
    color: number,
    colorName: string,
    isActive: boolean,
    onClick: () => void,
    disabled: boolean
}> = ({ colorName, isActive, onClick, disabled }) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseDown = () => {
        if (!disabled) {
            setIsPressed(true);
            onClick();
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!disabled) {
            e.preventDefault();
            setIsPressed(true);
            onClick();
        }
    }

    const showActive = isActive || isPressed;
    const imgSrc = showActive
        ? `/assets/images/${colorName}_on.png`
        : `/assets/images/${colorName}.png`;

    return (
        <motion.button
            className={`game-btn btn-${colorName} ${showActive ? 'active' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            style={{
                backgroundImage: `url(${imgSrc})`,
                cursor: disabled ? 'default' : 'pointer'
            }}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            animate={isActive ? { scale: [1, 1.05, 1], filter: "brightness(1.5)" } : { scale: 1, filter: "brightness(1)" }}
            transition={{ duration: 0.2 }}
        >
        </motion.button>
    );
}

export default GameBoard;
