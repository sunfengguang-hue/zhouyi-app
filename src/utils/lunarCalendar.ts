// 天干地支与生肖
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 农历月份名
const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
];

// 农历日期名
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

// 已知春节（正月初一）对应的公历日期
// key: 农历年份, value: [公历月(1-based), 公历日]
const LUNAR_NEW_YEAR: Record<number, [number, number]> = {
  1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3], 2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19],
  2035: [2, 8], 2036: [1, 28], 2037: [2, 15], 2038: [2, 4], 2039: [1, 24],
  2040: [2, 12], 2041: [2, 1], 2042: [1, 22], 2043: [2, 10], 2044: [1, 30],
  2045: [2, 17], 2046: [2, 6], 2047: [1, 26], 2048: [2, 14], 2049: [2, 2],
  2050: [1, 23],
};

// 已知每年正月初一对应的公历日期 (Date对象)
function getLunarNewYearDate(lunarYear: number): Date | null {
  const entry = LUNAR_NEW_YEAR[lunarYear];
  if (!entry) return null;
  return new Date(lunarYear, entry[0] - 1, entry[1]);
}

// 两个日期之间的天数差
function daysBetween(a: Date, b: Date): number {
  const MS_PER_DAY = 86400000;
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// 根据农历年的天数估算农历月日
// 农历每月约29.5天，一年约354天（12个月）或384天（13个月含闰月）
function estimateLunarMonthDay(daysSinceNewYear: number): { month: number; day: number } {
  // 每个月的天数近似（交替29和30天）
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];

  let remaining = daysSinceNewYear;
  let month = 0;

  for (let i = 0; i < 13; i++) {
    const len = monthLengths[i] || 29;
    if (remaining < len) {
      month = i;
      break;
    }
    remaining -= len;
    month = i + 1;
  }

  // 限制在0-11月
  if (month > 11) month = 11;
  const day = Math.max(0, Math.min(remaining, 29));

  return { month, day };
}

// 获取干支纪年（以立春为界，约2月4日）
function getGanZhi(year: number, month: number, day: number): string {
  // 立春约在2月3-5日，简化为2月4日
  // 若日期在立春之前，则使用上一年的干支
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }

  const ganIndex = (effectiveYear - 4) % 10;
  const zhiIndex = (effectiveYear - 4) % 12;

  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

// 获取生肖
function getShengXiao(year: number, month: number, day: number): string {
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }

  const idx = (effectiveYear - 4) % 12;
  return SHENG_XIAO[idx];
}

// 24节气 (近似公历日期)
// 每个节气约间隔15天，以下为近似日期（每年略有不同，取常见值）
interface SolarTermEntry {
  name: string;
  month: number; // 1-based
  day: number;
}

const SOLAR_TERMS: SolarTermEntry[] = [
  { name: '小寒', month: 1, day: 6 },
  { name: '大寒', month: 1, day: 20 },
  { name: '立春', month: 2, day: 4 },
  { name: '雨水', month: 2, day: 19 },
  { name: '惊蛰', month: 3, day: 6 },
  { name: '春分', month: 3, day: 21 },
  { name: '清明', month: 4, day: 5 },
  { name: '谷雨', month: 4, day: 20 },
  { name: '立夏', month: 5, day: 6 },
  { name: '小满', month: 5, day: 21 },
  { name: '芒种', month: 6, day: 6 },
  { name: '夏至', month: 6, day: 21 },
  { name: '小暑', month: 7, day: 7 },
  { name: '大暑', month: 7, day: 23 },
  { name: '立秋', month: 8, day: 7 },
  { name: '处暑', month: 8, day: 23 },
  { name: '白露', month: 9, day: 8 },
  { name: '秋分', month: 9, day: 23 },
  { name: '寒露', month: 10, day: 8 },
  { name: '霜降', month: 10, day: 23 },
  { name: '立冬', month: 11, day: 7 },
  { name: '小雪', month: 11, day: 22 },
  { name: '大雪', month: 12, day: 7 },
  { name: '冬至', month: 12, day: 22 },
];

// 获取当前节气（如果今天恰好是节气日，或±1天范围内）
function getSolarTerm(month: number, day: number): string {
  for (const term of SOLAR_TERMS) {
    if (term.month === month && Math.abs(term.day - day) <= 1) {
      return term.name;
    }
  }
  return '';
}

// 获取最近的节气名称（用于显示）
function getNearestSolarTerm(month: number, day: number): string {
  // 精确匹配
  for (const term of SOLAR_TERMS) {
    if (term.month === month && term.day === day) {
      return term.name;
    }
  }
  return '';
}

// 主导出函数
export interface LunarInfo {
  ganZhi: string;      // e.g., "乙巳"
  shengXiao: string;   // e.g., "蛇"
  lunarMonth: string;  // e.g., "六月"
  lunarDay: string;    // e.g., "廿三"
  solarTerm: string;   // e.g., "小暑" or ""
}

export function getLunarInfo(): LunarInfo {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based
  const day = now.getDate();

  // 干支纪年
  const ganZhi = getGanZhi(year, month, day);

  // 生肖
  const shengXiao = getShengXiao(year, month, day);

  // 农历月日估算
  // 确定当前日期属于哪个农历年
  let lunarYear = year;
  let nyDate = getLunarNewYearDate(year);

  if (nyDate && now < nyDate) {
    // 还没到今年的春节，用去年的
    lunarYear = year - 1;
    nyDate = getLunarNewYearDate(lunarYear);
  }

  let lunarMonthStr = '';
  let lunarDayStr = '';

  if (nyDate) {
    const daysSince = daysBetween(nyDate, now);
    if (daysSince >= 0) {
      const { month: lm, day: ld } = estimateLunarMonthDay(daysSince);
      lunarMonthStr = LUNAR_MONTH_NAMES[lm] || '腊月';
      lunarDayStr = LUNAR_DAY_NAMES[ld] || '三十';
    }
  }

  // 如果没有找到春节数据，显示空白
  if (!lunarMonthStr) {
    lunarMonthStr = '';
    lunarDayStr = '';
  }

  // 节气
  const solarTerm = getNearestSolarTerm(month, day) || getSolarTerm(month, day);

  return {
    ganZhi,
    shengXiao,
    lunarMonth: lunarMonthStr,
    lunarDay: lunarDayStr,
    solarTerm,
  };
}
