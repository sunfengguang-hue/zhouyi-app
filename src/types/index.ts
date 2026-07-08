// 卦名（八卦）
export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

// 爻的类型
export type LineType = 'yang' | 'yin'; // 阳爻 / 阴爻
export type LineChange = 'unchanged' | 'changed'; // 不变 / 变爻

// 单个爻的信息
export interface LineInfo {
  position: number;       // 爻位 (1-6, 从下到上)
  value: number;          // 铜钱之和 (6, 7, 8, 9)
  type: LineType;         // 阴阳
  change: LineChange;     // 是否变爻
  name: string;           // 爻的名称 (初六, 九二, ...)
  text: string;           // 爻辞
  translation: string;   // 白话译文
}

// 六爻组合
export type HexagramLines = [number, number, number, number, number, number]; // 从下到上

// 八卦信息
export interface TrigramInfo {
  name: TrigramName;
  nature: string;         // 自然属性 (天, 泽, 火, 雷, 风, 水, 山, 地)
  attribute: string;      // 属性 (健, 说, 丽, 动, 入, 陷, 止, 顺)
  symbol: string[][];     // 三爻符号表示
}

// 卦象数据
export interface HexagramData {
  number: number;              // 卦序 (1-64)
  name: string;                // 卦名 (如"乾")
  fullName: string;            // 全名 (如"乾为天")
  upperTrigram: TrigramName;   // 上卦
  lowerTrigram: TrigramName;   // 下卦
  judgment: string;            // 卦辞
  judgmentTranslation: string;  // 卦辞白话译文
  image: string;               // 象辞
  imageTranslation: string;    // 象辞白话译文
  commentary: string;          // 彖辞
  commentaryTranslation: string; // 彖辞白话译文
  lines: LineInfo[];            // 六爻信息
  interpretation: {
    career: string;             // 事业
    love: string;               // 感情
    wealth: string;             // 财运
    health: string;             // 健康
  };
}

// 摇卦步骤
export interface CoinFlipResult {
  coins: [number, number, number]; // 三枚铜钱结果 (2 或 3)
  sum: number;                       // 总和 (6-9)
  position: number;                  // 第几爻
}

// 算卦状态
export type DivinationPhase = 'idle' | 'flipping' | 'complete';

export interface DivinationState {
  phase: DivinationPhase;
  currentFlip: number;          // 当前第几次摇 (0-5)
  lines: HexagramLines;         // 六爻数值
  flips: CoinFlipResult[];      // 每次摇卦的结果
  result: DivinationResult | null;
}

// 算卦结果
export interface DivinationResult {
  hexagram: HexagramData;           // 本卦
  changedHexagram: HexagramData | null; // 变卦 (无变爻时为 null)
  changedLines: number[];            // 变爻的位置列表 (1-6)
  lines: HexagramLines;             // 六爻数值 (从下到上)
  timestamp: number;
}

// 历史记录项
export interface HistoryItem {
  id: string;
  result: DivinationResult;
  timestamp: number;
}

// 分享图片配置
export interface ShareConfig {
  width: number;
  height: number;
  backgroundColor: string;
}

// ======================== 应用页面导航 ========================
export type AppView =
  | 'home'
  | 'zhouyi'
  | 'bazi'
  | 'astrology'
  | 'fengshui'
  | 'naming'
  | 'fortune'
  | 'tarot';

// ======================== 生辰八字 ========================
export type WuXing = '金' | '木' | '水' | '火' | '土';
export type YinYang = '阴' | '阳';

// 十神
export type ShiShen =
  | '比肩' | '劫财'
  | '食神' | '伤官'
  | '偏财' | '正财'
  | '七杀' | '正官'
  | '偏印' | '正印';

// 一柱（天干地支）
export interface BaziPillar {
  gan: string;     // 天干
  zhi: string;     // 地支
  ganWX: WuXing;   // 天干五行
  zhiWX: WuXing;   // 地支五行
  ganSS: ShiShen;  // 天干十神（年月时柱；日柱为日主）
  zhiCangGan: { gan: string; wx: WuXing; ss: ShiShen }[]; // 地支藏干
  zhiSS: ShiShen;  // 地支主气十神
}

export interface BaziResult {
  year: BaziPillar;   // 年柱
  month: BaziPillar;  // 月柱
  day: BaziPillar;    // 日柱（日主）
  hour: BaziPillar;   // 时柱
  wuxingCount: Record<WuXing, number>; // 五行计数（含藏干）
  dayMaster: string;  // 日主天干
  dayMasterWX: WuXing;
  strength: '旺' | '偏旺' | '中和' | '偏弱' | '弱';
  favorableWX: WuXing[]; // 喜用神
  shenSha: string[];  // 神煞提示
  solarTime: string;  // 真太阳时
  input: {
    date: string;
    time: string;
    gender: '男' | '女';
    longitude: number;
  };
  nayin: { pillar: string; nayin: string }[];
  dayMasterPersonality: { character: string; career: string; love: string; wealth: string };
  shiShenDetails: { name: string; position: string; meaning: string }[];
  daYun: { age: number; year: number; ganZhi: string; wuxing: string }[];
}

// ======================== 星座 ========================
export interface AstrologySign {
  name: string;
  symbol: string;
  element: '火' | '土' | '风' | '水';
  ruler: string;       // 守护星
  dateRange: string;
  traits: string[];
  personality: string;        // 性格详解 (2-3 paragraphs)
  strength: string[];         // 优点 (3-5 items)
  weakness: string[];         // 缺点 (3-5 items)
  bestMatch: string;          // 最佳配对星座名
  bestMatchDesc: string;      // 配对说明
  love: string;
  career: string;
  wealth: string;
  health: string;
  luckyColor: string;
  luckyNumber: number;
}

export interface AstrologyResult {
  sign: AstrologySign;
  todayFortune: {
    career: number;  // 1-5
    love: number;
    wealth: number;
    health: number;
    summary: string;
  };
  weeklyFortune: {
    overall: string;    // 本周总体运势
    career: string;     // 本周事业
    love: string;       // 本周感情
    wealth: string;     // 本周财运
    advice: string;     // 本周建议
  };
  compatibleSigns: { sign: string; score: number }[];
  input: { month: number; day: number };
}

// ======================== 风水（八宅） ========================
export type BaguaName = '坎' | '艮' | '震' | '巽' | '离' | '坤' | '兑' | '乾';
export type YouXing = '生气' | '天医' | '延年' | '伏位' | '绝命' | '五鬼' | '六煞' | '祸害';

export interface FengshuiDirection {
  direction: string;   // 方位名（北、东北、东...）
  gua: BaguaName;      // 卦名
  youXing: YouXing;    // 游星
  lucky: boolean;      // 是否吉方
  description: string; // 说明
  suggestion: string;  // 布局建议
}

export interface FengshuiResult {
  mingGua: BaguaName;  // 命卦
  group: '东四命' | '西四命';
  directions: FengshuiDirection[]; // 八方吉凶
  houseSitting: string; // 房屋坐向
  houseFacing: string;
  bestDirections: string[]; // 最佳方位
  input: { birthYear: number; gender: '男' | '女'; sitting: string };
  mingGuaDesc: string;           // 命卦详解
  houseCompatibility: { match: boolean; analysis: string; remedy: string }; // 宅命匹配
  directionDetails: { direction: string; youXing: string; detail: string; colors: string; elements: string }[]; // 方位详解
  cures: { direction: string; youXing: string; cure: string }[]; // 化解建议
}

// ======================== 起名 ========================
export interface NameChar {
  char: string;        // 汉字
  pinyin: string;      // 拼音
  strokes: number;     // 康熙笔画
  wuxing: WuXing;      // 五行
  meaning: string;     // 寓意
  gender: '男' | '女' | '中';
  radical: string;     // 部首
}

export interface NameResult {
  fullName: string;
  givenName: string;
  wuge: {
    tian: number;   // 天格
    ren: number;    // 人格
    di: number;     // 地格
    wai: number;    // 外格
    zong: number;   // 总格
  };
  wugeJi: { index: number; luck: '吉' | '半吉' | '凶'; desc: string }[];
  sancai: { tian: WuXing; ren: WuXing; di: WuXing; luck: '吉' | '半吉' | '凶'; desc: string };
  score: number;       // 综合评分 0-100
  meaning: string;     // 名字寓意
  chars: NameChar[];
  pronunciation: { score: number; analysis: string }; // 音韵评分
  charDetails: { char: string; wuxing: string; strokes: number; meaning: string; radical: string }[]; // 逐字分析
  fullNameMeaning: string; // 合成寓意（2-3句）
  zodiacAdvice: string; // 生肖宜忌建议
}


// ======================== 抽签问事 ========================
export type FortuneStickLevel = '上上签' | '上签' | '中签' | '下签' | '下下签';

export interface FortuneStick {
  id: number;           // 签号 1-100
  title: string;        // 签题（典故）
  level: FortuneStickLevel; // 签等
  poem: string;         // 签诗（四句）
  interpretation: string; // 解曰
  story: string;          // 典故/历史故事 (2-3 sentences)
  advice: { good: string[]; bad: string[] }; // 仙机提示 (宜/忌 items)
  meaning: {
    overall: string;    // 总体解读
    career: string;     // 事业
    love: string;       // 感情
    wealth: string;     // 财运
    health: string;     // 健康
  };
}

export interface FortuneStickResult {
  stick: FortuneStick;
  question: string;     // 用户所问之事
  timestamp: number;
}

// ======================== 塔罗牌 ========================
export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type TarotOrientation = 'upright' | 'reversed';

export interface TarotCard {
  id: number;
  name: string;           // 牌名
  nameEn: string;         // 英文名
  suit: TarotSuit;        // 花色
  number: number;         // 编号
  upright: string;        // 正位含义
  reversed: string;       // 逆位含义
  keywords: string[];     // 关键词
  description: string;    // 牌面描述
  element: string;        // 元素（火/水/风/土）
  planet: string;         // 对应星体/星座
}

export type TarotSpreadType = 'single' | 'three' | 'relationship';

export interface TarotDraw {
  card: TarotCard;
  orientation: TarotOrientation;
  position: string;       // 位置名（过去/现在/未来 等）
}

export interface TarotResult {
  spreadType: TarotSpreadType;
  draws: TarotDraw[];
  question: string;
  summary: string;        // 综合解读
  combination: string;    // 组合解读（三牌阵）
  timestamp: number;
}
