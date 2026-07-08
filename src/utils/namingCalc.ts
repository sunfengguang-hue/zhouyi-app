import type { NameResult, WuXing, NameChar } from '../types';
import { NAME_CHARS, SURNAMES, getShuli, numToWX, getSancai } from '../data/naming';

function calcWuge(surnameStrokes: number, nameStrokes: number[]): {
  tian: number; ren: number; di: number; wai: number; zong: number;
} {
  const first = nameStrokes[0] || 0;
  const second = nameStrokes[1] || 0;
  const tian = surnameStrokes + 1;
  const ren = surnameStrokes + first;
  const di = nameStrokes.length === 1 ? first + 1 : first + second;
  const zong = nameStrokes.length === 1 ? surnameStrokes + first + 1 : surnameStrokes + first + second;
  const wai = nameStrokes.length === 1 ? 2 : zong - ren + 1;
  return { tian, ren, di, wai, zong };
}

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
  const renS = getShuli(wuge.ren);
  const zongS = getShuli(wuge.zong);
  if (renS.luck === '吉') score += 3;
  if (zongS.luck === '吉') score += 3;
  return Math.max(30, Math.min(99, score));
}

/** 音韵评分 */
function calcPronunciation(chars: { char: string; pinyin: string }[]): { score: number; analysis: string } {
  const pinyins = chars.map(c => c.pinyin).filter(Boolean);
  if (pinyins.length < 2) return { score: 72, analysis: '单字名，简洁有力，朗朗上口' };

  const initials = pinyins.map(p => p[0]);
  const sameInitial = initials.length > 1 && initials.every(i => i === initials[0]);
  const finals = pinyins.map(p => p.length > 2 ? p.slice(-2) : p);
  const sameFinal = finals.length > 1 && finals.every(f => f === finals[0]);

  let score = 88;
  const issues: string[] = [];

  if (sameInitial) { score -= 12; issues.push('声母相同'); }
  if (sameFinal) { score -= 8; issues.push('韵母相近'); }

  const lengths = new Set(pinyins.map(p => p.length));
  if (lengths.size >= 2) score += 4;

  const analysis = issues.length > 0
    ? `音韵略显单调（${issues.join('、')}），建议增加声韵变化`
    : '声韵搭配和谐，读来朗朗上口，音律优美';

  return { score: Math.max(50, Math.min(98, score)), analysis };
}

/** 合成名字寓意 */
function synthesizeMeaning(surname: string, chars: NameChar[]): string {
  const comboMap: Record<string, string> = {
    '木木': '如双木成林，枝繁叶茂，生机勃勃',
    '木火': '木生火旺，才华绽放，事业蒸蒸日上',
    '火木': '火照林木，光明与成长并行，前途无限',
    '火火': '双火辉映，光辉灿烂，热情与才华并重',
    '土土': '厚土重叠，根基深厚，稳如泰山',
    '土金': '土生金旺，财源广进，物质精神双丰收',
    '金土': '金藏于土，厚积薄发，大器晚成',
    '金金': '双金交辉，锋芒毕露，刚毅果决',
    '水水': '双水汇流，智慧如海，灵动善变',
    '水木': '水润木荣，才华滋养成长，学业事业双旺',
    '木水': '木得水养，根深叶茂，源远流长',
    '火土': '火生土厚，热情化为实力，脚踏实地',
    '土火': '土中蕴火，内热外稳，蓄势待发',
    '金水': '金生水旺，聪慧通达，刚柔并济',
    '水金': '水映金光，智慧与果断兼备，名利双收',
    '水火': '水火相济，阴阳调和，化冲突为动力',
    '火金': '火炼真金，历经磨练而成大器',
    '木土': '木扎根于土，踏实成长，稳步向前',
    '土木': '土育林木，基础扎实而发展蓬勃',
    '木金': '金克木成器，经雕琢而显价值',
    '金木': '金木相交，刚柔互动，需磨合而更显珍贵',
    '土水': '土纳水德，厚德载物，包容万千',
    '水土': '水入土中，润物无声，默默滋养',
  };
  if (chars.length === 1) {
    return `${surname}${chars[0].char}，${chars[0].meaning}。单字成名，简约大气，寓意深远。`;
  }
  const [first, second] = chars;
  const combo = comboMap[first.wuxing + second.wuxing] || '刚柔相济，五行流转，寓意吉祥';
  return `${surname}${first.char}${second.char}，取"${first.meaning}"与"${second.meaning}"之意。二字相合，${combo}，寄望深远。`;
}

/** 生肖建议 */
function getZodiacAdvice(chars: NameChar[]): string {
  const wxCount: Record<string, number> = {};
  chars.forEach(c => { wxCount[c.wuxing] = (wxCount[c.wuxing] || 0) + 1; });
  const dominant = Object.entries(wxCount).sort((a, b) => b[1] - a[1])[0];
  if (!dominant || dominant[1] < 1) return '名字五行均衡，适合各生肖年份使用。';
  const advice: Record<string, string> = {
    '木': '名字木气旺盛，适合生肖属虎、兔、龙之人使用，木主仁，利学业成长。属牛、羊者亦可借木之生气补足运势。',
    '火': '名字火气充沛，适合生肖属蛇、马之人使用，火主礼，利名声远播。属猪者慎用，火水相克需留意。',
    '土': '名字土气厚重，适合生肖属牛、龙、羊、狗之人使用，土主信，利根基稳固。属兔者慎用。',
    '金': '名字金气刚健，适合生肖属猴、鸡之人使用，金主义，利事业决断。属虎、兔者慎用，金克木。',
    '水': '名字水气灵动，适合生肖属鼠、猪之人使用，水主智，利聪慧通达。属蛇、马者慎用，水克火。',
  };
  return advice[dominant[0]] || '名字五行均衡，适合各生肖年份使用。';
}

function buildNameResult(surname: string, surnameStrokes: number, nameChars: NameChar[]): NameResult {
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
    pronunciation: calcPronunciation([{ char: surname, pinyin: '' }, ...nameChars]),
    charDetails: nameChars.map(c => ({
      char: c.char, wuxing: c.wuxing, strokes: c.strokes, meaning: c.meaning, radical: c.radical,
    })),
    fullNameMeaning: synthesizeMeaning(surname, nameChars),
    zodiacAdvice: getZodiacAdvice(nameChars),
  };
}

export function recommendNames(
  surname: string, gender: '男' | '女', preferWX: WuXing | 'auto', count: number = 12,
): NameResult[] {
  const surnameStrokes = SURNAMES[surname] || 6;
  const results: NameResult[] = [];
  let candidates = NAME_CHARS.filter(c => {
    if (gender === '男') return c.gender === '男' || c.gender === '中';
    return c.gender === '女' || c.gender === '中';
  });
  if (preferWX !== 'auto') {
    const preferred = candidates.filter(c => c.wuxing === preferWX);
    if (preferred.length > 0) candidates = preferred;
  }
  for (let i = 0; i < candidates.length && results.length < count; i++) {
    for (let j = i + 1; j < candidates.length && results.length < count; j++) {
      const res = buildNameResult(surname, surnameStrokes, [candidates[i], candidates[j]]);
      if (res.score >= 75) results.push(res);
    }
  }
  for (const c of candidates) {
    if (results.length >= count) break;
    const res = buildNameResult(surname, surnameStrokes, [c]);
    if (res.score >= 78) results.push(res);
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, count);
}

export function analyzeName(surname: string, givenName: string): NameResult | null {
  const surnameStrokes = SURNAMES[surname];
  if (!surnameStrokes) return null;
  const nameChars: NameChar[] = [];
  for (const ch of givenName) {
    const found = NAME_CHARS.find(c => c.char === ch);
    if (found) nameChars.push(found);
    else nameChars.push({ char: ch, pinyin: '', strokes: 6, wuxing: '土', meaning: '未知', gender: '中', radical: '?' });
  }
  return buildNameResult(surname, surnameStrokes, nameChars);
}
