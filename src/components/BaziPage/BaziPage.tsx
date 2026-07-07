import React, { useState } from 'react';
import type { BaziResult } from '../../types';
import { calculateBazi } from '../../utils/baziCalc';
import { SHISHEN_DESC, DAY_MASTER_PERSONALITY } from '../../data/bazi';
import './BaziPage.css';

const BaziPage: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [result, setResult] = useState<BaziResult | null>(null);

  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (year < 1900 || year > 2100) { setError('请输入1900-2100之间的年份'); return; }
    if (month < 1 || month > 12) { setError('月份须在1-12之间'); return; }
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) { setError(`${year}年${month}月的日期范围为1-${daysInMonth}`); return; }
    setError('');
    const res = calculateBazi(year, month, day, hour, 0, gender, 116.4);
    setResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => setResult(null);

  if (result) return <BaziResultView result={result} onReset={handleReset} />;

  return (
    <div className="page-form bazi-form">
      <p className="bazi-form__intro">输入出生时间，排四柱八字，析五行十神</p>

      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">出生年</label>
          <input className="page-form__input" type="number" min={1900} max={2100} value={year} onChange={e => setYear(+e.target.value)} />
        </div>
        <div className="page-form__group">
          <label className="page-form__label">月</label>
          <input className="page-form__input" type="number" min={1} max={12} value={month} onChange={e => setMonth(+e.target.value)} />
        </div>
        <div className="page-form__group">
          <label className="page-form__label">日</label>
          <input className="page-form__input" type="number" min={1} max={31} value={day} onChange={e => setDay(+e.target.value)} />
        </div>
      </div>

      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">时辰</label>
          <select className="page-form__select" value={hour} onChange={e => setHour(+e.target.value)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}时</option>
            ))}
          </select>
        </div>
        <div className="page-form__group">
          <label className="page-form__label">性别</label>
          <select className="page-form__select" value={gender} onChange={e => setGender(e.target.value as '男' | '女')}>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
      </div>

      {error && <p className="page-form__error" style={{color:'#e74c3c',textAlign:'center',margin:'8px 0'}}>{error}</p>}

      <div className="page-form__actions">
        <button className="btn-primary" onClick={handleSubmit}>排盘测算</button>
      </div>
    </div>
  );
};

/** 结果展示 */
const BaziResultView: React.FC<{ result: BaziResult; onReset: () => void }> = ({ result, onReset }) => {
  const r = result;
  const pillars = [r.year, r.month, r.day, r.hour];
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const wxNames = ['金', '木', '水', '火', '土'] as const;
  const wxTotal = Object.values(r.wuxingCount).reduce((a, b) => a + b, 0);

  const strengthColors: Record<string, string> = {
    '旺': '#e74c3c', '偏旺': '#e67e22', '中和': '#f1c40f',
    '偏弱': '#3498db', '弱': '#2ecc71',
  };

  const wxColors: Record<string, string> = {
    '金': '#f1c40f', '木': '#2ecc71', '水': '#3498db', '火': '#e74c3c', '土': '#e67e22',
  };

  // Deduplicate shiShenDetails by name+position for display
  const uniqueShiShen = r.shiShenDetails.reduce((acc, item) => {
    const key = `${item.position}-${item.name}`;
    if (!acc.find(a => `${a.position}-${a.name}` === key)) acc.push(item);
    return acc;
  }, [] as typeof r.shiShenDetails);

  return (
    <div className="page-result bazi-result">
      <h2 className="bazi-result__title">四柱八字排盘</h2>
      <p className="bazi-result__time">{r.input.gender}命 · {r.solarTime}</p>

      {/* 四柱表 */}
      <div className="bazi-result__pillars">
        {pillars.map((p, i) => (
          <div key={i} className="bazi-pillar" style={{ animation: `fadeInUp 0.4s ease ${i * 0.12}s both` }}>
            <span className="bazi-pillar__name">{pillarNames[i]}</span>
            <div className="bazi-pillar__gan">{p.gan}</div>
            <span className="bazi-pillar__ss">{p.ganSS}</span>
            <div className="bazi-pillar__zhi">{p.zhi}</div>
            <span className="bazi-pillar__ss">{p.zhiSS}</span>
            <div className="bazi-pillar__cang">
              {p.zhiCangGan.map((c, j) => (
                <span key={j} className="bazi-pillar__cang-item">
                  {c.gan}({c.ss})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 日主信息 */}
      <div className="bazi-result__info">
        <div className="bazi-result__info-card">
          <h4>日主</h4>
          <span className="bazi-result__day-master">{r.dayMaster}</span>
          <span className="bazi-result__day-wx">（{r.dayMasterWX}）</span>
        </div>
        <div className="bazi-result__info-card">
          <h4>日主强弱</h4>
          <span style={{ color: strengthColors[r.strength], fontWeight: 'bold' }}>{r.strength}</span>
        </div>
        <div className="bazi-result__info-card">
          <h4>喜用神</h4>
          <span className="text-gold">{r.favorableWX.join('、')}</span>
        </div>
      </div>

      {/* 纳音五行 */}
      <div className="bazi-result__nayin">
        <h3 className="bazi-result__section-title">纳音五行</h3>
        <div className="bazi-nayin__grid">
          {r.nayin.map((item, i) => (
            <div key={i} className="bazi-nayin__item" style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}>
              <span className="bazi-nayin__pillar">{item.pillar}</span>
              <span className="bazi-nayin__value">{item.nayin}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 日主性格分析 */}
      <div className="bazi-result__personality">
        <h3 className="bazi-result__section-title">日主性格分析</h3>
        <div className="bazi-personality__card">
          <div className="bazi-personality__header">
            <span className="bazi-personality__stem">{r.dayMaster}</span>
            <span className="bazi-personality__wx">{r.dayMasterWX}</span>
          </div>
          <div className="bazi-personality__body">
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">性格特质</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.character}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">事业运势</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.career}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">感情婚姻</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.love}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">财运分析</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.wealth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 十神详解 */}
      <div className="bazi-result__shishen">
        <h3 className="bazi-result__section-title">十神详解</h3>
        <div className="bazi-shishen__list">
          {uniqueShiShen.map((item, i) => (
            <div key={i} className="bazi-shishen__item" style={{ animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
              <div className="bazi-shishen__head">
                <span className="bazi-shishen__name">{item.name}</span>
                <span className="bazi-shishen__pos">{item.position}</span>
              </div>
              <p className="bazi-shishen__desc">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 五行分布 */}
      <div className="bazi-result__wuxing">
        <h3 className="bazi-result__section-title">五行分布</h3>
        <div className="bazi-result__wx-bars">
          {wxNames.map(wx => {
            const val = r.wuxingCount[wx];
            const pct = wxTotal > 0 ? Math.round((val / wxTotal) * 100) : 0;
            return (
              <div key={wx} className="bazi-wx-item">
                <span className="bazi-wx-item__label">{wx}</span>
                <div className="bazi-wx-item__bar">
                  <div className="bazi-wx-item__fill" style={{ width: `${Math.max(pct, 4)}%`, background: wxColors[wx] }} />
                </div>
                <span className="bazi-wx-item__val">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 大运流年 */}
      <div className="bazi-result__dayun">
        <h3 className="bazi-result__section-title">大运流年</h3>
        <div className="bazi-dayun__timeline">
          {r.daYun.map((dy, i) => (
            <div key={i} className="bazi-dayun__item" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
              <div className="bazi-dayun__age">{dy.age}-{dy.age + 9}岁</div>
              <div className="bazi-dayun__ganzhi">{dy.ganZhi}</div>
              <div className="bazi-dayun__wx" style={{ color: wxColors[dy.wuxing] || '#ccc' }}>{dy.wuxing}</div>
              <div className="bazi-dayun__year">{dy.year}年</div>
            </div>
          ))}
        </div>
        <div className="bazi-dayun__line" />
      </div>

      {/* 神煞提示 */}
      {r.shenSha.length > 0 && (
        <div className="bazi-result__shensha">
          <h3 className="bazi-result__section-title">神煞</h3>
          {r.shenSha.map((s, i) => (
            <p key={i} className="bazi-result__shensha-item tag tag-gold">{s}</p>
          ))}
        </div>
      )}

      <div className="page-form__actions">
        <button className="btn-secondary" onClick={onReset}>重新测算</button>
      </div>
    </div>
  );
};

export default BaziPage;
