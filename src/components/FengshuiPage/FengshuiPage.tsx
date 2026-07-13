import React, { useState, useRef } from 'react';
import type { FengshuiResult } from '../../types';
import { calculateFengshui } from '../../utils/fengshuiCalc';
import { SITTING_OPTIONS } from '../../data/fengshui';
import ShareButton from '../ShareButton/ShareButton';
import './FengshuiPage.css';

const TRIGRAM_SYMBOLS: Record<string, string> = {
  '东': '☳', '东南': '☴', '南': '☲', '西南': '☷',
  '西': '☱', '西北': '☰', '北': '☵', '东北': '☶',
};

// 流年飞星动态计算（中宫星每年递减1，9→8→…→1→9循环）
const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
function getGanZhiYear(year: number): string {
  return TIAN_GAN[(year - 4) % 10] + DI_ZHI[(year - 4) % 12];
}

function getAnnualStars(year: number) {
  // 2026年一白入中宫 → 中宫星 = (11 - (year - 2026) % 9) % 9 || 9
  const centerStar = ((11 - ((year - 2026) % 9 + 9)) % 9) || 9;

  const STAR_DATA: Record<number, { name: string; color: string; lucky: boolean;
    effect: string; remedy: string; summary: string }> = {
    1: { name: '一白贪狼', color: '#3498db', lucky: true, summary: '一白贪狼星入中宫，桃花人缘当旺',
      effect: '桃花人缘星，利感情社交和远行', remedy: '摆放水晶或蓝色物品催旺' },
    2: { name: '二黑病符', color: '#e67e22', lucky: false, summary: '二黑病符星入中宫，注意健康',
      effect: '病符星入位，易引发健康问题', remedy: '放铜葫芦或六帝钱化煞' },
    3: { name: '三碧禄存', color: '#27ae60', lucky: false, summary: '三碧禄存星入中宫，防口舌是非',
      effect: '是非口舌星，易引起争吵纠纷', remedy: '放红色物品或长明灯化解' },
    4: { name: '四绿文曲', color: '#2ecc71', lucky: true, summary: '四绿文曲星入中宫，利学业考试',
      effect: '文昌星入位，利考试学业', remedy: '放四支富贵竹或文昌塔' },
    5: { name: '五黄廉贞', color: '#e74c3c', lucky: false, summary: '五黄廉贞星入中宫，宜静不宜动',
      effect: '最凶灾煞星，大病大灾之位', remedy: '放铜风铃或六帝钱强力化解' },
    6: { name: '六白武曲', color: '#f1c40f', lucky: true, summary: '六白武曲星入中宫，利事业权力',
      effect: '偏财权力星，利事业升职', remedy: '放金属摆件或铜器催旺' },
    7: { name: '七赤破军', color: '#e74c3c', lucky: false, summary: '七赤破军星入中宫，防破财口舌',
      effect: '破败盗劫星，易有口舌官非', remedy: '放蓝色花瓶或清水化解' },
    8: { name: '八白左辅', color: '#f39c12', lucky: true, summary: '八白左辅星入中宫，财星当旺',
      effect: '当旺财星，大利财运置业', remedy: '放黄色水晶或陶瓷摆件催旺' },
    9: { name: '九紫右弼', color: '#9b59b6', lucky: true, summary: '九紫右弼星入中宫，喜庆姻缘旺',
      effect: '喜庆姻缘星，利婚嫁添丁', remedy: '放红色中国结或紫色物品催旺' },
  };

  const directions = ['中宫', '西北', '西', '东北', '南', '北', '西南', '东', '东南'];
  const result: { direction: string; star: number; name: string; color: string;
    lucky: boolean; effect: string; remedy: string }[] = [];

  for (let i = 0; i < 9; i++) {
    const starNum = ((centerStar - 1 + i) % 9) + 1;
    const data = STAR_DATA[starNum];
    result.push({
      direction: directions[i], star: starNum, name: data.name, color: data.color,
      lucky: data.lucky,
      effect: i === 0 ? data.summary : data.effect,
      remedy: data.remedy,
    });
  }
  return { stars: result, centerSummary: STAR_DATA[centerStar].summary, ganZhi: getGanZhiYear(year) };
}

const FengshuiPage: React.FC = () => {
  const [year, setYear] = useState(1990);
  const [gender, setGender] = useState<'男'|'女'>('男');
  const [sitting, setSitting] = useState(SITTING_OPTIONS[0]);
  const [result, setResult] = useState<FengshuiResult | null>(null);

  if (result) return <FengshuiResultView result={result} onReset={() => setResult(null)} />;

  return (
    <div className="page-form">
      <p className="page-form__intro-fs">八宅明镜法 · 定命卦 · 明八方吉凶</p>
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', margin: '0 0 20px', letterSpacing: '0.5px' }}>
        八宅风水以出生年定命卦（东四命/西四命），<br/>配合房屋坐向，判八方游星吉凶，指导家居布局。
      </p>
      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">出生年份</label>
          <input className="page-form__input" type="number" min={1924} max={2025} value={year} onChange={e => setYear(+e.target.value)} />
        </div>
        <div className="page-form__group">
          <label className="page-form__label">性别</label>
          <select className="page-form__select" value={gender} onChange={e => setGender(e.target.value as '男'|'女')}>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
      </div>
      <div className="page-form__group">
        <label className="page-form__label">房屋坐向</label>
        <select className="page-form__select" value={sitting} onChange={e => setSitting(e.target.value)}>
          {SITTING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="page-form__actions">
        <button className="btn-primary" onClick={() => setResult(calculateFengshui(year, gender, sitting))}>开始测算</button>
      </div>
    </div>
  );
};


const FengshuiResultView: React.FC<{ result: FengshuiResult; onReset: () => void }> = ({ result, onReset }) => {
  const r = result;
  const resultRef = useRef<HTMLDivElement>(null);
  const luckyDirs = r.directions.filter(d => d.lucky);
  const unluckyDirs = r.directions.filter(d => !d.lucky);
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);
  const cx = 150, cy = 150, R = 130, Rmid = 95, Rinner = 55;

  const scrollToDirection = (dirName: string) => {
    const el = document.getElementById(`fs-dir-${dirName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('fs-result__card--highlight');
      setTimeout(() => el.classList.remove('fs-result__card--highlight'), 1500);
    }
  };

  // Build SVG compass sectors
  const dirAngles = [0, 45, 90, 135, 180, 225, 270, 315]; // 东=0°, 东南=45°, 南=90°...
  const sectorArc = (startDeg: number, endDeg: number, rOuter: number, rInner: number) => {
    const toRad = (d: number) => (d - 90) * Math.PI / 180;
    const x1 = cx + rOuter * Math.cos(toRad(startDeg));
    const y1 = cy + rOuter * Math.sin(toRad(startDeg));
    const x2 = cx + rOuter * Math.cos(toRad(endDeg));
    const y2 = cy + rOuter * Math.sin(toRad(endDeg));
    const x3 = cx + rInner * Math.cos(toRad(endDeg));
    const y3 = cy + rInner * Math.sin(toRad(endDeg));
    const x4 = cx + rInner * Math.cos(toRad(startDeg));
    const y4 = cy + rInner * Math.sin(toRad(startDeg));
    return `M${x1},${y1} A${rOuter},${rOuter} 0 0,1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 0,0 ${x4},${y4} Z`;
  };

  return (
    <div ref={resultRef} className="page-result fengshui-result">
      <h2 className="fs-result__title">八宅风水分析</h2>
      <div className="fs-result__mingua">
        <span className="tag tag-gold">{r.group}</span>
        <span className="fs-result__gua-name">命卦：{r.mingGua}卦</span>
        <span className="text-secondary"> · {r.houseSitting}</span>
      </div>

      {/* 吉凶概览 */}
      <div className="fs-result__summary" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
        <span className="fs-result__summary-item fs-result__summary-item--lucky">
          {luckyDirs.length}吉方
        </span>
        <span className="fs-result__summary-divider" />
        <span className="fs-result__summary-item fs-result__summary-item--unlucky">
          {unluckyDirs.length}凶方
        </span>
        <span className="fs-result__summary-divider" />
        <span className="fs-result__summary-item">
          {r.houseSitting}
        </span>
      </div>

      {/* SVG罗盘 */}
      <div className="compass-svg-wrap">
        <svg className="compass-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* 外圈装饰 */}
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={R + 3} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth="2" />

          {/* 八方扇区 - 可点击 */}
          {r.directions.map((d, i) => {
            const startA = dirAngles[i] - 22.5;
            const endA = dirAngles[i] + 22.5;
            const lucky = d.lucky;
            const isHovered = hoveredSector === i;
            return (
              <path key={i} d={sectorArc(startA, endA, R, Rmid)}
                fill={isHovered
                  ? (lucky ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.22)')
                  : (lucky ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.10)')
                }
                stroke={lucky ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.3)'}
                strokeWidth={isHovered ? '2' : '1'}
                style={{ cursor: 'pointer', transition: 'fill 0.2s, stroke-width 0.2s' }}
                onClick={() => scrollToDirection(d.direction)}
                onMouseEnter={() => setHoveredSector(i)}
                onMouseLeave={() => setHoveredSector(null)}
                onTouchStart={() => setHoveredSector(i)}
                onTouchEnd={() => setHoveredSector(null)} />
            );
          })}

          {/* 内圈 */}
          <circle cx={cx} cy={cy} r={Rmid} fill="none" stroke="rgba(212,168,83,0.35)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={Rinner} fill="none" stroke="rgba(212,168,83,0.25)" strokeWidth="1" />

          {/* 分隔线 */}
          {dirAngles.map((a, i) => {
            const toRad = (d: number) => (d - 90) * Math.PI / 180;
            const x1 = cx + Rmid * Math.cos(toRad(a - 22.5));
            const y1 = cy + Rmid * Math.sin(toRad(a - 22.5));
            const x2 = cx + R * Math.cos(toRad(a - 22.5));
            const y2 = cy + R * Math.sin(toRad(a - 22.5));
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,168,83,0.3)" strokeWidth="0.8" />;
          })}

          {/* 卦象符号 + 方位名 + 游星 */}
          {r.directions.map((d, i) => {
            const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
            const angle = dirAngles[i];
            const rLabel = (R + Rmid) / 2;
            const rTri = (Rmid + Rinner) / 2;
            const lx = cx + rLabel * Math.cos(toRad(angle));
            const ly = cy + rLabel * Math.sin(toRad(angle));
            const tx = cx + rTri * Math.cos(toRad(angle));
            const ty = cy + rTri * Math.sin(toRad(angle));
            const lucky = d.lucky;
            return (
              <g key={`label-${i}`}>
                {/* 卦象 */}
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(212,168,83,0.7)" fontSize="16" fontFamily="serif">
                  {TRIGRAM_SYMBOLS[d.direction] || ''}
                </text>
                {/* 方位名 */}
                <text x={lx} y={ly - 7} textAnchor="middle" dominantBaseline="central"
                  fill={lucky ? '#6ecf8a' : '#e8706f'} fontSize="13" fontWeight="600"
                  fontFamily="'STKaiti','KaiTi',serif" letterSpacing="1">
                  {d.direction}
                </text>
                {/* 游星 */}
                <text x={lx} y={ly + 8} textAnchor="middle" dominantBaseline="central"
                  fill={lucky ? 'rgba(110,207,138,0.8)' : 'rgba(232,112,111,0.8)'} fontSize="10">
                  {d.youXing}
                </text>
              </g>
            );
          })}

          {/* 中心命卦 */}
          <circle cx={cx} cy={cy} r={Rinner - 8} fill="rgba(212,168,83,0.1)" stroke="rgba(212,168,83,0.6)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={Rinner - 18} fill="rgba(212,168,83,0.08)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
          <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="central"
            fill="#d4a853" fontSize="24" fontWeight="bold" fontFamily="'STKaiti','KaiTi',serif">
            {r.mingGua}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central"
            fill="rgba(212,168,83,0.6)" fontSize="10" letterSpacing="2">
            命卦
          </text>

          {/* 朝向标记 */}
          {(() => {
            const dirMap: Record<string, number> = { '东': 0, '东南': 45, '南': 90, '西南': 135, '西': 180, '西北': 225, '北': 270, '东北': 315 };
            const facingAngle = dirMap[r.houseFacing];
            if (facingAngle === undefined) return null;
            const toRad = (d: number) => (d - 90) * Math.PI / 180;
            const aRad = toRad(facingAngle);
            const tipR = R + 14;
            const baseR = R + 6;
            const tx = cx + tipR * Math.cos(aRad);
            const ty = cy + tipR * Math.sin(aRad);
            const bx1 = cx + baseR * Math.cos(aRad - 0.15);
            const by1 = cy + baseR * Math.sin(aRad - 0.15);
            const bx2 = cx + baseR * Math.cos(aRad + 0.15);
            const by2 = cy + baseR * Math.sin(aRad + 0.15);
            return (
              <g>
                <polygon points={`${tx},${ty} ${bx1},${by1} ${bx2},${by2}`}
                  fill="#d4a853" opacity="0.8" />
                <text x={cx + (R + 22) * Math.cos(aRad)} y={cy + (R + 22) * Math.sin(aRad)}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#d4a853" fontSize="8" fontWeight="bold" letterSpacing="1">
                  朝
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* 命卦详解 */}
      <div className="fs-result__section">
        <h3 className="fs-result__section-title">命卦详解</h3>
        <div className="fs-mingua-detail">
          <div className="fs-mingua-detail__icon">{r.mingGua}</div>
          <p className="fs-mingua-detail__text">{r.mingGuaDesc}</p>
        </div>
      </div>

      {/* 宅命匹配 */}
      <div className="fs-result__section">
        <h3 className="fs-result__section-title">宅命匹配</h3>
        <div className={`fs-compat ${r.houseCompatibility.match ? 'fs-compat--match' : 'fs-compat--mismatch'}`}>
          <div className="fs-compat__badge">
            {r.houseCompatibility.match ? '宅命相配' : '宅命不配'}
          </div>
          <p className="fs-compat__analysis">{r.houseCompatibility.analysis}</p>
          {!r.houseCompatibility.match && (
            <div className="fs-compat__remedy">
              <span className="fs-compat__remedy-label">化解之法</span>
              <p>{r.houseCompatibility.remedy}</p>
            </div>
          )}
        </div>
      </div>

      {/* 四吉方 */}
      <div className="fs-result__section">
        <h3 className="fs-result__section-title">四吉方</h3>
        <div className="fs-result__grid">
          {luckyDirs.map((d, i) => {
            const detail = r.directionDetails.find(dd => dd.direction === d.direction);
            return (
              <div key={i} id={`fs-dir-${d.direction}`} className="fs-result__card fs-result__card--lucky" style={{ animation: `fadeInUp 0.4s ease ${i*0.1}s both` }}>
                <div className="fs-result__card-header">
                  <span className="fs-result__card-dir">{TRIGRAM_SYMBOLS[d.direction]} {d.direction}方</span>
                  <span className="fs-result__card-star tag tag-gold">{d.youXing}</span>
                </div>
                <p className="fs-result__card-desc">{d.suggestion}</p>
                {detail && (
                  <div className="fs-result__card-detail">
                    <p className="fs-result__card-detail-text">{detail.detail}</p>
                    <div className="fs-result__card-meta">
                      <span className="fs-result__card-meta-item">{detail.colors}</span>
                      <span className="fs-result__card-meta-item">{detail.elements}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 四凶方 */}
      <div className="fs-result__section">
        <h3 className="fs-result__section-title">四凶方</h3>
        <div className="fs-result__grid">
          {unluckyDirs.map((d, i) => {
            const detail = r.directionDetails.find(dd => dd.direction === d.direction);
            const cure = r.cures.find(c => c.direction === d.direction);
            return (
              <div key={i} id={`fs-dir-${d.direction}`} className="fs-result__card fs-result__card--unlucky" style={{ animation: `fadeInUp 0.4s ease ${i*0.1}s both` }}>
                <div className="fs-result__card-header">
                  <span className="fs-result__card-dir">{TRIGRAM_SYMBOLS[d.direction]} {d.direction}方</span>
                  <span className="fs-result__card-star tag tag-vermillion">{d.youXing}</span>
                </div>
                <p className="fs-result__card-desc">{d.suggestion}</p>
                {detail && (
                  <div className="fs-result__card-detail">
                    <p className="fs-result__card-detail-text">{detail.detail}</p>
                    <div className="fs-result__card-meta">
                      <span className="fs-result__card-meta-item">{detail.colors}</span>
                      <span className="fs-result__card-meta-item">{detail.elements}</span>
                    </div>
                  </div>
                )}
                {cure && (
                  <div className="fs-result__card-cure">
                    <span className="fs-result__card-cure-label">化解建议</span>
                    <p>{cure.cure}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 总体风水建议 */}
      <div className="fs-result__section">
        <h3 className="fs-result__section-title">总体风水建议</h3>
        <div className="fs-result__tips">
          {(() => {
            const isEastGroup = r.group === '东四命';
            const tips = isEastGroup ? [
              { icon: '🏠', title: '卧室方位', text: '主卧宜选东、南、北、东南方，床头朝向吉方可增强睡眠质量和整体运势。' },
              { icon: '🪑', title: '书桌摆放', text: '书桌宜面向东方或东南方，利于思维活跃和学业进步。避免背对门窗。' },
              { icon: '🚪', title: '大门朝向', text: '大门朝东或东南为最佳，可纳入生旺之气。若朝向不佳，可在门口放置绿色植物化解。' },
              { icon: '🎨', title: '色彩搭配', text: '主色调宜用绿色、蓝色、红色等东四命吉色。避免大面积使用白色和金色。' },
              { icon: '🌿', title: '植物摆放', text: '客厅东方位摆放高大阔叶植物，可催旺生气。避免在卧室放带刺植物。' },
            ] : [
              { icon: '🏠', title: '卧室方位', text: '主卧宜选西、西北、西南、东北方，床头朝向吉方可增强安全感和稳定性。' },
              { icon: '🪑', title: '书桌摆放', text: '书桌宜面向西方或西北方，利于决策力和事业运。书桌后方宜有靠墙。' },
              { icon: '🚪', title: '大门朝向', text: '大门朝西或西北为最佳，可收纳金气。若朝向不佳，可在门口放置金属摆件化解。' },
              { icon: '🎨', title: '色彩搭配', text: '主色调宜用白色、金色、黄色等西四命吉色。避免大面积使用红色和绿色。' },
              { icon: '🔔', title: '金属摆件', text: '客厅西方位摆放铜器或金属风铃，可催旺金气。避免在凶方放置水景。' },
            ];
            return tips.map((tip, i) => (
              <div key={i} className="fs-result__tip-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                <span className="fs-result__tip-icon">{tip.icon}</span>
                <div>
                  <h4 className="fs-result__tip-title">{tip.title}</h4>
                  <p className="fs-result__tip-text">{tip.text}</p>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* 流年飞星 */}
      {(() => {
        const currentYear = new Date().getFullYear();
        const annual = getAnnualStars(currentYear);
        return (
          <div className="fs-result__section">
            <h3 className="fs-result__section-title">{currentYear}{annual.ganZhi}年 · 流年飞星</h3>
            <p className="fs-result__annual-desc">{annual.centerSummary}。注意五黄煞位须化解。</p>
            <div className="fs-result__annual-grid">
              {annual.stars.map((s, i) => (
                <div key={s.direction} className={`fs-result__annual-card ${s.lucky ? 'fs-result__annual-card--lucky' : 'fs-result__annual-card--unlucky'} ${s.direction === '中宫' ? 'fs-result__annual-card--center' : ''}`} style={{ animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
                  <div className="fs-result__annual-head">
                    <span className="fs-result__annual-dir">{s.direction}</span>
                    <span className="fs-result__annual-star" style={{ color: s.color }}>★{s.star}</span>
                  </div>
                  <p className="fs-result__annual-name" style={{ color: s.color }}>{s.name}</p>
                  <p className="fs-result__annual-effect">{s.effect}</p>
                  <div className="fs-result__annual-remedy">
                    <span className="fs-result__annual-remedy-label">{s.lucky ? '催旺' : '化解'}</span>
                    <p>{s.remedy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="page-form__actions">
        <button className="btn-secondary" onClick={onReset}>重新测算</button>
        <ShareButton targetRef={resultRef} fileName={`风水分析_${Date.now()}.png`} />
      </div>
    </div>
  );
};

export default FengshuiPage;
