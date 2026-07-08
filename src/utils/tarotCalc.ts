import type { TarotDraw, TarotResult, TarotSpreadType, TarotOrientation } from '../types';
import { MAJOR_ARCANA, SPREAD_POSITIONS, generateTarotSummary, generateCombinationReading } from '../data/tarotCards';

/**
 * Fisher-Yates洗牌
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 随机决定正逆位
 */
function randomOrientation(): TarotOrientation {
  return Math.random() > 0.35 ? 'upright' : 'reversed';
}

/**
 * 抽牌
 */
export function drawTarotCards(
  spreadType: TarotSpreadType,
  question: string
): TarotResult {
  const positions = SPREAD_POSITIONS[spreadType as keyof typeof SPREAD_POSITIONS] || SPREAD_POSITIONS.three;
  const count = positions.length;
  const deck = shuffle(MAJOR_ARCANA);
  const drawn = deck.slice(0, count);

  const draws: TarotDraw[] = drawn.map((card, i) => ({
    card,
    orientation: randomOrientation(),
    position: positions[i],
  }));

  return {
    spreadType,
    draws,
    question: question || '问事',
    summary: generateTarotSummary(draws),
    combination: spreadType === 'three' || spreadType === 'relationship' ? generateCombinationReading(draws) : '',
    timestamp: Date.now(),
  };
}

/**
 * 获取正逆位颜色
 */
export function getOrientationColor(orientation: TarotOrientation): string {
  return orientation === 'upright' ? '#2ecc71' : '#e67e22';
}
