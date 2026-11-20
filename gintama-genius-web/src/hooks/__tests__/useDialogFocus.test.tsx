import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PauseMenu } from '../../components/PauseMenu';
import { ScoreHistoryPanel } from '../../components/ScoreHistoryPanel';

const entry = { score: 5, date: 'hoje', difficulty: 'NORMAL', timeMode: '60s', level: 2 };

describe('modal dialogs', () => {
  it('expose a labelled modal dialog and focus its first action', () => {
    render(<PauseMenu isOpen onResume={vi.fn()} onRestart={vi.fn()} onQuit={vi.fn()} onToggleSound={vi.fn()} isMuted={false} />);
    const dialog = screen.getByRole('dialog', { name: 'PAUSADO' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveFocus();
  });

  it('focuses "Fechar", not the destructive "Limpar Histórico" listed before it', () => {
    render(<ScoreHistoryPanel isOpen onClose={vi.fn()} history={[entry]} onClear={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Histórico de Pontuações' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
  });

  it('returns focus to the opener when closed', () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const { rerender } = render(<ScoreHistoryPanel isOpen onClose={vi.fn()} history={[]} onClear={vi.fn()} />);
    expect(opener).not.toHaveFocus();
    rerender(<ScoreHistoryPanel isOpen={false} onClose={vi.fn()} history={[]} onClear={vi.fn()} />);
    expect(opener).toHaveFocus();
    opener.remove();
  });
});
