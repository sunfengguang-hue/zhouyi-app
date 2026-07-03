import { useState, useCallback } from 'react';
import type {
  DivinationState,
  HexagramLines,
  CoinFlipResult,
  DivinationResult,
} from '../types';
import { flipThreeCoins } from '../utils/divination';
import {
  getHexagramFromLines,
  getChangedHexagramFromLines,
  getChangedPositions,
} from '../utils/hexagramCalc';

const initialLines: HexagramLines = [0, 0, 0, 0, 0, 0];

const initialState: DivinationState = {
  phase: 'idle',
  currentFlip: 0,
  lines: initialLines,
  flips: [],
  result: null,
};

export function useDivination() {
  const [state, setState] = useState<DivinationState>(initialState);

  /** 开始一次新的摇卦 */
  const startDivination = useCallback(() => {
    setState({
      phase: 'flipping',
      currentFlip: 0,
      lines: initialLines,
      flips: [],
      result: null,
    });
  }, []);

  /** 摇一次铜钱（抛3枚），返回本次结果 */
  const flipOnce = useCallback((): CoinFlipResult => {
    const result = flipThreeCoins();

    setState((prev) => {
      if (prev.phase !== 'flipping') return prev;

      const newFlips = [...prev.flips, result];
      const newLines: HexagramLines = [...prev.lines] as HexagramLines;
      newLines[prev.currentFlip] = result.sum;

      const nextFlip = prev.currentFlip + 1;
      const isComplete = nextFlip >= 6;

      if (isComplete) {
        // 所有六爻摇完，计算结果
        const hexagram = getHexagramFromLines(newLines);
        const changedHexagram = getChangedHexagramFromLines(newLines);
        const changedLines = getChangedPositions(newLines);

        const result: DivinationResult = {
          hexagram,
          changedHexagram,
          changedLines,
          lines: newLines,
          timestamp: Date.now(),
        };

        return {
          phase: 'complete',
          currentFlip: nextFlip,
          lines: newLines,
          flips: newFlips,
          result,
        };
      }

      return {
        ...prev,
        currentFlip: nextFlip,
        lines: newLines,
        flips: newFlips,
      };
    });

    return result;
  }, []);

  /** 重新开始 */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    phase: state.phase,
    currentFlip: state.currentFlip,
    lines: state.lines,
    flips: state.flips,
    result: state.result,
    startDivination,
    flipOnce,
    reset,
  };
}
