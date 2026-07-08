import type { BaziResult, BaziPillar, WuXing, ShiShen } from '../types';
import {
  TIAN_GAN, DI_ZHI, TIAN_GAN_WUXING, DI_ZHI_WUXING,
  DI_ZHI_CANG_GAN, WU_HU_DUN, WU_SHU_DUN, JIE_QI,
  getShiShen, NAYIN_MAP, DAY_MASTER_PERSONALITY, SHISHEN_DESC,
  DAYUN_INTERP,
} from '../data/bazi';

/** 是否闰年 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 获取某月天数 */
function getDaysInMonth(year: number, month: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return days[month - 1];
}

/**
 * 计算从 1900-01-31（甲戌日，序号10）到指定日期的累计天数
 * 用于日柱计算：日序号 = (基准序号 + 累计天数) mod 60
 */
function getDayIndexSinceBase(year: number, month: number, day: number): number {
  // 基准：1900-01-31 是甲戌日，六十甲子序号为 10（甲子=0，甲戌=10）
  const BASE_YEAR = 1900;
  const BASE_MONTH = 1;
  const BASE_DAY = 31;
  const BASE_INDEX = 10;

  let totalDays = 0;

  if (year >= BASE_YEAR) {
    // 完整年
    for (let y = BASE_YEAR; y < year; y++) {
      totalDays += isLeapYear(y) ? 366 : 365;
    }
    // 完整月
    for (let m = BASE_MONTH; m < month; m++) {
      totalDays += getDaysInMonth(year, m);
    }
    totalDays += day - BASE_DAY;
  } else {
    // 向前推算（处理1900前）
    for (let y = year; y < BASE_YEAR; y++) {
      totalDays -= isLeapYear(y) ? 366 : 365;
    }
    for (let m = month; m < BASE_MONTH; m++) {
      totalDays -= getDaysInMonth(year, m);
    }
    totalDays -= BASE_DAY - day;
  }

  return ((BASE_INDEX + totalDays) % 60 + 60) % 60;
}

/**
 * 年柱计算：以立春为年界
 * 1984年为甲子年（六十甲子序号0）
 */
function getYearPillarIndex(year: number, month: number, day: number): number {
  // 判断是否在立春之前（约2月4日）
  const beforeLiChun = (month < 2) || (month === 2 && day < 4);
  const actualYear = beforeLiChun ? year - 1 : year;
  // 1984为甲子（index 0）
  return ((actualYear - 1984) % 60 + 60) % 60;
}

/**
 * 月柱计算：根据节气确定月份，五虎遁定天干
 */
function getMonthPillarIndex(yearGanIndex: number, month: number, day: number): number {
  // 确定节气月（寅月=正月，对应公历2月立春后）
  let jieMonth = 1;
  // 小寒前（1月1-5日）仍属上年丑月（第12月）
  if (month === 1 && day < 6) jieMonth = 12;
  for (let i = 0; i < JIE_QI.length; i++) {
    const jq = JIE_QI[i];
    const [m, d] = jq.approxDay.split('-').map(Number);
    if (month > m || (month === m && day >= d)) {
      jieMonth = jq.month;
    }
  }
  // 月地支：正月寅(index 2)，依次推
  const monthZhiIndex = (jieMonth + 1) % 12; // 正月=寅=2
  // 五虎遁：年干定正月天干起始
  const yearGan = TIAN_GAN[yearGanIndex];
  const startGanIndex = WU_HU_DUN[yearGan] ?? 0;
  const monthGanIndex = (startGanIndex + jieMonth - 1) % 10;

  // 六十甲子序号：干支同步
  return getJiaZiIndex(monthGanIndex, monthZhiIndex);
}

/**
 * 由天干序号和地支序号计算六十甲子序号
 */
function getJiaZiIndex(ganIndex: number, zhiIndex: number): number {
  for (let n = 0; n < 60; n++) {
    if (n % 10 === ganIndex && n % 12 === zhiIndex) return n;
  }
  return 0;
}

/**
 * 获取任意年份的干支信息（用于流年分析）
 * 以立春为年界，1984年为甲子年
 */
export function getYearPillarInfo(year: number) {
  const idx = ((year - 1984) % 60 + 60) % 60;
  const ganIdx = idx % 10;
  const zhiIdx = idx % 12;
  const gan = TIAN_GAN[ganIdx];
  const zhi = DI_ZHI[zhiIdx];
  return {
    ganZhi: `${gan}${zhi}`,
    gan, zhi,
    ganWX: TIAN_GAN_WUXING[gan] as WuXing,
    zhiWX: DI_ZHI_WUXING[zhi] as WuXing,
    nayin: NAYIN_MAP[idx] || '',
    shiShen: (dayGan: string) => getShiShen(dayGan, gan),
  };
}

/**
 * 时柱计算：五鼠遁定子时天干
 */
function getHourPillarIndex(dayGanIndex: number, hour: number): number {
  // 时辰地支：23-1子时(index0), 1-3丑(1)...
  let hourZhiIndex: number;
  if (hour === 23 || hour === 0) hourZhiIndex = 0; // 子时
  else hourZhiIndex = Math.floor((hour + 1) / 2);

  // 早子时（0点前）归属当天，晚子时（23点后）日柱已变不处理，简化
  const dayGan = TIAN_GAN[dayGanIndex];
  const startGanIndex = WU_SHU_DUN[dayGan] ?? 0;
  const hourGanIndex = (startGanIndex + hourZhiIndex) % 10;

  return getJiaZiIndex(hourGanIndex, hourZhiIndex);
}

/**
 * 从六十甲子序号解析一柱
 */
function parsePillar(jiaZiIndex: number, isDayMaster: boolean, dayGan?: string): BaziPillar {
  const ganIndex = jiaZiIndex % 10;
  const zhiIndex = jiaZiIndex % 12;
  const gan = TIAN_GAN[ganIndex];
  const zhi = DI_ZHI[zhiIndex];
  const ganWX = TIAN_GAN_WUXING[gan];
  const zhiWX = DI_ZHI_WUXING[zhi];

  // 十神
  const ganSS: ShiShen = isDayMaster ? '比肩' : (dayGan ? getShiShen(dayGan, gan) as ShiShen : '比肩');

  // 地支藏干
  const cangGanList = DI_ZHI_CANG_GAN[zhi] || [];
  const zhiCangGan = cangGanList.map(g => ({
    gan: g,
    wx: TIAN_GAN_WUXING[g],
    ss: (dayGan ? getShiShen(dayGan, g) : '比肩') as ShiShen,
  }));
  // 地支主气十神（取第一个藏干）
  const zhiSS: ShiShen = dayGan
    ? getShiShen(dayGan, cangGanList[0] || gan) as ShiShen
    : '比肩';

  return { gan, zhi, ganWX, zhiWX, ganSS, zhiCangGan, zhiSS };
}

/**
 * 五行强弱分析
 */
function analyzeWuxing(
  pillars: BaziPillar[],
): { count: Record<WuXing, number>; strength: BaziResult['strength']; favorable: WuXing[] } {
  const count: Record<WuXing, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  pillars.forEach(p => {
    count[p.ganWX] += 1;     // 天干 +1
    count[p.zhiWX] += 1;     // 地支主气 +1
    p.zhiCangGan.forEach(c => { count[c.wx] += 0.5; }); // 藏干 +0.5
  });

  // 日主
  const dayWX = pillars[2].ganWX;
  const dayCount = count[dayWX];
  // 是否得令（月令地支五行同日主）
  const monthZhiWX = pillars[1].zhiWX;
  const deLing = monthZhiWX === dayWX;

  let strength: BaziResult['strength'];
  const totalScore = dayCount + (deLing ? 1.5 : 0);
  if (totalScore >= 4) strength = '旺';
  else if (totalScore >= 3) strength = '偏旺';
  else if (totalScore >= 2) strength = '中和';
  else if (totalScore >= 1) strength = '偏弱';
  else strength = '弱';

  // 用神建议：身旺则克泄耗，身弱则生扶
  const favorable: WuXing[] = [];
  const WX_SHENG: Record<string, WuXing> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const WX_KE: Record<string, WuXing> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

  if (strength === '旺' || strength === '偏旺') {
    // 身旺喜克（官杀）、泄（食伤）、耗（财）
    favorable.push(WX_KE[dayWX]);   // 克我者
    favorable.push(WX_SHENG[dayWX]); // 我生者
  } else if (strength === '弱' || strength === '偏弱') {
    // 身弱喜生（印）、帮（比劫）
    const SHENG_WO: Record<string, WuXing> = { '火': '木', '土': '火', '金': '土', '水': '金', '木': '水' };
    favorable.push(SHENG_WO[dayWX]); // 生我者
    favorable.push(dayWX);           // 同我者
  } else {
    // 中和，取平衡
    favorable.push(dayWX);
  }

  return { count, strength, favorable: Array.from(new Set(favorable)) };
}

/**
 * 真太阳时校正：经度差 + 均时差（Equation of Time）
 */
function getSolarTime(date: Date, longitude: number): Date {
  // 经度校正：每差1度=4分钟，以120°E（北京时间基准）为标准
  const lngOffsetMin = (longitude - 120) * 4;

  // 均时差校正：地球轨道偏心率+黄赤交角导致太阳时与平太阳时偏差
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const B = (360 * (dayOfYear - 81) / 364) * Math.PI / 180;
  const eotMin = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  return new Date(date.getTime() + (lngOffsetMin + eotMin) * 60 * 1000);
}

/**
 * 主函数：排四柱八字
 */
export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: '男' | '女',
  longitude: number = 116.4, // 默认北京
): BaziResult {
  // 真太阳时校正
  const inputDate = new Date(year, month - 1, day, hour, minute);
  const solarDate = getSolarTime(inputDate, longitude);
  const sy = solarDate.getFullYear();
  const sm = solarDate.getMonth() + 1;
  const sd = solarDate.getDate();
  const sh = solarDate.getHours();
  const smin = solarDate.getMinutes();

  // 计算四柱序号
  const yearIdx = getYearPillarIndex(sy, sm, sd);
  const monthIdx = getMonthPillarIndex(yearIdx % 10, sm, sd);
  let dayIdx = getDayIndexSinceBase(sy, sm, sd);

  // 晚子时（23点后）：日柱推进到次日
  if (sh >= 23) dayIdx += 1;

  const hourIdx = getHourPillarIndex(dayIdx % 10, sh);

  // 解析四柱（日柱先算，其余以日干定十神）
  const dayPillar = parsePillar(dayIdx, true);
  const dayGan = dayPillar.gan;

  const yearPillar = parsePillar(yearIdx, false, dayGan);
  const monthPillar = parsePillar(monthIdx, false, dayGan);
  const hourPillar = parsePillar(hourIdx, false, dayGan);

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const { count, strength, favorable } = analyzeWuxing(pillars);

  // ==================== 神煞系统（以日干/日支查四柱地支） ====================
  const shenSha: string[] = [];
  const dayZhi = dayPillar.zhi;
  const allZhi = [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi];
  const allGan = [yearPillar.gan, monthPillar.gan, dayPillar.gan, hourPillar.gan];

  // 天乙贵人（日干查四柱地支）
  const TIAN_YI: Record<string, string[]> = {
    '甲': ['丑','未'], '戊': ['丑','未'],
    '乙': ['子','申'], '己': ['子','申'],
    '丙': ['酉','亥'], '丁': ['酉','亥'],
    '庚': ['丑','未'], '辛': ['寅','午'],
    '壬': ['卯','巳'], '癸': ['卯','巳'],
  };
  for (const zhi of allZhi) {
    if (TIAN_YI[dayGan]?.includes(zhi)) {
      shenSha.push('天乙贵人（逢凶化吉，贵人相助）');
      break;
    }
  }

  // 文昌贵人（日干查四柱地支）
  const WEN_CHANG: Record<string, string> = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
    '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯',
  };
  for (const zhi of allZhi) {
    if (zhi === WEN_CHANG[dayGan]) {
      shenSha.push('文昌贵人（主聪明好学，利于考试）');
      break;
    }
  }

  // 驿马（日支查四柱地支）
  const YI_MA: Record<string, string> = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '亥': '巳', '卯': '巳', '未': '巳',
    '巳': '亥', '酉': '亥', '丑': '亥',
  };
  for (const zhi of allZhi) {
    if (zhi === YI_MA[dayZhi]) {
      shenSha.push('驿马星（主奔波远行，动中求财）');
      break;
    }
  }

  // 桃花/咸池（日支查四柱地支）
  const TAO_HUA: Record<string, string> = {
    '申': '酉', '子': '酉', '辰': '酉',
    '寅': '卯', '午': '卯', '戌': '卯',
    '亥': '子', '卯': '子', '未': '子',
    '巳': '午', '酉': '午', '丑': '午',
  };
  for (const zhi of allZhi) {
    if (zhi === TAO_HUA[dayZhi]) {
      shenSha.push('桃花/咸池（主人缘魅力，异性缘佳）');
      break;
    }
  }

  // 羊刃（日干查四柱地支）
  const YANG_REN: Record<string, string> = {
    '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
    '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
    '壬': '子', '癸': '亥',
  };
  for (const zhi of allZhi) {
    if (zhi === YANG_REN[dayGan]) {
      shenSha.push('羊刃（主刚烈果断，身旺则忌，身弱反喜）');
      break;
    }
  }

  // 禄神（日干查四柱地支）
  const LU_SHEN: Record<string, string> = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
    '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子',
  };
  for (const zhi of allZhi) {
    if (zhi === LU_SHEN[dayGan]) {
      shenSha.push('禄神（主衣食无忧，福禄绵长）');
      break;
    }
  }

  // 金舆（日干查四柱地支，主配偶贤美、出行有车马之便）
  const JIN_YU: Record<string, string> = {
    '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
    '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
    '壬': '丑', '癸': '寅',
  };
  for (const zhi of allZhi) {
    if (zhi === JIN_YU[dayGan]) {
      shenSha.push('金舆星（主出行便利，配偶贤美）');
      break;
    }
  }

  // 将星（日支查四柱地支，主权柄威望）
  const JIANG_XING: Record<string, string> = {
    '申': '子', '子': '子', '辰': '子',
    '寅': '午', '午': '午', '戌': '午',
    '亥': '酉', '卯': '酉', '未': '酉',
    '巳': '卯', '酉': '卯', '丑': '卯',
  };
  for (const zhi of allZhi) {
    if (zhi === JIANG_XING[dayZhi]) {
      shenSha.push('将星（主有威望领导力，宜掌权）');
      break;
    }
  }

  // 华盖（日支查年支）
  const HUA_GAI: Record<string, string> = {
    '申':'辰','子':'辰','辰':'辰', '寅':'戌','午':'戌','戌':'戌',
    '亥':'未','卯':'未','未':'未', '巳':'丑','酉':'丑','丑':'丑',
  };
  if (yearPillar.zhi === HUA_GAI[dayZhi]) shenSha.push('华盖星（主聪明才艺，孤高清傲）');

  // 天德贵人（月支查四柱天干）
  const TIAN_DE_GAN: Record<string, string> = {
    '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
    '午': '亥', '未': '甲', '申': '癸', '酉': '艮',
    '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚',
  };
  const monthZhi = monthPillar.zhi;
  for (const gan of allGan) {
    if (gan === TIAN_DE_GAN[monthZhi]) {
      shenSha.push('天德贵人（主逢凶化吉，一生少灾）');
      break;
    }
  }

  // 月德贵人（月支查四柱天干）
  const YUE_DE_GAN: Record<string, string> = {
    '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚',
    '午': '丙', '未': '甲', '申': '壬', '酉': '庚',
    '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚',
  };
  for (const gan of allGan) {
    if (gan === YUE_DE_GAN[monthZhi]) {
      shenSha.push('月德贵人（主仁慈温和，一生平安）');
      break;
    }
  }

  // 地支藏干得禄
  if (DI_ZHI_CANG_GAN[dayZhi].includes(dayGan)) shenSha.push('日坐禄地（根气深厚，自立自强）');
  // 五行齐全
  if (Object.values(count).every(v => v > 0)) shenSha.push('五行俱全（阴阳调和，一生平顺）');

  // 纳音五行
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const pillarIndices = [yearIdx, monthIdx, dayIdx, hourIdx];
  const nayin = pillarIndices.map((idx, i) => ({
    pillar: pillarNames[i],
    nayin: NAYIN_MAP[idx] || '未知',
  }));

  // 日主性格分析
  const dayMasterPersonality = DAY_MASTER_PERSONALITY[dayGan] || {
    character: '日主性格暂无详解', career: '', love: '', wealth: '',
  };

  // 十神详解（跳过日柱，日柱为日主自身）
  const shiShenDetails: { name: string; position: string; meaning: string }[] = [];
  const ssPillars = [
    { pillar: yearPillar, name: '年柱' },
    { pillar: monthPillar, name: '月柱' },
    { pillar: hourPillar, name: '时柱' },
  ];
  for (const { pillar, name } of ssPillars) {
    const ssName = pillar.ganSS;
    shiShenDetails.push({
      name: ssName,
      position: `${name}天干`,
      meaning: SHISHEN_DESC[ssName] || '',
    });
    // 地支藏干十神
    for (const cg of pillar.zhiCangGan) {
      shiShenDetails.push({
        name: cg.ss,
        position: `${name}地支藏${cg.gan}`,
        meaning: SHISHEN_DESC[cg.ss] || '',
      });
    }
  }

  // 大运计算
  const birthYear = sy;
  const yearGanYY = (yearIdx % 10) % 2 === 0; // 阳干=true
  const isMale = gender === '男';
  const isForward = (isMale && yearGanYY) || (!isMale && !yearGanYY); // 阳男阴女顺行
  const startAge = Math.abs(monthIdx - yearIdx) % 10 + 3;
  const daYun: { age: number; year: number; ganZhi: string; wuxing: string; interp: string }[] = [];
  const dayWX = dayPillar.ganWX;
  for (let i = 1; i <= 8; i++) {
    const step = isForward ? i : -i;
    const dyIdx = ((monthIdx + step) % 60 + 60) % 60;
    const dyGanIdx = dyIdx % 10;
    const dyZhiIdx = dyIdx % 12;
    const dyGan = TIAN_GAN[dyGanIdx];
    const dyZhi = DI_ZHI[dyZhiIdx];
    const dyWX = TIAN_GAN_WUXING[dyGan];
    const age = startAge + (i - 1) * 10;
    daYun.push({
      age,
      year: birthYear + age,
      ganZhi: `${dyGan}${dyZhi}`,
      wuxing: dyWX,
      interp: DAYUN_INTERP[dayWX]?.[dyWX] || '运势平稳，宜顺势而为。',
    });
  }

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    wuxingCount: count,
    dayMaster: dayGan,
    dayMasterWX: dayPillar.ganWX,
    strength,
    favorableWX: favorable,
    shenSha,
    solarTime: `${sy}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')} ${String(sh).padStart(2, '0')}:${String(smin).padStart(2, '0')}`,
    input: {
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      gender,
      longitude,
    },
    nayin,
    dayMasterPersonality,
    shiShenDetails,
    daYun,
  };
}
