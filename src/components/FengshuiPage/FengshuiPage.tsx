import React, { useState } from 'react';
import type { FengshuiResult } from '../../types';
import { calculateFengshui } from '../../utils/fengshuiCalc';
import { SITTING_OPTIONS } from '../../data/fengshui';
import './FengshuiPage.css';

const TRIGRAM_SYMBOLS: Record<string, string> = {
  '东': '☳', '东南': '☴', '南': '☲', '西南': '☷',
  '西': '☱', '西北': '☰', '北': '☵', '东北': '☶',
};

const FengshuiPage: React.FC = () => {
  const [year, setYear] = useState(1990);
  const [gender, setGender] = useState<'男'|'女'>('男');
  const [sitting, setSitting] = useState(SITTING_OPTIONS[0]);
  const [result, setResult] = useState<FengshuiResult | null>(null);

  if (result) return <FengshuiResultView result={result} onReset={() => setResult(null)} />;

  return (
    <div className="page-form">
      <p className="page-form__intro-fs">八宅明镜法 · 定命卦 · 明八方吉凶</p>
      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">出生年份</label>
          <input className="page-form__input" type="number" min={1924} max={2003} value={year} onChange={e => setYear(+e.target.value)} />
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
  const luckyDirs = r.directions.filter(d => d.lucky);
  const unluckyDirs = r.directions.filter(d => !d.lucky);
  const cx = 150, cy = 150, R = 130, Rmid = 95, Rinner = 55;

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
    <div className="page-result fengshui-result">
      <h2 className="fs-result__title">八宅风水分析</h2>
      <div className="fs-result__mingua">
        <span className="tag tag-gold">{r.group}</span>
        <span className="fs-result__gua-name">命卦：{r.mingGua}卦</span>
        <span className="text-secondary"> · {r.houseSitting}</span>
      </div>

      {/* SVG罗盘 */}
      <div className="compass-svg-wrap">
        <svg className="compass-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {/* 外圈装饰 */}
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={R + 3} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth="2" />

          {/* 八方扇区 */}
          {r.directions.map((d, i) => {
            const startA = dirAngles[i] - 22.5;
            const endA = dirAngles[i] + 22.5;
            const lucky = d.lucky;
            return (
              <path key={i} d={sectorArc(startA, endA, R, Rmid)}
                fill={lucky ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.10)'}
                stroke={lucky ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.3)'}
                strokeWidth="1" />
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
              <div key={i} className="fs-result__card fs-result__card--lucky" style={{ animation: `fadeInUp 0.4s ease ${i*0.1}s both` }}>
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
              <div key={i} className="fs-result__card fs-result__card--unlucky" style={{ animation: `fadeInUp 0.4s ease ${i*0.1}s both` }}>
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

      <div className="page-form__actions"><button className="btn-secondary" onClick={onReset}>重新测算</button></div>
    </div>
  );
};

export default FengshuiPage;
