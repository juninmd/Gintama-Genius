import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackOverlay } from './FeedbackOverlay';
import type { Feedback } from '../../hooks/useGameLogic';

// Mock canvas-confetti because it uses window/DOM properties unavailable in JSDOM
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

describe('FeedbackOverlay', () => {
  it('does not render when feedback is null', () => {
    const { container } = render(<FeedbackOverlay feedback={null} streak={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when feedback is an error', () => {
    const feedback: Feedback = { message: 'ERROU!', type: 'error' };
    render(<FeedbackOverlay feedback={feedback} streak={0} />);

    const message = screen.getByText('ERROU!');
    expect(message).toBeInTheDocument();
  });

  it('renders correctly for a combo with streak count', () => {
    const feedback: Feedback = { message: 'COMBO!', type: 'combo' };
    render(<FeedbackOverlay feedback={feedback} streak={10} />);

    expect(screen.getByText('COMBO!')).toBeInTheDocument();
    expect(screen.getByText('10 ACERTOS!')).toBeInTheDocument();
  });
});
