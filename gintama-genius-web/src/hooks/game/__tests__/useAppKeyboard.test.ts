import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppKeyboard } from '../useAppKeyboard';
import type { GameState } from '../../../constants';
import type { Dispatch, SetStateAction } from 'react';

describe('useAppKeyboard', () => {
  let setShowShortcuts: Dispatch<SetStateAction<boolean>>;
  let setShowHistory: Dispatch<SetStateAction<boolean>>;
  let togglePause: () => void;
  let toggleMute: () => void;

  beforeEach(() => {
    setShowShortcuts = vi.fn<(value: SetStateAction<boolean>) => void>();
    setShowHistory = vi.fn<(value: SetStateAction<boolean>) => void>();
    togglePause = vi.fn<() => void>();
    toggleMute = vi.fn<() => void>();
  });

  const setupHook = (gameState: GameState = 'WAITING_FOR_INPUT', showShortcuts = false, showHistory = false) => {
    return renderHook(() => useAppKeyboard(
      gameState, showShortcuts, setShowShortcuts,
      showHistory, setShowHistory, togglePause, toggleMute
    ));
  };

  const dispatchKey = (key: string, target?: HTMLElement) => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...(target ? { target } : {}),
    }));
  };

  it('should toggle mute on M key', () => {
    setupHook();
    dispatchKey('m');
    expect(toggleMute).toHaveBeenCalledTimes(1);
  });

  it('should toggle mute on m key (lowercase)', () => {
    setupHook();
    dispatchKey('m');
    expect(toggleMute).toHaveBeenCalledTimes(1);
  });

  it('should not toggle mute when focused on INPUT', () => {
    setupHook();
    const event = new KeyboardEvent('keydown', {
      key: 'm',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: document.createElement('INPUT'), writable: false });
    window.dispatchEvent(event);
    expect(toggleMute).not.toHaveBeenCalled();
  });

  it('should toggle shortcuts on H key', () => {
    setupHook();
    dispatchKey('h');
    expect(setShowShortcuts).toHaveBeenCalled();
  });

  it('should close shortcuts with Escape', () => {
    setupHook('WAITING_FOR_INPUT', true);
    dispatchKey('Escape');
    expect(setShowShortcuts).toHaveBeenCalledWith(false);
  });

  it('should close history with Escape', () => {
    setupHook('WAITING_FOR_INPUT', false, true);
    dispatchKey('Escape');
    expect(setShowHistory).toHaveBeenCalledWith(false);
  });

  it('should toggle pause with Escape when game is PAUSED', () => {
    setupHook('PAUSED', false, false);
    dispatchKey('Escape');
    expect(togglePause).toHaveBeenCalled();
  });

  it('should toggle pause with Escape when game is active', () => {
    setupHook('WAITING_FOR_INPUT', false, false);
    dispatchKey('Escape');
    expect(togglePause).toHaveBeenCalled();
  });

  it('should not pause when game is IDLE', () => {
    setupHook('IDLE', false, false);
    dispatchKey('Escape');
    expect(togglePause).not.toHaveBeenCalled();
  });

  it('should not pause when game is GAME_OVER', () => {
    setupHook('GAME_OVER', false, false);
    dispatchKey('Escape');
    expect(togglePause).not.toHaveBeenCalled();
  });

  it('should not pause during COUNTDOWN', () => {
    setupHook('COUNTDOWN', false, false);
    dispatchKey('Escape');
    expect(togglePause).not.toHaveBeenCalled();
  });
});
