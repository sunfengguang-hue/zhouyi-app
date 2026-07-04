import type { FortuneStick, FortuneStickResult } from '../types';
import { FORTUNE_STICKS } from '../data/fortuneSticks';

/**
 * 随机抽取一支签
 */
export function drawFortuneStick(question: string): FortuneStickResult {
  const index = Math.floor(Math.random() * FORTUNE_STICKS.length);
  return {
    stick: FORTUNE_STICKS[index],
    question: question || '问事',
    timestamp: Date.now(),
  };
}

/**
 * 获取签等对应的颜色
 */
export function getLevelColor(level: string): string {
  switch (level) {
    case '上上签': return '#ffd700';
    case '上签': return '#2ecc71';
    case '中签': return '#3498db';
    case '下签': return '#e67e22';
    case '下下签': return '#e74c3c';
    default: return '#d4a853';
  }
}
