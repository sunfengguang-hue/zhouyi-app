import type { CoinFlipResult } from '../types';

/**
 * 模拟抛掷一枚铜钱
 * 正面（字）返回 3，反面（花）返回 2
 */
export function flipCoin(): number {
  return Math.random() < 0.5 ? 3 : 2;
}

/**
 * 模拟抛掷三枚铜钱，返回结果
 */
export function flipThreeCoins(): CoinFlipResult {
  const coins: [number, number, number] = [
    flipCoin(),
    flipCoin(),
    flipCoin(),
  ];
  const sum = coins[0] + coins[1] + coins[2];
  return { coins, sum, position: 0 }; // position 在外层设置
}

/**
 * 判断爻的阴阳属性
 * 7(少阳)、9(老阳) 为阳爻
 * 6(老阴)、8(少阴) 为阴爻
 */
export function getLineType(value: number): 'yang' | 'yin' {
  return (value === 7 || value === 9) ? 'yang' : 'yin';
}

/**
 * 判断是否为变爻
 * 6(老阴) 和 9(老阳) 为变爻
 */
export function isLineChanged(value: number): boolean {
  return value === 6 || value === 9;
}

/**
 * 获取变爻后的值
 * 老阴(6) → 阳爻(7), 老阳(9) → 阴爻(8)
 */
export function getChangedValue(value: number): number {
  if (value === 6) return 7;
  if (value === 9) return 8;
  return value;
}

