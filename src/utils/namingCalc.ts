import type { NameResult, WuXing, NameChar } from '../types';
import { NAME_CHARS, SURNAMES, getShuli, numToWX, getSancai } from '../data/naming';

/**
 * 五格剖象法计算
 */
function calcWuge(surnameStrokes: number, nameStrokes: number[]): {
  tian: number; ren: number; di: number; wai: number; zong: number;
} {
  const first = nameStrokes[0] || 0;
  const second = nameStrokes[1] || 0;

  const tian = surnameStrokes + 1;
  const ren = surnameStrokes + first;
  const di = nameStrokes.length === 1 ? first + 1 : first + second;
  const zong = surnameStrokes + first + second;
  const wai = nameStrokes.length === 1 ? 2 : zong - ren + 1;

  return { tian, ren, di, wai, zong };
}

/**
 * 评分：五格吉凶 + 三才
 */
function calcScore(
  wuge: { tian: number; ren: number; di: number; wai: number; zong: number },
  sancai: { luck: '吉' | '半吉' | '凶' },
): number {
  let score = 60;
  [wuge.tian, wuge.ren, wuge.di, wuge.wai, wuge.zong].forEach(n => {
    const s = getShuli(n);
    if (s.luck === '吉') score += 6;
    else if (s.luck === '半吉') score += 2;
    else score -= 5;
  });
  if (sancai.luck === '吉') score += 10;
  else if (sancai.luck === '半吉') score += 4;
  else score -= 8;

  // 人格、地格、总格权重更高
  const renS = getShuli(wuge.ren);
  const zongS = getShuli(wuge.zong);
  if (renS.luck === '吉') score += 3;
  if (zongS.luck === '吉') score += 3;

  return Math.max(30, Math.min(99, score));
}

/**
 * 生成名字结果
 */
function buildNameResult(
  surname: string, surnameStrokes: number, nameChars: NameChar[],
): NameResult {
  const nameStrokes = nameChars.map(c => c.strokes);
  const wuge = calcWuge(surnameStrokes, nameStrokes);

  const wugeJi = [
    getShuli(wuge.tian), getShuli(wuge.ren), getShuli(wuge.di),
    getShuli(wuge.wai), getShuli(wuge.zong),
  ];

  const tianWX = numToWX(wuge.tian);
  const renWX = numToWX(wuge.ren);
  const diWX = numToWX(wuge.di);
  const sancaiInfo = getSancai(tianWX, renWX, diWX);

  const score = calcScore(wuge, sancaiInfo);
  const givenName = nameChars.map(c => c.char).join('');
  const meaning = nameChars.map(c => c.meaning).join('，');

  return {
    fullName: surname + givenName,
    givenName,
    wuge,
    wugeJi,
    sancai: { tian: tianWX, ren: renWX, di: diWX, luck: sancaiInfo.luck, desc: sancaiInfo.desc },
    score,
    meaning,
    chars: nameChars,
  };
}

/**
 * 主函数：推荐名字
 */
export function recommendNames(
  surname: string,
  gender: '男' | '女',
  preferWX: WuXing | 'auto',
  count: number = 12,
): NameResult[] {
  const surnameStrokes = SURNAMES[surname] || 6;
  const results: NameResult[] = [];

  // 筛选候选字
  let candidates = NAME_CHARS.filter(c =>
    c.gender === gender || c.gender === '中' || gender === '男' ? true : c.gender === gender
  );
  // 性别适配
  candidates = NAME_CHARS.filter(c => {
    if (gender === '男') return c.gender === '男' || c.gender === '中';
    return c.gender === '女' || c.gender === '中';
  });

  if (preferWX !== 'auto') {
    const preferred = candidates.filter(c => c.wuxing === preferWX);
    if (preferred.length > 0) candidates = preferred;
  }

  // 双字名组合
  for (let i = 0; i < candidates.length && results.length < count; i++) {
    for (let j = i + 1; j < candidates.length && results.length < count; j++) {
      const res = buildNameResult(surname, surnameStrokes, [candidates[i], candidates[j]]);
      // 只保留评分较高的
      if (res.score >= 75) results.push(res);
    }
  }

  // 单字名补充
  for (const c of candidates) {
    if (results.length >= count) break;
    const res = buildNameResult(surname, surnameStrokes, [c]);
    if (res.score >= 78) results.push(res);
  }

  // 按评分排序
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, count);
}

/**
 * 测算已有名字
 */
export function analyzeName(surname: string, givenName: string): NameResult | null {
  const surnameStrokes = SURNAMES[surname];
  if (!surnameStrokes) return null;

  const nameChars: NameChar[] = [];
  for (const ch of givenName) {
    const found = NAME_CHARS.find(c => c.char === ch);
    if (found) nameChars.push(found);
    else {
      // 未知字，默认笔画
      nameChars.push({ char: ch, pinyin: '', strokes: 6, wuxing: '土', meaning: '未知', gender: '中' });
    }
  }

  return buildNameResult(surname, surnameStrokes, nameChars);
}
