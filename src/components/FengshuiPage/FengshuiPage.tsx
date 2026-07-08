import React, { useState } from 'react';
import type { FengshuiResult } from '../../types';
import { calculateFengshui } from '../../utils/fengshuiCalc';
import { SITTING_OPTIONS } from '../../data/fengshui';
import './FengshuiPage.css';

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

  return (
    <div className="page-result fengshui-result">
      <h2 className="fs-result__title">八宅风水分析</h2>
      <div className="fs-result__mingua">
        <span className="tag tag-gold">{r.group}</span>
        <span className="fs-result__gua-name">命卦：{r.mingGua}卦</span>
        <span className="text-secondary"> · {r.houseSitting}</span>
      </div>

      {/* 罗盘 */}
      <div className="compass">
        <div className="compass__ring compass__ring--outer">
          {r.directions.map((d, i) => {
            const angle = i * 45 - 90;
            return (
              <div key={i} className={`compass__dir ${d.lucky ? 'compass__dir--lucky' : 'compass__dir--unlucky'}`}
                style={{ transform: `rotate(${angle}deg) translateY(-120px)` }}>
                <span className="compass__dir-name">{d.direction}</span>
                <span className="compass__dir-star">{d.youXing}</span>
              </div>
            );
          })}
        </div>
        <div className="compass__center">
          <span>{r.mingGua}</span>
        </div>
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
                  <span className="fs-result__card-dir">{d.direction}方</span>
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
                  <span className="fs-result__card-dir">{d.direction}方</span>
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
