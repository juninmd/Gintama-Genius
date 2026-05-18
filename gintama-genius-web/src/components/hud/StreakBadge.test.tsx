import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreakBadge } from './StreakBadge';

describe('StreakBadge', () => {
  it('does not render when streak is 0', () => {
    const { container } = render(<StreakBadge streak={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when streak is 1', () => {
    const { container } = render(<StreakBadge streak={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with SEQUÊNCIA for streak 2-4', () => {
    render(<StreakBadge streak={2} />);
    expect(screen.getByText('SEQUÊNCIA')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders with COMBO for streak 5-9', () => {
    render(<StreakBadge streak={5} />);
    expect(screen.getByText('COMBO!')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with SUPER for streak 10-14', () => {
    render(<StreakBadge streak={10} />);
    expect(screen.getByText('SUPER!')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders with BERSERK for streak 15+', () => {
    render(<StreakBadge streak={20} />);
    expect(screen.getByText('BERSERK!')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
