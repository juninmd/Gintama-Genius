import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { useAudio } from '../useAudio';
import { audioController } from '../../../utils/audio';

// Mock audioController
vi.mock('../../../utils/audio', () => ({
  audioController: {
    muted: false,
    resume: vi.fn(),
    toggleMute: vi.fn(),
    play: vi.fn(),
  },
}));

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default muted state', () => {
    const { result } = renderHook(() => useAudio());
    expect(result.current.isMuted).toBe(false);
  });

  it('should toggle mute state', () => {
    // Mock toggleMute to return true
    (audioController.toggleMute as Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.toggleMute();
    });

    expect(audioController.toggleMute).toHaveBeenCalled();
    expect(result.current.isMuted).toBe(true);
  });

  it('should call play on audioController', () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playSound('test');
    });

    expect(audioController.play).toHaveBeenCalledWith('test');
  });
});
