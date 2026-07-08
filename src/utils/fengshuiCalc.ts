import type { FengshuiResult, BaguaName } from '../types';
import { BA_GUA_NUM } from '../data/bazi';
import {
  YOUXING_MAP, YOUXING_LUCK, BAGUA_DIRECTION, DONG_XI_GROUP,
  MINGGUA_DESC, YOUXING_DETAIL, CURE_METHODS,
} from '../data/fengshui';

const GUA_ORDER: BaguaName[] = ['坎','艮','震','巽','离','坤','兑','乾'];

// 东四宅坐向卦位
const DONG_SI_ZHAI: BaguaName[] = ['坎', '离', '震', '巽'];
// 西四宅坐向卦位
const XI_SI_ZHAI: BaguaName[] = ['乾', '坤', '艮', '兑'];

/**
 * 从坐向字符串提取卦名
 */
function extractSittingGua(sittingStr: string): BaguaName | null {
  const match = sittingStr.match(/\(([^)]+)\)$/);
  if (match) {
    return match[1] as BaguaName;
  }
  return null;
}

/**
 * 计算命卦（八宅明镜法）
 */
function calcMingGua(birthYear: number, gender: '男' | '女'): BaguaName {
  let n: number;
  if (gender === '男') {
    n = 100 - (birthYear % 100);
  } else {
    n = (birthYear % 100) - 4;
  }
  const remainder = ((n % 9) + 9) % 9;
  return (BA_GUA_NUM[remainder] || '坎') as BaguaName;
}


/**
 * 主函数
 */
export function calculateFengshui(
  birthYear: number,
  gender: '男' | '女',
  sittingStr: string,
): FengshuiResult {
  const mingGua = calcMingGua(birthYear, gender);
  const group = DONG_XI_GROUP[mingGua];
  const youXingArr = YOUXING_MAP[mingGua];

  const directions = GUA_ORDER.map((gua, i) => {
    const yx = youXingArr[i];
    const info = YOUXING_LUCK[yx];
    // 布局建议
    let suggestion = '';
    if (info.lucky) {
      if (yx === '生气') suggestion = '宜设客厅、大门、主卧，主旺财旺运';
      else if (yx === '天医') suggestion = '宜设卧室、书房，利健康学业';
      else if (yx === '延年') suggestion = '宜设婚房、起居室，利感情家庭';
      else suggestion = '可作为日常活动区域';
    } else {
      if (yx === '绝命') suggestion = '宜作厕所、储物间，压制凶气';
      else if (yx === '五鬼') suggestion = '宜作厨房或杂物间，火气化煞';
      else if (yx === '六煞') suggestion = '可作卫浴或走廊，化解凶煞';
      else suggestion = '宜作次要空间，避免久留';
    }

    return {
      direction: BAGUA_DIRECTION[gua],
      gua,
      youXing: yx,
      lucky: info.lucky,
      description: `${yx}（${info.level}）${info.desc}`,
      suggestion,
    };
  });

  const bestDirections = directions.filter(d => d.lucky).map(d => `${d.direction}方(${d.youXing})`);

  // 命卦详解
  const mingGuaDesc = MINGGUA_DESC[mingGua] || '';

  // 宅命匹配
  const sittingGua = extractSittingGua(sittingStr);
  let houseCompatibility = { match: true, analysis: '', remedy: '' };
  if (sittingGua) {
    const isDongMing = group === '东四命';
    const isDongZhai = DONG_SI_ZHAI.includes(sittingGua);
    const isXiZhai = XI_SI_ZHAI.includes(sittingGua);

    if (isDongMing && isDongZhai) {
      houseCompatibility = {
        match: true,
        analysis: `您为${group}（${mingGua}卦），房屋${sittingStr}属东四宅。命卦与宅卦同属东四，宅命相配，大吉。居住此宅有利于您的运势发挥，身心健康、事业顺遂。`,
        remedy: '宅命相配，无需特别化解。可在吉方加强布局，锦上添花。',
      };
    } else if (!isDongMing && isXiZhai) {
      houseCompatibility = {
        match: true,
        analysis: `您为${group}（${mingGua}卦），房屋${sittingStr}属西四宅。命卦与宅卦同属西四，宅命相配，大吉。居住此宅与您的命格相合，有利于家庭和谐与事业发展。`,
        remedy: '宅命相配，无需特别化解。可在吉方加强布局，锦上添花。',
      };
    } else if (isDongMing && isXiZhai) {
      houseCompatibility = {
        match: false,
        analysis: `您为${group}（${mingGua}卦），房屋${sittingStr}属西四宅。命卦属东四而宅属西四，宅命不配。居住此宅可能会导致运势受阻，身体或事业方面易生波折。不过无需过于担忧，通过合理的风水布局可以化解大部分不利影响。`,
        remedy: '化解方法：可在房屋的东四吉方（北、南、东、东南方）多活动，将主卧或客厅尽量安排在您的吉方。在门口放置一对铜貔貅镇宅，或在客厅东方摆放大型绿植，以木气生旺东四命。卧室宜选择您的延年方或天医方安放床位。',
      };
    } else {
      houseCompatibility = {
        match: false,
        analysis: `您为${group}（${mingGua}卦），房屋${sittingStr}属东四宅。命卦属西四而宅属东四，宅命不配。居住此宅可能会有些许不适感，运势起伏较大。但通过风水调整，可以有效改善。`,
        remedy: '化解方法：可在房屋的西四吉方（西北、西南、东北、西方）多活动，将重要家具安排在您的吉方。在卧室的伏位方放置铜制摆件增强气场，或在门口放置黄色地毯以土气通关化解。书房宜设在您的生气方或天医方。',
      };
    }
  } else {
    houseCompatibility = {
      match: true,
      analysis: '未能识别房屋坐向卦位，请参考方位吉凶进行布局。',
      remedy: '建议选择明确的坐向进行测算，以获得更准确的宅命匹配分析。',
    };
  }

  // 方位详解
  const directionDetails = directions.map(d => {
    const detail = YOUXING_DETAIL[d.youXing];
    return {
      direction: d.direction,
      youXing: d.youXing,
      detail: detail?.detail || d.description,
      colors: detail?.colors || '',
      elements: detail?.elements || '',
    };
  });

  // 化解建议（仅凶方）
  const cures = directions
    .filter(d => !d.lucky)
    .map(d => ({
      direction: d.direction,
      youXing: d.youXing,
      cure: CURE_METHODS[d.youXing] || d.suggestion,
    }));

  return {
    mingGua,
    group,
    directions,
    houseSitting: sittingStr,
    houseFacing: sittingStr.replace(/坐.*朝/, '').replace(/\(.*$/, ''),
    bestDirections,
    input: { birthYear, gender, sitting: sittingStr },
    mingGuaDesc,
    houseCompatibility,
    directionDetails,
    cures,
  };
}
