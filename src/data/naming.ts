import type { WuXing, NameChar } from '../types';

// ==================== 81数理吉凶 ====================
export const SHULI: Record<number, { luck: '吉' | '半吉' | '凶'; desc: string }> = {
  1: { luck: '吉', desc: '万物开头，最大吉数' },
  2: { luck: '凶', desc: '动摇不安，根基不固' },
  3: { luck: '吉', desc: '如意吉祥，进取如意的数' },
  4: { luck: '凶', desc: '万事休止数，不足不满' },
  5: { luck: '吉', desc: '福禄长寿的福德数' },
  6: { luck: '吉', desc: '吉人天相数，逢凶化吉' },
  7: { luck: '吉', desc: '刚毅果断，勇往直前' },
  8: { luck: '吉', desc: '意志坚强，有志竟成' },
  9: { luck: '凶', desc: '穷困逆境数，短命悲叹' },
  10: { luck: '凶', desc: '万事终局，零暗孤苦' },
  11: { luck: '吉', desc: '稳健吉顺富贵数' },
  12: { luck: '凶', desc: '薄弱无力挫折数' },
  13: { luck: '吉', desc: '智能超群成功数' },
  14: { luck: '凶', desc: '破兆浮沉破家数' },
  15: { luck: '吉', desc: '福寿双全的立业数' },
  16: { luck: '吉', desc: '贵人相助的大吉数' },
  17: { luck: '吉', desc: '突破万难的刚柔数' },
  18: { luck: '吉', desc: '有志竟成的内外有智数' },
  19: { luck: '凶', desc: '多难困苦的阴影数' },
  20: { luck: '凶', desc: '实而不华数' },
  21: { luck: '吉', desc: '明月光照独立权威数' },
  22: { luck: '凶', desc: '秋草逢霜的斗争数' },
  23: { luck: '吉', desc: '旭日东升的发育数' },
  24: { luck: '吉', desc: '家门前途的丰财数' },
  25: { luck: '吉', desc: '英俊刚毅资性聪敏数' },
  26: { luck: '半吉', desc: '变怪奇特的豪侠数' },
  27: { luck: '吉', desc: '足智多谋的期望数' },
  28: { luck: '凶', desc: '阔水浮萍的豪气数' },
  29: { luck: '吉', desc: '顺理成章的智谋数' },
  30: { luck: '半吉', desc: '非运浮沉的浮沉数' },
  31: { luck: '吉', desc: '春日花开的智勇数' },
  32: { luck: '吉', desc: '宝马金鞍的侥幸数' },
  33: { luck: '吉', desc: '家门隆昌的才智数' },
  34: { luck: '凶', desc: '破家亡身的见识数' },
  35: { luck: '吉', desc: '温和平安好艺才数' },
  36: { luck: '凶', desc: '波澜壮阔的侠义数' },
  37: { luck: '吉', desc: '权威显达的猛虎数' },
  38: { luck: '半吉', desc: '磨铁成针的意志数' },
  39: { luck: '吉', desc: '富贵荣华的平安数' },
  40: { luck: '凶', desc: '智谋胆略的退安数' },
  41: { luck: '吉', desc: '德望高大事事如意数' },
  42: { luck: '半吉', desc: '寒蝉在柳的十艺数' },
  43: { luck: '凶', desc: '散财破产的辛苦数' },
  44: { luck: '凶', desc: '烦闷损寿的破灭数' },
  45: { luck: '吉', desc: '顺风扬帆的新生数' },
  46: { luck: '凶', desc: '浪里行舟的载宝数' },
  47: { luck: '吉', desc: '点石成金的掌上明珠数' },
  48: { luck: '吉', desc: '古松立鹤的德智兼备数' },
  49: { luck: '凶', desc: '吉凶参半辛苦数' },
  50: { luck: '半吉', desc: '小舟入海的一成一败数' },
  51: { luck: '半吉', desc: '一成一败的盛衰数' },
  52: { luck: '吉', desc: '先见之明的理想数' },
  53: { luck: '凶', desc: '忧愁困苦的忧愁数' },
  54: { luck: '凶', desc: '多难之数' },
  55: { luck: '半吉', desc: '外祥内苦的和顺数' },
  56: { luck: '凶', desc: '浪里行舟的万事数' },
  57: { luck: '吉', desc: '日照春松的寒莺数' },
  58: { luck: '半吉', desc: '晚行遇月的半吉数' },
  59: { luck: '凶', desc: '寒蝉悲风的运数' },
  60: { luck: '凶', desc: '无谋无勇的黑暗数' },
  61: { luck: '吉', desc: '名利双收的修身数' },
  62: { luck: '半吉', desc: '基础不固的衰败数' },
  63: { luck: '吉', desc: '富贵荣华的吉祥数' },
  64: { luck: '凶', desc: '骨肉分离的孤独数' },
  65: { luck: '吉', desc: '富贵至极的富贵数' },
  66: { luck: '凶', desc: '内外不和的多灾数' },
  67: { luck: '吉', desc: '顺风通达的财禄数' },
  68: { luck: '吉', desc: '兴家立业的宽容数' },
  69: { luck: '凶', desc: '坐立不安的处世数' },
  70: { luck: '凶', desc: '空虚毁灭的凶兆数' },
  71: { luck: '半吉', desc: '石中隐玉的进退取数' },
  72: { luck: '半吉', desc: '劳苦内外的自位数' },
  73: { luck: '半吉', desc: '志高力微的努力数' },
  74: { luck: '凶', desc: '沉沦逆运的暗淡数' },
  75: { luck: '半吉', desc: '守正不移的保守数' },
  76: { luck: '半吉', desc: '倾覆离散的倾离数' },
  77: { luck: '半吉', desc: '家庭有缘的半吉半凶数' },
  78: { luck: '半吉', desc: '晚景凄凉的波澜数' },
  79: { luck: '凶', desc: '云头望月的辛苦数' },
  80: { luck: '凶', desc: '遁隐退志的困苦数' },
  81: { luck: '吉', desc: '万物回春的还原数' },
};

/** 获取数理吉凶信息 */
export function getShuli(n: number): { index: number; luck: '吉' | '半吉' | '凶'; desc: string } {
  const idx = n > 81 ? (n % 80 === 0 ? 80 : n % 80) : n;
  const item = SHULI[idx] || { luck: '半吉' as const, desc: '未知' };
  return { index: idx, luck: item.luck, desc: item.desc };
}

// ==================== 三才配置 ====================
export function numToWX(n: number): WuXing {
  const last = n % 10;
  if (last === 1 || last === 2) return '木';
  if (last === 3 || last === 4) return '火';
  if (last === 5 || last === 6) return '土';
  if (last === 7 || last === 8) return '金';
  return '水';
}

const WX_SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const WX_KE: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

export function getSancai(tian: WuXing, ren: WuXing, di: WuXing): {
  luck: '吉' | '半吉' | '凶';
  desc: string;
} {
  const tToR = tian === ren ? '比' : (WX_SHENG[tian] === ren ? '生' : (WX_KE[tian] === ren ? '克' : '异'));
  const rToD = ren === di ? '比' : (WX_SHENG[ren] === di ? '生' : (WX_KE[ren] === di ? '克' : '异'));

  if (tToR === '克' || rToD === '克') {
    return { luck: '凶', desc: '三才相克，基础不稳，易生波折' };
  }
  if (tToR === '生' && rToD === '生') {
    return { luck: '吉', desc: '三才相生，根基稳固，顺遂通达' };
  }
  if (tian === ren && ren === di) {
    return { luck: '吉', desc: '三才比和，一气贯通，同心协力' };
  }
  return { luck: '半吉', desc: '三才平和，中等配置，平稳发展' };
}

// ==================== 常用吉祥汉字库（康熙笔画） ====================
export const NAME_CHARS: NameChar[] = [
  { char: '桐', pinyin: 'tong', strokes: 10, wuxing: '木', meaning: '梧桐，高洁挺拔', gender: '中' },
  { char: '梓', pinyin: 'zi', strokes: 11, wuxing: '木', meaning: '故乡，栋梁之材', gender: '中' },
  { char: '森', pinyin: 'sen', strokes: 12, wuxing: '木', meaning: '茂盛繁荣', gender: '男' },
  { char: '林', pinyin: 'lin', strokes: 8, wuxing: '木', meaning: '繁盛众多', gender: '中' },
  { char: '柏', pinyin: 'bai', strokes: 9, wuxing: '木', meaning: '柏树，四季常青', gender: '男' },
  { char: '松', pinyin: 'song', strokes: 8, wuxing: '木', meaning: '松树，坚韧不拔', gender: '男' },
  { char: '栋', pinyin: 'dong', strokes: 12, wuxing: '木', meaning: '栋梁之材', gender: '男' },
  { char: '杰', pinyin: 'jie', strokes: 12, wuxing: '木', meaning: '杰出，英杰', gender: '男' },
  { char: '雅', pinyin: 'ya', strokes: 12, wuxing: '木', meaning: '高雅，文雅', gender: '女' },
  { char: '芳', pinyin: 'fang', strokes: 10, wuxing: '木', meaning: '芬芳，美好', gender: '女' },
  { char: '菲', pinyin: 'fei', strokes: 14, wuxing: '木', meaning: '花草茂盛', gender: '女' },
  { char: '蕾', pinyin: 'lei', strokes: 19, wuxing: '木', meaning: '花蕾，希望', gender: '女' },
  { char: '炎', pinyin: 'yan', strokes: 8, wuxing: '火', meaning: '光焰炽盛', gender: '男' },
  { char: '煜', pinyin: 'yu', strokes: 13, wuxing: '火', meaning: '光辉照耀', gender: '男' },
  { char: '烨', pinyin: 'ye', strokes: 14, wuxing: '火', meaning: '光辉灿烂', gender: '男' },
  { char: '灿', pinyin: 'can', strokes: 17, wuxing: '火', meaning: '灿烂辉煌', gender: '男' },
  { char: '明', pinyin: 'ming', strokes: 8, wuxing: '火', meaning: '光明，明智', gender: '中' },
  { char: '旭', pinyin: 'xu', strokes: 6, wuxing: '火', meaning: '旭日东升', gender: '男' },
  { char: '晨', pinyin: 'chen', strokes: 11, wuxing: '火', meaning: '清晨，朝气', gender: '中' },
  { char: '晴', pinyin: 'qing', strokes: 12, wuxing: '火', meaning: '晴朗，开朗', gender: '女' },
  { char: '婷', pinyin: 'ting', strokes: 12, wuxing: '火', meaning: '亭亭玉立', gender: '女' },
  { char: '媛', pinyin: 'yuan', strokes: 12, wuxing: '火', meaning: '美好女子', gender: '女' },
  { char: '坤', pinyin: 'kun', strokes: 8, wuxing: '土', meaning: '大地，厚德载物', gender: '男' },
  { char: '城', pinyin: 'cheng', strokes: 10, wuxing: '土', meaning: '坚固，守护', gender: '男' },
  { char: '培', pinyin: 'pei', strokes: 11, wuxing: '土', meaning: '培养，培育', gender: '中' },
  { char: '坚', pinyin: 'jian', strokes: 11, wuxing: '土', meaning: '坚定，坚固', gender: '男' },
  { char: '磊', pinyin: 'lei', strokes: 15, wuxing: '土', meaning: '光明磊落', gender: '男' },
  { char: '宇', pinyin: 'yu', strokes: 6, wuxing: '土', meaning: '宇宙，胸怀', gender: '男' },
  { char: '轩', pinyin: 'xuan', strokes: 10, wuxing: '土', meaning: '气宇轩昂', gender: '男' },
  { char: '婉', pinyin: 'wan', strokes: 11, wuxing: '土', meaning: '温婉柔美', gender: '女' },
  { char: '韵', pinyin: 'yun', strokes: 19, wuxing: '土', meaning: '韵致，风韵', gender: '女' },
  { char: '鑫', pinyin: 'xin', strokes: 24, wuxing: '金', meaning: '财富兴盛', gender: '男' },
  { char: '锐', pinyin: 'rui', strokes: 15, wuxing: '金', meaning: '锐利，进取', gender: '男' },
  { char: '铭', pinyin: 'ming', strokes: 14, wuxing: '金', meaning: '铭记，铭刻', gender: '男' },
  { char: '锋', pinyin: 'feng', strokes: 15, wuxing: '金', meaning: '锋芒，先锋', gender: '男' },
  { char: '锦', pinyin: 'jin', strokes: 16, wuxing: '金', meaning: '锦绣前程', gender: '中' },
  { char: '钰', pinyin: 'yu', strokes: 13, wuxing: '金', meaning: '珍宝，坚金', gender: '中' },
  { char: '瑞', pinyin: 'rui', strokes: 14, wuxing: '金', meaning: '祥瑞，吉兆', gender: '男' },
  { char: '诚', pinyin: 'cheng', strokes: 14, wuxing: '金', meaning: '诚实，真诚', gender: '男' },
  { char: '珊', pinyin: 'shan', strokes: 10, wuxing: '金', meaning: '珊瑚，美好', gender: '女' },
  { char: '铃', pinyin: 'ling', strokes: 13, wuxing: '金', meaning: '铃铛，清脆', gender: '女' },
  { char: '淼', pinyin: 'miao', strokes: 12, wuxing: '水', meaning: '水势浩大', gender: '中' },
  { char: '润', pinyin: 'run', strokes: 16, wuxing: '水', meaning: '温润，滋润', gender: '男' },
  { char: '泽', pinyin: 'ze', strokes: 17, wuxing: '水', meaning: '恩泽，光泽', gender: '男' },
  { char: '浩', pinyin: 'hao', strokes: 11, wuxing: '水', meaning: '浩大，浩然', gender: '男' },
  { char: '渊', pinyin: 'yuan', strokes: 12, wuxing: '水', meaning: '学识渊博', gender: '男' },
  { char: '涵', pinyin: 'han', strokes: 12, wuxing: '水', meaning: '涵养，包容', gender: '中' },
  { char: '沛', pinyin: 'pei', strokes: 8, wuxing: '水', meaning: '充沛，丰盛', gender: '中' },
  { char: '洁', pinyin: 'jie', strokes: 16, wuxing: '水', meaning: '洁净，纯洁', gender: '女' },
  { char: '湘', pinyin: 'xiang', strokes: 13, wuxing: '水', meaning: '湘水，灵动', gender: '中' },
  { char: '溪', pinyin: 'xi', strokes: 14, wuxing: '水', meaning: '溪水，清澈', gender: '女' },
  { char: '安', pinyin: 'an', strokes: 6, wuxing: '土', meaning: '平安，安定', gender: '中' },
  { char: '宁', pinyin: 'ning', strokes: 14, wuxing: '火', meaning: '安宁，宁静', gender: '中' },
  { char: '乐', pinyin: 'le', strokes: 15, wuxing: '火', meaning: '快乐，欢欣', gender: '中' },
  { char: '嘉', pinyin: 'jia', strokes: 14, wuxing: '木', meaning: '美好，赞美', gender: '中' },
  { char: '泰', pinyin: 'tai', strokes: 9, wuxing: '水', meaning: '安泰，康泰', gender: '男' },
  { char: '和', pinyin: 'he', strokes: 8, wuxing: '水', meaning: '和谐，温和', gender: '中' },
  { char: '舒', pinyin: 'shu', strokes: 12, wuxing: '金', meaning: '舒展，舒适', gender: '女' },
  { char: '悦', pinyin: 'yue', strokes: 11, wuxing: '金', meaning: '喜悦，愉快', gender: '女' },
  { char: '思', pinyin: 'si', strokes: 9, wuxing: '金', meaning: '思考，思念', gender: '中' },
];

// 常见姓氏康熙笔画
export const SURNAMES: Record<string, number> = {
  '李': 7, '王': 4, '张': 11, '刘': 15, '陈': 16, '杨': 13, '赵': 14, '黄': 12,
  '周': 8, '吴': 7, '徐': 10, '孙': 10, '胡': 11, '朱': 6, '高': 10, '林': 8,
  '何': 7, '郭': 15, '马': 10, '罗': 20, '梁': 11, '宋': 7, '郑': 19, '谢': 17,
  '韩': 17, '唐': 10, '冯': 12, '于': 3, '董': 15, '萧': 19, '程': 12, '曹': 11,
  '袁': 10, '邓': 19, '许': 11, '傅': 12, '沈': 8, '曾': 12, '彭': 12, '吕': 7,
  '苏': 22, '卢': 16, '蒋': 17, '蔡': 17, '贾': 13, '丁': 2, '魏': 18, '薛': 19,
  '叶': 15, '阎': 16, '余': 7, '潘': 16, '杜': 7, '戴': 18, '夏': 10, '钟': 17,
  '汪': 8, '田': 5, '任': 6, '姜': 9, '范': 15, '方': 4, '石': 5, '姚': 9,
  '谭': 19, '盛': 12, '邹': 13, '熊': 14, '金': 8, '陆': 16, '郝': 14, '孔': 4,
  '白': 5, '崔': 11, '康': 11, '毛': 4, '邱': 12, '秦': 10, '江': 7, '史': 5,
  '顾': 21, '侯': 9, '邵': 12, '孟': 8, '龙': 16, '万': 15, '段': 9, '雷': 13,
  '钱': 16, '汤': 13, '尹': 4, '黎': 15, '易': 8, '常': 11, '武': 8, '乔': 12,
  '贺': 12, '赖': 16, '龚': 22, '文': 4,
};
