import React from 'react';
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

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
  return (
    <div className="game-board">
      <div className="simon-circle">
        {COLORS.map((color) => {
          const colorName = colorMap[color];
          const isActive = activeColor === color;
          // Determine image source: normal or 'on' version
          // If the button is currently being pressed by user or lit by game
          // For user feedback, we might want to handle mouseDown/Up locally or pass 'pressed' state,
          // but for simplicity we rely on activeColor which is mainly for playback.
          // We can use CSS :active for user feedback or local state.
          // Let's use a local state for click feedback to be snappy.

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
            e.preventDefault(); // Prevent ghost clicks
            setIsPressed(true);
            onClick();
        }
    }

    const showActive = isActive || isPressed;
    const imgSrc = showActive
        ? `/assets/images/${colorName}_on.png`
        : `/assets/images/${colorName}.png`;

    return (
        <button
            className={`game-btn btn-${colorName}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
            style={{
                backgroundImage: `url(${imgSrc})`,
                cursor: disabled ? 'default' : 'pointer'
            }}
        >
        </button>
    );
}

export default GameBoard;
