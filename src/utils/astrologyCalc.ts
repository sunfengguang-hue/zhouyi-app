import type { AstrologySign, AstrologyResult } from '../types';
import { ZODIAC_SIGNS } from '../data/astrology';

/**
 * 根据月日判定星座
 */
export function getSignByDate(month: number, day: number): AstrologySign {
  // 星座日期分界（每个星座的起始日）
  const boundaries = [
    { sign: 9, start: [3, 21] }, { sign: 10, start: [4, 20] }, { sign: 11, start: [5, 21] },
    { sign: 12, start: [6, 22] }, { sign: 1, start: [7, 23] }, { sign: 2, start: [8, 23] },
    { sign: 3, start: [9, 23] }, { sign: 4, start: [10, 24] }, { sign: 5, start: [11, 23] },
    { sign: 6, start: [12, 22] }, { sign: 7, start: [1, 21] }, { sign: 8, start: [2, 20] },
  ];

  // 摩羯跨年特殊处理
  if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return ZODIAC_SIGNS[10];

  for (let i = 0; i < boundaries.length - 2; i++) {
    const b = boundaries[i];
    if (month === b.start[0] && day >= b.start[1]) return ZODIAC_SIGNS[b.sign];
    if (month === boundaries[i + 1].start[0] && day < boundaries[i + 1].start[1]) return ZODIAC_SIGNS[b.sign];
  }
  // 通用匹配
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return ZODIAC_SIGNS[0];
  if (md >= 420 && md <= 520) return ZODIAC_SIGNS[1];
  if (md >= 521 && md <= 621) return ZODIAC_SIGNS[2];
  if (md >= 622 && md <= 722) return ZODIAC_SIGNS[3];
  if (md >= 723 && md <= 822) return ZODIAC_SIGNS[4];
  if (md >= 823 && md <= 922) return ZODIAC_SIGNS[5];
  if (md >= 923 && md <= 1023) return ZODIAC_SIGNS[6];
  if (md >= 1024 && md <= 1122) return ZODIAC_SIGNS[7];
  if (md >= 1123 && md <= 1221) return ZODIAC_SIGNS[8];
  return ZODIAC_SIGNS[0];
}

// 元素相性分数
function elementCompat(e1: string, e2: string): number {
  if (e1 === e2) return 90;
  const compat: Record<string, string[]> = {
    '火': ['风'], '风': ['火'], '土': ['水'], '水': ['土'],
  };
  if (compat[e1]?.includes(e2)) return 85;
  const conflict: Record<string, string[]> = {
    '火': ['水'], '水': ['火'], '土': ['风'], '风': ['土'],
  };
  if (conflict[e1]?.includes(e2)) return 45;
  return 65;
}

/**
 * 基于日期种子的伪随机（每日运势稳定）
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * 主函数
 */
export function calcAstrology(month: number, day: number): AstrologyResult {
  const sign = getSignByDate(month, day);
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + month * 50 + day;

  const career = 2 + Math.floor(seededRandom(seed) * 4);
  const love = 2 + Math.floor(seededRandom(seed + 1) * 4);
  const wealth = 2 + Math.floor(seededRandom(seed + 2) * 4);
  const health = 2 + Math.floor(seededRandom(seed + 3) * 4);

  const summaries = [
    '今日运势顺畅，宜把握机会积极行动',
    '今日宜静不宜动，多思考少冲动',
    '今日人际关系佳，贵人相助',
    '今日需注意细节，避免疏忽出错',
    '今日财运不错，适合处理财务事宜',
    '今日情绪平稳，适合规划未来',
  ];
  const summaryIdx = Math.floor(seededRandom(seed + 4) * summaries.length);

  // 配对星座（取相性最高的）
  const compatibleSigns = ZODIAC_SIGNS.map(s => ({
    sign: s.name,
    score: s.name === sign.name ? 80 : elementCompat(sign.element, s.element),
  })).sort((a, b) => b.score - a.score).slice(0, 4);

  return {
    sign,
    todayFortune: { career, love, wealth, health, summary: summaries[summaryIdx] },
    compatibleSigns,
    input: { month, day },
  };
}
