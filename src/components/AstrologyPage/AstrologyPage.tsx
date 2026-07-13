import React, { useState, useRef } from 'react';
import type { AstrologyResult } from '../../types';
import { calcAstrology } from '../../utils/astrologyCalc';
import ShareButton from '../ShareButton/ShareButton';
import './AstrologyPage.css';

const AstrologyPage: React.FC = () => {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AstrologyResult | null>(null);

  const daysInMonth = new Date(2024, month, 0).getDate(); // 2024 is leap year
  const handleMonthChange = (m: number) => {
    setMonth(m);
    const maxDay = new Date(2024, m, 0).getDate();
    if (day > maxDay) setDay(maxDay);
  };

  const handleQuery = () => {
    if (day > daysInMonth) {
      setError(`${month}月最多${daysInMonth}天`);
      return;
    }
    setError('');
    setResult(calcAstrology(month, day));
  };

  if (result) return <AstrologyResultView result={result} onReset={() => setResult(null)} />;

  return (
    <div className="page-form">
      <p className="astro-intro">西洋占星术 · 十二星座性格解析 · 每日运势预测 · 本周运势前瞻</p>
      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">月份</label>
          <select className="page-form__select" value={month} onChange={e=>handleMonthChange(+e.target.value)}>
            {Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}月</option>)}
          </select>
        </div>
        <div className="page-form__group">
          <label className="page-form__label">日期</label>
          <select className="page-form__select" value={day} onChange={e=>setDay(+e.target.value)}>
            {Array.from({length:daysInMonth},(_,i)=><option key={i} value={i+1}>{i+1}日</option>)}
          </select>
        </div>
      </div>
      {error && <p style={{color:'#e74c3c',textAlign:'center',margin:'8px 0',fontSize:'13px'}}>{error}</p>}
      <div className="page-form__actions">
        <button className="btn-primary" onClick={handleQuery}>查看运势</button>
      </div>
    </div>
  );
};

const elementColors: Record<string, string> = { '火': '#e74c3c', '土': '#e67e22', '风': '#9b59b6', '水': '#3498db' };
const elementIcons: Record<string, string> = { '火': '🔥', '土': '🌍', '风': '🌬️', '水': '💧' };
const elementDescs: Record<string, string> = {
  '火': '热情奔放，行动力强，勇于开拓',
  '土': '稳重踏实，务实可靠，注重品质',
  '风': '思维敏捷，善于沟通，灵活多变',
  '水': '情感丰富，直觉敏锐，温柔细腻',
};
// 元素互动描述：key=我方元素+对方元素
const elementInteractions: Record<string, { relation: string; score: number; desc: string; advice: string }> = {
  '火火': { relation: '同元素·共鸣', score: 90, desc: '双火相遇，热情加倍，彼此激励，活力四射', advice: '共同目标是最佳合作方式，但注意避免争强好胜' },
  '火土': { relation: '相生·互补', score: 75, desc: '火温暖土，土承载火，相互扶持的稳固关系', advice: '你的热情能激发对方的潜力，耐心倾听更有收获' },
  '火风': { relation: '相生·助力', score: 85, desc: '风助火势，火借风威，思维与行动的完美搭档', advice: '对方的智慧是你最好的参谋，合作事半功倍' },
  '火水': { relation: '相克·挑战', score: 45, desc: '水火不容，性格差异大，但也可能互补成长', advice: '学会理解对方的节奏，差异中也能发现独特的魅力' },
  '土火': { relation: '相生·包容', score: 75, desc: '土承载火的热情，为对方提供稳固的后方', advice: '你的稳重是对方的港湾，但偶尔也要表达热情' },
  '土土': { relation: '同元素·共鸣', score: 90, desc: '双土相遇，稳固加倍，共同营造安定的世界', advice: '价值观高度一致，但注意避免过于保守而错失机会' },
  '土风': { relation: '相克·磨合', score: 45, desc: '风吹土散，理念差异较大，需要更多理解和包容', advice: '接纳对方的不同，你的踏实能给对方安全感' },
  '土水': { relation: '相生·滋养', score: 85, desc: '水润土生，情感滋养物质，物质守护情感', advice: '对方的感性丰富你的世界，给予情感回应很重要' },
  '风火': { relation: '相生·催化', score: 85, desc: '风助火势，你的思维为对方的行动提供方向', advice: '你的创意加上对方的执行力，是无坚不摧的组合' },
  '风土': { relation: '相克·碰撞', score: 45, desc: '思维方式和处事节奏不同，容易产生分歧', advice: '学会欣赏对方的务实，你的灵活也能为对方打开新视野' },
  '风风': { relation: '同元素·共鸣', score: 90, desc: '双风相遇，思想碰撞不断，沟通无障碍', advice: '灵感火花四溅，但也要落地执行，光想不做等于零' },
  '风水': { relation: '相生·交融', score: 75, desc: '风吹水动，理性与感性的交汇，互补性极强', advice: '你的理性帮对方理清思路，对方的感性丰富你的体验' },
  '水火': { relation: '相克·冲突', score: 45, desc: '水火相遇，情感与激情的碰撞，充满张力', advice: '你的细腻能柔化对方的冲动，但不要被对方的节奏带偏' },
  '水土': { relation: '相生·润泽', score: 85, desc: '水润大地，你的情感滋养对方的物质世界', advice: '你的温柔让对方感受到爱，而对方的踏实给你安全感' },
  '水风': { relation: '相生·启发', score: 75, desc: '水随风动，你的直觉启发对方的思维', advice: '深度交流是你们之间最珍贵的连接方式' },
  '水水': { relation: '同元素·共鸣', score: 90, desc: '双水相遇，情感深度加倍，心灵相通', advice: '默契十足但也容易陷入情绪漩涡，保持阳光心态' },
};
const starLabels = ['☆☆☆☆☆','★☆☆☆☆','★★☆☆☆','★★★☆☆','★★★★☆','★★★★★'];

const weeklyIcons: Record<string, string> = {
  overall: '🌟',
  career: '💼',
  love: '❤️',
  wealth: '💰',
  advice: '💡',
};

const weeklyLabels: Record<string, string> = {
  overall: '总体运势',
  career: '事业运',
  love: '感情运',
  wealth: '财运',
  advice: '本周建议',
};

const AstrologyResultView: React.FC<{ result: AstrologyResult; onReset: () => void }> = ({ result, onReset }) => {
  const r = result;
  const s = r.sign;
  const ec = elementColors[s.element];
  const resultRef = useRef<HTMLDivElement>(null);

  const fortuneItems = [
    { label: '事业', val: r.todayFortune.career, icon: '💼' },
    { label: '爱情', val: r.todayFortune.love, icon: '❤️' },
    { label: '财运', val: r.todayFortune.wealth, icon: '💰' },
    { label: '健康', val: r.todayFortune.health, icon: '🏥' },
  ];

  const weeklyKeys = ['overall', 'career', 'love', 'wealth', 'advice'] as const;

  return (
    <div ref={resultRef} className="page-result astro-result">
      {/* 星座头部 */}
      <div className="astro-header" style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>
        <div className="astro-symbol" style={{ color: ec, borderColor: ec }}>{s.symbol}</div>
        <h2 className="astro-name">{s.name}</h2>
        <p className="astro-range">{s.dateRange} · {s.element}象星座 · 守护星{s.ruler}</p>
      </div>

      {/* 性格详解 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
        <h3 className="astro-section__title">性格详解</h3>
        <p className="astro-personality__text">{s.personality}</p>
        <div className="astro-strength-weakness">
          <div className="astro-sw-group">
            <h4 className="astro-sw-label astro-strength__label">优点</h4>
            <div className="astro-sw-tags">
              {s.strength.map((t, i) => (
                <span key={i} className="tag astro-strength">{t}</span>
              ))}
            </div>
          </div>
          <div className="astro-sw-group">
            <h4 className="astro-sw-label astro-weakness__label">缺点</h4>
            <div className="astro-sw-tags">
              {s.weakness.map((t, i) => (
                <span key={i} className="tag astro-weakness">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 性格特质 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
        <h3 className="astro-section__title">性格特质</h3>
        <div className="astro-traits">
          {s.traits.map((t, i) => (
            <span key={i} className="tag tag-gold astro-trait">{t}</span>
          ))}
        </div>
      </div>

      {/* 今日运势 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.4s both' }}>
        <h3 className="astro-section__title">今日运势</h3>
        <p className="astro-summary text-gold">{r.todayFortune.summary}</p>
        <div className="astro-fortune-grid">
          {fortuneItems.map((f, i) => (
            <div key={f.label} className="astro-fortune-item" style={{ animation: `fadeInUp 0.4s ease ${0.4 + i * 0.1}s both` }}>
              <span className="astro-fortune__icon">{f.icon}</span>
              <span className="astro-fortune__label">{f.label}</span>
              <span className="astro-fortune__stars" style={{color: ec}}>{starLabels[f.val]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 本周运势 */}
      <div className="astro-section astro-weekly-section" style={{ animation: 'fadeInUp 0.5s ease 0.5s both' }}>
        <h3 className="astro-section__title">本周运势</h3>
        <div className="astro-weekly">
          {weeklyKeys.map(key => (
            <div key={key} className="astro-weekly__item">
              <div className="astro-weekly__header">
                <span className="astro-weekly__icon">{weeklyIcons[key]}</span>
                <span className="astro-weekly__label">{weeklyLabels[key]}</span>
              </div>
              <p className="astro-weekly__text">{r.weeklyFortune[key]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 运势详情 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.6s both' }}>
        <h3 className="astro-section__title">运势详解</h3>
        <div className="astro-detail">
          <div className="astro-detail__item"><span className="astro-detail__icon">💼</span><p>{s.career}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">❤️</span><p>{s.love}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">💰</span><p>{s.wealth}</p></div>
          <div className="astro-detail__item"><span className="astro-detail__icon">🏥</span><p>{s.health}</p></div>
        </div>
      </div>

      {/* 幸运元素 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.7s both' }}>
        <h3 className="astro-section__title">幸运元素</h3>
        <div className="astro-lucky">
          <span className="tag tag-gold">幸运色：{s.luckyColor}</span>
          <span className="tag tag-gold">幸运数字：{s.luckyNumber}</span>
        </div>
      </div>

      {/* 配对 */}
      <div className="astro-section" style={{ animation: 'fadeInUp 0.5s ease 0.8s both' }}>
        <h3 className="astro-section__title">星座配对</h3>
        <div className="astro-compat">
          {r.compatibleSigns.map((c, i) => (
            <div key={i} className="astro-compat__item" style={{ animation: `fadeInUp 0.4s ease ${0.8 + i * 0.1}s both` }}>
              <span className="astro-compat__name">{c.sign}</span>
              <div className="astro-compat__bar">
                <div className="astro-compat__fill" style={{ width: `${c.score}%`, background: ec, transition: `width 0.8s ease ${0.9 + i * 0.15}s` }} />
              </div>
              <span className="astro-compat__score">{c.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 最佳配对 */}
      <div className="astro-section astro-bestmatch-section" style={{ animation: 'fadeInUp 0.5s ease 0.9s both' }}>
        <h3 className="astro-section__title">最佳配对</h3>
        <div className="astro-bestmatch">
          <div className="astro-bestmatch__header">
            <span className="astro-bestmatch__symbol">{s.symbol}</span>
            <span className="astro-bestmatch__heart">💕</span>
            <span className="astro-bestmatch__match-name">{s.bestMatch}</span>
          </div>
          <p className="astro-bestmatch__desc">{s.bestMatchDesc}</p>
        </div>
      </div>

      {/* 元素相性分析 */}
      <div className="astro-section astro-element-section" style={{ animation: 'fadeInUp 0.5s ease 0.95s both' }}>
        <h3 className="astro-section__title">元素相性分析</h3>
        <p className="astro-element__intro">你的元素属性：<span style={{ color: ec, fontWeight: 600 }}>{elementIcons[s.element]} {s.element}象</span> · {elementDescs[s.element]}</p>
        <div className="astro-element__grid">
          {(['火', '土', '风', '水'] as const).map((el, i) => {
            const key = s.element + el;
            const interaction = elementInteractions[key];
            const isSelf = s.element === el;
            const scoreColor = interaction.score >= 85 ? '#2ecc71' : interaction.score >= 70 ? '#f39c12' : '#e74c3c';
            return (
              <div key={el} className={`astro-element__card ${isSelf ? 'astro-element__card--self' : ''}`} style={{ animation: `fadeInUp 0.4s ease ${1 + i * 0.1}s both` }}>
                <div className="astro-element__head">
                  <span className="astro-element__icon" style={{ color: elementColors[el] }}>{elementIcons[el]}</span>
                  <span className="astro-element__name" style={{ color: elementColors[el] }}>{el}象</span>
                  <span className="astro-element__relation" style={{ color: scoreColor }}>{interaction.relation}</span>
                </div>
                <div className="astro-element__bar-wrap">
                  <div className="astro-element__bar">
                    <div className="astro-element__bar-fill" style={{ width: `${interaction.score}%`, background: `linear-gradient(90deg, ${elementColors[s.element]}, ${elementColors[el]})`, transition: `width 0.8s ease ${1.1 + i * 0.15}s` }} />
                  </div>
                  <span className="astro-element__score" style={{ color: scoreColor }}>{interaction.score}分</span>
                </div>
                <p className="astro-element__desc">{interaction.desc}</p>
                <p className="astro-element__advice">{interaction.advice}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="page-form__actions">
        <button className="btn-secondary" onClick={onReset}>重新查询</button>
        <ShareButton targetRef={resultRef} fileName={`星座运势_${s.name}_${Date.now()}.png`} />
      </div>
    </div>
  );
};

export default AstrologyPage;
