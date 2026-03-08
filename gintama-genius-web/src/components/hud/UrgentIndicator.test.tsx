import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UrgentIndicator } from './UrgentIndicator';

describe('UrgentIndicator', () => {
  it('does not render anything when visible is false', () => {
    const { container } = render(<UrgentIndicator visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders CORRA! when visible is true', () => {
    render(<UrgentIndicator visible={true} />);
    expect(screen.getByText('CORRA!')).toBeInTheDocument();
  });
});
