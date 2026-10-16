import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { COLOR_MAP, KEY_TO_COLOR } from '../constants';
import { BoardScene } from '../game/BoardScene';

interface GameBoardProps {
  activeColor: number | null;
  onColorClick: (color: number) => void;
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ activeColor, onColorClick, disabled }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BoardScene | null>(null);
  const latest = useRef({ onColorClick, disabled });

  useEffect(() => {
    latest.current = { onColorClick, disabled };
  }, [onColorClick, disabled]);

  useEffect(() => {
    if (!hostRef.current) return;
    const scene = new BoardScene({
      onPress: (color) => latest.current.onColorClick(color),
      isDisabled: () => latest.current.disabled,
    });
    sceneRef.current = scene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      transparent: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene,
      audio: { noAudio: true },
      banner: false,
    });
    return () => {
      sceneRef.current = null;
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setActive(activeColor);
  }, [activeColor]);

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
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
      <div
        ref={hostRef}
        className="simon-circle"
        role="group"
        aria-label={`Tabuleiro: ${Object.values(COLOR_MAP).join(', ')}`}
      />
    </div>
  );
};

export default GameBoard;
