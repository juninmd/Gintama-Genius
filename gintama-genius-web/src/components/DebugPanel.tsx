import React from 'react';
import type { GameState } from '../hooks/useGameLogic';

interface DebugPanelProps {
  state: {
    gameState: GameState;
    score: number;
    level: number;
    timeLeft: number;
    sequence: number[];
    userInputIndex: number;
    activeColor: number | null;
  };
  actions: {
    winLevel: () => void;
    addScore: (amount: number) => void;
    triggerBonus: () => void;
    setGameOver: () => void;
    setTimer: (seconds: number) => void;
    toggleDebug: () => void;
  };
}

const DebugPanel: React.FC<DebugPanelProps> = ({ state, actions }) => {
  return (
    <div className="debug-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', borderBottom: '1px solid #555', paddingBottom: '2px' }}>
        <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Modo Debug</h3>
        <button onClick={actions.toggleDebug} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '14px', padding: '0 5px' }}>✕</button>
      </div>
      <div className="debug-info">
        <div><strong>Estado:</strong> {state.gameState}</div>
        <div><strong>Seq:</strong> {state.sequence.join(', ')}</div>
        <div><strong>Idx Ent:</strong> {state.userInputIndex}</div>
        <div><strong>Ativo:</strong> {state.activeColor ?? 'Nenhum'}</div>
        <div><strong>Pontos:</strong> {state.score} | <strong>Nível:</strong> {state.level}</div>
        <div><strong>Tempo:</strong> {state.timeLeft}s</div>
      </div>
      <div className="debug-controls">
        <button onClick={actions.winLevel}>Vencer Nível</button>
        <button onClick={() => actions.addScore(100)}>+100 pts</button>
        <button onClick={actions.triggerBonus}>Bônus Kagura</button>
        <button onClick={() => actions.setTimer(10)}>Definir 10s</button>
        <button onClick={actions.setGameOver} style={{background: '#ff4444'}}>Game Over</button>
      </div>
    </div>
  );
};

export default DebugPanel;
