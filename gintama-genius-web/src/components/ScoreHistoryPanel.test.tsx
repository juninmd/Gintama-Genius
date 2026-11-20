import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ScoreHistoryPanel } from './ScoreHistoryPanel';

const history = [{ score: 12, date: 'hoje', difficulty: 'NORMAL', timeMode: '60s', level: 3 }];

describe('ScoreHistoryPanel clear', () => {
  it('asks for a second click before wiping the history', () => {
    const onClear = vi.fn();
    render(<ScoreHistoryPanel isOpen onClose={vi.fn()} history={history} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Histórico' }));
    expect(onClear).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Clique de novo para apagar tudo' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('drops the pending confirmation when focus leaves the button', () => {
    render(<ScoreHistoryPanel isOpen onClose={vi.fn()} history={history} onClear={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Histórico' }));
    fireEvent.blur(screen.getByRole('button', { name: 'Clique de novo para apagar tudo' }));
    expect(screen.getByRole('button', { name: 'Limpar Histórico' })).toBeInTheDocument();
  });
});
