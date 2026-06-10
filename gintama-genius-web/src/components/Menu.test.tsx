import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Menu from './Menu';

describe('Menu', () => {
  it('renders the start button', () => {
    render(<Menu onStart={vi.fn()} />);
    expect(screen.getByText('Iniciar Missão')).toBeInTheDocument();
  });

  it('renders difficulty select with NORMAL default', () => {
    render(<Menu onStart={vi.fn()} />);
    const select = screen.getByDisplayValue('Samurai (Normal)');
    expect(select).toBeInTheDocument();
  });

  it('renders time select with 60s default', () => {
    render(<Menu onStart={vi.fn()} />);
    const select = screen.getByDisplayValue('60s (Padrão)');
    expect(select).toBeInTheDocument();
  });

  it('calls onStart with default values when start is clicked', () => {
    const onStart = vi.fn();
    render(<Menu onStart={onStart} />);
    fireEvent.click(screen.getByText('Iniciar Missão'));
    expect(onStart).toHaveBeenCalledWith('NORMAL', '60s');
  });

  it('calls onStart with selected difficulty and time', () => {
    const onStart = vi.fn();
    render(<Menu onStart={onStart} />);

    const difficultySelect = screen.getByDisplayValue('Samurai (Normal)');
    fireEvent.change(difficultySelect, { target: { value: 'HARDCORE' } });

    const timeSelect = screen.getByDisplayValue('60s (Padrão)');
    fireEvent.change(timeSelect, { target: { value: '120s' } });

    fireEvent.click(screen.getByText('Iniciar Missão'));
    expect(onStart).toHaveBeenCalledWith('HARDCORE', '120s');
  });

  it('renders title when splash image fails to load', () => {
    render(<Menu onStart={vi.fn()} />);
    const img = screen.queryByAltText('Gintama Genius');
    if (img) {
      fireEvent.error(img);
      expect(screen.getByText('Treinamento Yorozuya')).toBeInTheDocument();
    }
  });
});
