import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TurnIndicator } from './TurnIndicator';

describe('TurnIndicator', () => {
  it('renders OBSERVE when playing sequence', () => {
    render(<TurnIndicator gameState="PLAYING_SEQUENCE" />);
    expect(screen.getByText('OBSERVE')).toBeInTheDocument();
  });

  it('renders SUA VEZ when waiting for input', () => {
    render(<TurnIndicator gameState="WAITING_FOR_INPUT" />);
    expect(screen.getByText('SUA VEZ')).toBeInTheDocument();
  });

  it('does not render when game is IDLE', () => {
    const { container } = render(<TurnIndicator gameState="IDLE" />);
    expect(container.firstChild?.firstChild).toBeNull();
  });

  it('does not render when game is GAME_OVER', () => {
    const { container } = render(<TurnIndicator gameState="GAME_OVER" />);
    expect(container.firstChild?.firstChild).toBeNull();
  });

  it('does not render during COUNTDOWN', () => {
    const { container } = render(<TurnIndicator gameState="COUNTDOWN" />);
    expect(container.firstChild?.firstChild).toBeNull();
  });
});
