import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Countdown from './Countdown';

describe('Countdown', () => {
  it('renders the countdown value', () => {
    render(<Countdown value={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders JÁ! when value is 0', () => {
    render(<Countdown value={0} />);
    expect(screen.getByText('JÁ!')).toBeInTheDocument();
  });

  it('renders JÁ! when value is negative', () => {
    render(<Countdown value={-1} />);
    expect(screen.getByText('JÁ!')).toBeInTheDocument();
  });
});
