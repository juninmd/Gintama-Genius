import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pickMessage, executeKaguraBonus, MESSAGES_HARDCORE, checkSpeedBonus } from '../useGameEngineHelpers';
import { generateEntropy } from '../../../utils/math';
import type { Dispatch, SetStateAction } from 'react';

vi.mock('../../../utils/math', () => ({
  generateEntropy: vi.fn(),
}));

describe('pickMessage', () => {
  it('should return a message from the array', () => {
    vi.mocked(generateEntropy).mockReturnValue(0.3);
    const messages = ['a', 'b', 'c'];
    const result = pickMessage(messages);
    expect(messages).toContain(result);
  });

  it('should handle empty array gracefully', () => {
    vi.mocked(generateEntropy).mockReturnValue(0);
    const result = pickMessage([]);
    expect(result).toBeUndefined();
  });

  it('should pick different indices based on entropy', () => {
    vi.mocked(generateEntropy).mockReturnValue(0.99);
    const messages = ['first', 'second', 'third'];
    const result = pickMessage(messages);
    expect(result).toBe('third');
  });
});

describe('executeKaguraBonus', () => {
  let kaguraCountRef: { current: number };
  let setTimeLeft: Dispatch<SetStateAction<number>>;
  let addScore: (score: number) => void;
  let playSound: (key: number | string) => void;
  let setKaguraActive: Dispatch<SetStateAction<boolean>>;

  beforeEach(() => {
    vi.useFakeTimers();
    kaguraCountRef = { current: 0 };
    setTimeLeft = vi.fn() as unknown as Dispatch<SetStateAction<number>>;
    addScore = vi.fn() as unknown as (score: number) => void;
    playSound = vi.fn() as unknown as (key: number | string) => void;
    setKaguraActive = vi.fn() as unknown as Dispatch<SetStateAction<boolean>>;
  });

  it('should do nothing for BERSERK difficulty', () => {
    executeKaguraBonus('BERSERK', '60s', kaguraCountRef, setTimeLeft, addScore, playSound, setKaguraActive);
    expect(addScore).not.toHaveBeenCalled();
    expect(playSound).not.toHaveBeenCalled();
  });

  it('should do nothing for HARDCORE difficulty', () => {
    executeKaguraBonus('HARDCORE', '60s', kaguraCountRef, setTimeLeft, addScore, playSound, setKaguraActive);
    expect(addScore).not.toHaveBeenCalled();
  });

  it('should increment counter but not trigger before 15 clicks', () => {
    executeKaguraBonus('NORMAL', '60s', kaguraCountRef, setTimeLeft, addScore, playSound, setKaguraActive);
    expect(kaguraCountRef.current).toBe(1);
    expect(addScore).not.toHaveBeenCalled();
  });

  it('should trigger bonus after 15 clicks for NORMAL difficulty', () => {
    kaguraCountRef.current = 14;
    const setTimeLeftFn = vi.fn((fn) => fn(60)) as unknown as Dispatch<SetStateAction<number>>;
    executeKaguraBonus('NORMAL', '60s', kaguraCountRef, setTimeLeftFn, addScore, playSound, setKaguraActive);

    expect(kaguraCountRef.current).toBe(0);
    expect(setTimeLeftFn).toHaveBeenCalled();
    expect(addScore).toHaveBeenCalledWith(10);
    expect(playSound).toHaveBeenCalledWith('vapo');
    expect(setKaguraActive).toHaveBeenCalledWith(true);
  });

  it('should not add time for INFINITE mode', () => {
    kaguraCountRef.current = 14;
    const setTimeLeftFn = vi.fn() as unknown as Dispatch<SetStateAction<number>>;
    executeKaguraBonus('EASY', 'INFINITE', kaguraCountRef, setTimeLeftFn, addScore, playSound, setKaguraActive);

    expect(addScore).toHaveBeenCalledWith(10);
    expect(setTimeLeftFn).not.toHaveBeenCalled();
  });

  it('should reset kaguraActive after 2000ms', () => {
    kaguraCountRef.current = 14;
    const setTimeLeftFn = vi.fn((fn) => fn(60)) as unknown as Dispatch<SetStateAction<number>>;
    executeKaguraBonus('NORMAL', '60s', kaguraCountRef, setTimeLeftFn, addScore, playSound, setKaguraActive);

    expect(setKaguraActive).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(2000);
    expect(setKaguraActive).toHaveBeenCalledWith(false);
  });
});

describe('MESSAGES_HARDCORE', () => {
  it('should contain hardcore messages', () => {
    expect(MESSAGES_HARDCORE.length).toBeGreaterThan(0);
    expect(MESSAGES_HARDCORE).toContain('YATO KING!');
  });
});

describe('checkSpeedBonus', () => {
  it('should award bonus and show feedback if difference is <= 400ms and lastInputTime is > 0', () => {
    const showFeedback = vi.fn();
    const addScore = vi.fn();
    const currentTime = 1000;
    const lastInputTime = 650; // difference is 350ms

    const result = checkSpeedBonus(currentTime, lastInputTime, showFeedback, addScore);

    expect(addScore).toHaveBeenCalledWith(1);
    expect(showFeedback).toHaveBeenCalledWith({ message: 'RÁPIDO!', type: 'success' }, 800);
    expect(result).toBe(currentTime);
  });

  it('should not award bonus if difference is > 400ms', () => {
    const showFeedback = vi.fn();
    const addScore = vi.fn();
    const currentTime = 1000;
    const lastInputTime = 500; // difference is 500ms

    const result = checkSpeedBonus(currentTime, lastInputTime, showFeedback, addScore);

    expect(addScore).not.toHaveBeenCalled();
    expect(showFeedback).not.toHaveBeenCalled();
    expect(result).toBe(currentTime);
  });

  it('should not award bonus if lastInputTime is 0', () => {
    const showFeedback = vi.fn();
    const addScore = vi.fn();
    const currentTime = 1000;
    const lastInputTime = 0;

    const result = checkSpeedBonus(currentTime, lastInputTime, showFeedback, addScore);

    expect(addScore).not.toHaveBeenCalled();
    expect(showFeedback).not.toHaveBeenCalled();
    expect(result).toBe(currentTime);
  });
});
