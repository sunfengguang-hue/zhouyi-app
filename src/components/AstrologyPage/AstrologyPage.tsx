import React, { useState } from 'react';
import type { AstrologyResult } from '../../types';
import { calcAstrology } from '../../utils/astrologyCalc';
import './AstrologyPage.css';

const AstrologyPage: React.FC = () => {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [result, setResult] = useState<AstrologyResult | null>(null);

  if (result) return <AstrologyResultView result={result} onReset={() => setResult(null)} />;

  return (
    <div className="page-form">
      <p className="astro-intro">输入出生月日，查星座性格与今日运势</p>
      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">月份</label>
          <select className="page-form__select" value={month} onChange={e=>setMonth(+e.target.value)}>
            {Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}月</option>)}
          </select>
        </div>
        <div className="page-form__group">
          <label className="page-form__label">日期</label>
          <select className="page-form__select" value={day} onChange={e=>setDay(+e.target.value)}>
            {Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}日</option>)}
          </select>
        </div>
      </div>
      <div className="page-form__actions">
        <button className="btn-primary" onClick={()=>setResult(calcAstrology(month, day))}>查看运势</button>
      </div>
    </div>
  );
};

const elementColors: Record<string, string> = { '火': '#e74c3c', '土': '#e67e22', '风': '#9b59b6', '水': '#3498db' };
const starLabels = ['☆☆☆☆☆','★☆☆☆☆','★★☆☆☆','★★★☆☆','★★★★☆','★★★★★'];

const AstrologyResultView: React.FC<{ result: AstrologyResult; onReset: () => void }> = ({ result, onReset }) => {
  const r = result;
  const s = r.sign;
  const ec = elementColors[s.element];

  const fortuneItems = [
    { label: '事业', val: r.todayFortune.career, icon: '💼' },
    { label: '爱情', val: r.todayFortune.love, icon: '❤️' },
    { label: '财运', val: r.todayFortune.wealth, icon: '💰' },
    { label: '健康', val: r.todayFortune.health, icon: '🏥' },
  ];

  return (
    <div className="page-result astro-result">
      {/* 星座头部 */}
      <div className="astro-header">
        <div className="astro-symbol" style={{ color: ec, borderColor: ec }}>{s.symbol}</div>
        <h2 className="astro-name">{s.name}</h2>
        <p className="astro-range">{s.dateRange} · {s.element}象星座 · 守护星{s.ruler}</p>
      </div>

      {/* 性格特质 */}
      <div className="astro-section">
        <h3 className="astro-section__title">性格特质</h3>
        <div className="astro-traits">
          {s.traits.map((t, i) => (
            <span key={i} className="tag tag-gold astro-trait">{t}</span>
          ))}
        </div>
      </div>

      {/* 今日运势 */}
      <div className="astro-section">
        <h3 className="astro-section__title">今日运势</h3>
        <p className="astro-summary text-gold">{r.todayFortune.summary}</p>
        <div className="astro-fortune-grid">
          {fortuneItems.map(f => (
            <div key={f.label} className="astro-fortune-item">
              <span className="astro-fortune__icon">{f.icon}</span>
              <span className="astro-fortune__label">{f.label}</span>
              <span className="astro-fortune__stars" style={{color: ec}}>{starLabels[f.val]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 运势详情 */}
      <div className="astro-section">
        <h3 className="astro-section__title">运势详解</h3>
        <div className="astro-detail">
          <div className="astro-detail__item"><span className="astro-detail__icon">💼</span><p>{s.career}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">❤️</span><p>{s.love}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">💰</span><p>{s.wealth}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">🏥</span><p>{s.health}</p></div>
        </div>
      </div>

      {/* 幸运元素 */}
      <div className="astro-section">
        <h3 className="astro-section__title">幸运元素</h3>
        <div className="astro-lucky">
          <span className="tag tag-gold">幸运色：{s.luckyColor}</span>
          <span className="tag tag-gold">幸运数字：{s.luckyNumber}</span>
        </div>
      </div>

      {/* 配对 */}
      <div className="astro-section">
        <h3 className="astro-section__title">星座配对</h3>
        <div className="astro-compat">
          {r.compatibleSigns.map((c, i) => (
            <div key={i} className="astro-compat__item">
              <span className="astro-compat__name">{c.sign}</span>
              <div className="astro-compat__bar">
                <div className="astro-compat__fill" style={{ width: `${c.score}%`, background: ec }} />
              </div>
              <span className="astro-compat__score">{c.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="page-form__actions">
        <button className="btn-secondary" onClick={onReset}>重新查询</button>
      </div>
    </div>
  );
};

export default AstrologyPage;
