import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { COLORS } from '../hooks/useGameLogic';

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

const colorHexMap: { [key: string]: string } = {
  vermelho: '#ef233c',
  verde: '#38b000',
  azul: '#4361ee',
  amarelo: '#ffcc00',
};

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
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
    </div>
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
    const buttonRef = useRef<HTMLButtonElement>(null);

    const triggerConfetti = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 15,
                spread: 40,
                origin: { x, y },
                colors: [colorHexMap[colorName]],
                disableForReducedMotion: true,
                startVelocity: 15,
                gravity: 2,
                scalar: 0.6,
                ticks: 50
            });
        }
    };

    const handleMouseDown = () => {
        if (!disabled) {
            setIsPressed(true);
            triggerConfetti();
            onClick();
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!disabled) {
            e.preventDefault(); // Prevent ghost clicks
            setIsPressed(true);
            triggerConfetti();
            onClick();
        }
    }

    const showActive = isActive || isPressed;
    const imgSrc = showActive
        ? `/assets/images/${colorName}_on.png`
        : `/assets/images/${colorName}.png`;

    return (
        <motion.button
            ref={buttonRef}
            className={`game-btn btn-${colorName} ${showActive ? 'active' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            style={{
                backgroundImage: `url(${imgSrc})`,
                cursor: disabled ? 'default' : 'pointer',
                // Explicitly set background size again to be safe with motion override quirks
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            animate={{
                scale: showActive ? 1.05 : 1,
                filter: showActive ? 'brightness(1.3)' : 'brightness(1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
        </motion.button>
    );
}

export default GameBoard;
