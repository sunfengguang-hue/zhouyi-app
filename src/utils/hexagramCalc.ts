import type { TrigramName, HexagramLines, HexagramData } from '../types';
import { getLineType, getChangedValue, isLineChanged } from './divination';
import { hexagramsMap } from '../data/hexagrams';

// 八卦与三爻映射 (从下到上的三爻)
// 1=阳, 0=阴
const trigramMap: Record<string, TrigramName> = {
  '111': '乾',
  '110': '兑',
  '101': '离',
  '100': '震',
  '011': '巽',
  '010': '坎',
  '001': '艮',
  '000': '坤',
};

/**
 * 从三爻值计算卦名
 */
export function trigramFromValues(values: [number, number, number]): TrigramName {
  const binary = values.map(v => getLineType(v) === 'yang' ? '1' : '0').join('');
  return trigramMap[binary] || '乾';
}

/**
 * 从六爻值计算本卦的上下卦
 */
export function getTrigramsFromLines(lines: HexagramLines): {
  upper: TrigramName;
  lower: TrigramName;
} {
  // 下卦: 第 1-3 爻 (索引 0, 1, 2)
  const lower = trigramFromValues([lines[0], lines[1], lines[2]]);
  // 上卦: 第 4-6 爻 (索引 3, 4, 5)
  const upper = trigramFromValues([lines[3], lines[4], lines[5]]);

  return { upper, lower };
}

/**
 * 从六爻值获取卦象数据
 */
export function getHexagramFromLines(lines: HexagramLines): HexagramData {
  const { upper, lower } = getTrigramsFromLines(lines);
  const key = `${upper}_${lower}`;
  const hexagram = hexagramsMap[key];

  if (!hexagram) {
    // 回退到乾卦
    return hexagramsMap['乾_乾']!;
  }

  return hexagram;
}

/**
 * 从六爻值计算变卦（如有变爻）
 */
function getChangedLines(lines: HexagramLines): HexagramLines {
  return lines.map(v => getChangedValue(v)) as HexagramLines;
}

/**
 * 获取变爻位置列表 (1-6)
 */
export function getChangedPositions(lines: HexagramLines): number[] {
  const positions: number[] = [];
  lines.forEach((value, index) => {
    if (isLineChanged(value)) {
      positions.push(index + 1);
    }
  });
  return positions;
}

/**
 * 获取变卦数据 (如有变爻)
 */
export function getChangedHexagramFromLines(
  lines: HexagramLines
): HexagramData | null {
  const changedPositions = getChangedPositions(lines);
  if (changedPositions.length === 0) return null;

  const changedLines = getChangedLines(lines);
  return getHexagramFromLines(changedLines);
}

// ── 卦象关系计算 ────────────────────────────────────────────────────────────────

/**
 * 将爻值转为阴阳静态值 (7=阳, 8=阴)
 * 用于卦象关系计算时忽略变爻状态
 */
function toStaticLines(lines: HexagramLines): HexagramLines {
  return lines.map(v => getLineType(v) === 'yang' ? 7 : 8) as HexagramLines;
}

/**
 * 互卦 (Nuclear Hexagram)
 * 取本卦的第2-3-4爻为下卦，第3-4-5爻为上卦
 * 揭示事物的内在动力与隐藏因素
 */
export function getNuclearHexagram(lines: HexagramLines): HexagramData {
  const staticLines = toStaticLines(lines);
  // 下卦 = 第2,3,4爻 (索引 1,2,3)
  const nuclearLower = [staticLines[1], staticLines[2], staticLines[3]] as [number, number, number];
  // 上卦 = 第3,4,5爻 (索引 2,3,4)
  const nuclearUpper = [staticLines[2], staticLines[3], staticLines[4]] as [number, number, number];

  const upper = trigramFromValues(nuclearUpper);
  const lower = trigramFromValues(nuclearLower);
  const key = `${upper}_${lower}`;
  return hexagramsMap[key] || hexagramsMap['乾_乾']!;
}

/**
 * 错卦 (Opposite Hexagram)
 * 将本卦每一爻阴阳互换（阳变阴，阴变阳）
 * 代表事物的对立面与互补视角
 */
export function getOppositeHexagram(lines: HexagramLines): HexagramData {
  const staticLines = toStaticLines(lines);
  const oppositeLines = staticLines.map(v => v === 7 ? 8 : 7) as HexagramLines;
  return getHexagramFromLines(oppositeLines);
}

/**
 * 综卦 (Reversed Hexagram)
 * 将本卦上下翻转（第1爻变第6爻，第2爻变第5爻，依此类推）
 * 代表从对方或相反角度看同一件事
 */
export function getReversedHexagram(lines: HexagramLines): HexagramData {
  const staticLines = toStaticLines(lines);
  const reversedLines = [...staticLines].reverse() as HexagramLines;
  return getHexagramFromLines(reversedLines);
}

/**
 * 一次性获取所有卦象关系
 */
export function getHexagramRelationships(lines: HexagramLines): {
  nuclear: HexagramData;
  opposite: HexagramData;
  reversed: HexagramData;
} {
  return {
    nuclear: getNuclearHexagram(lines),
    opposite: getOppositeHexagram(lines),
    reversed: getReversedHexagram(lines),
  };
}
