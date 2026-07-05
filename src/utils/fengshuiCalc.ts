import type { FengshuiResult, BaguaName } from '../types';
import { BA_GUA_NUM } from '../data/bazi';
import { YOUXING_MAP, YOUXING_LUCK, BAGUA_DIRECTION, DONG_XI_GROUP } from '../data/fengshui';

const GUA_ORDER: BaguaName[] = ['坎','艮','震','巽','离','坤','兑','乾'];

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

  return {
    mingGua,
    group,
    directions,
    houseSitting: sittingStr,
    houseFacing: sittingStr.replace(/坐.*朝/, '').replace(/\(.*$/, ''),
    bestDirections,
    input: { birthYear, gender, sitting: sittingStr },
  };
}
