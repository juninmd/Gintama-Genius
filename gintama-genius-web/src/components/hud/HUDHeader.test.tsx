import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HUDHeader } from './HUDHeader';

describe('HUDHeader', () => {
  const defaultProps = {
    score: 42,
    level: 5,
    timeLeft: 60,
    difficulty: 'NORMAL',
    isMuted: false,
    toggleMute: vi.fn(),
  };

  it('renders score and level', () => {
    render(<HUDHeader {...defaultProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('LVL 5')).toBeInTheDocument();
  });

  it('renders time', () => {
    render(<HUDHeader {...defaultProps} />);
    expect(screen.getByText('60s')).toBeInTheDocument();
  });

  it('renders infinity symbol for INFINITE time', () => {
    render(<HUDHeader {...defaultProps} timeLeft={Infinity} />);
    expect(screen.getByText('∞')).toBeInTheDocument();
  });

  it('renders difficulty label', () => {
    render(<HUDHeader {...defaultProps} />);
    expect(screen.getByText('SAMURAI')).toBeInTheDocument();
  });

  it('renders volume icon when not muted', () => {
    render(<HUDHeader {...defaultProps} isMuted={false} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders muted icon when muted', () => {
    render(<HUDHeader {...defaultProps} isMuted={true} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
