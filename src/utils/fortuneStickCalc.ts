import type { FortuneStickLevel, FortuneStickResult } from '../types';
import { FORTUNE_STICKS } from '../data/fortuneSticks';

/**
 * 简单字符串哈希，用于种子计算
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 基于日期的伪随机（同日同问同签）
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * 抽签：同日同问则同签，体现"心诚则灵"
 */
export function drawFortuneStick(question: string): FortuneStickResult {
  const now = new Date();
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const qHash = hashString(question || '问事');
  const seed = daySeed + qHash;
  const index = Math.floor(seededRandom(seed) * FORTUNE_STICKS.length);
  return {
    stick: FORTUNE_STICKS[index],
    question: question || '问事',
    timestamp: Date.now(),
  };
}

/**
 * 获取签等对应的颜色
 */
export function getLevelColor(level: FortuneStickLevel): string {
  switch (level) {
    case '上上签': return '#ffd700';
    case '上签': return '#2ecc71';
    case '中签': return '#3498db';
    case '下签': return '#e67e22';
    case '下下签': return '#e74c3c';
    default: return '#d4a853';
  }
}
