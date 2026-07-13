import React, { useState, useEffect, useRef } from 'react';
import type { TarotResult, TarotSpreadType } from '../../types';
import { drawTarotCards, getOrientationColor } from '../../utils/tarotCalc';
import { ELEMENT_COLORS, ELEMENT_SYMBOLS } from '../../data/tarotCards';
import ShareButton from '../ShareButton/ShareButton';
import './TarotPage.css';

const SPREAD_OPTIONS: { type: TarotSpreadType; label: string; desc: string }[] = [
  { type: 'single', label: '单牌占卜', desc: '一张牌给你今日指引' },
  { type: 'three', label: '时间之流', desc: '过去·现在·未来三牌阵' },
  { type: 'relationship', label: '关系牌阵', desc: '探索两人关系的深层动态' },
];

const SPREAD_GUIDES: Record<TarotSpreadType, { intro: string; positions: { name: string; meaning: string }[]; when: string; tip: string }> = {
  single: {
    intro: '单牌占卜是最简洁的塔罗方式，一张牌即给出当下的核心指引。适合日常快速查看，获取今日的灵感与方向。',
    positions: [{ name: '指引', meaning: '当下最重要的能量与讯息' }],
    when: '每日晨间查看、快速决策参考、心情迷茫时',
    tip: '关注这张牌的核心关键词和正/逆位含义，让它成为你今天的一面镜子。',
  },
  three: {
    intro: '时间之流是最经典的三牌阵，通过过去、现在、未来三个时间节点，展现事物的发展脉络和能量走向。',
    positions: [
      { name: '过去', meaning: '影响当前局面的历史因素与根源' },
      { name: '现在', meaning: '当前面临的核心课题与能量状态' },
      { name: '未来', meaning: '若保持现状，事物发展的可能方向' },
    ],
    when: '想了解事情来龙去脉、分析当前处境、预测发展趋势',
    tip: '重点看三张牌之间的元素互动——相生代表顺畅，相克提示需要注意的转变。',
  },
  relationship: {
    intro: '关系牌阵深入探索两人之间的能量互动，五张牌分别展现双方的内在状态、关系动态和未来发展可能。',
    positions: [
      { name: '你的状态', meaning: '你在这段关系中的内在感受和能量' },
      { name: '对方状态', meaning: '对方在这段关系中的内在感受和能量' },
      { name: '关系本质', meaning: '这段关系的核心能量与本质特征' },
      { name: '挑战', meaning: '当前关系中需要面对的主要课题' },
      { name: '发展方向', meaning: '关系的潜在走向和发展可能' },
    ],
    when: '感情困惑、想深入了解两人关系、评估关系健康度',
    tip: '对比你和对方的牌面元素——相同元素代表共鸣，互补元素代表吸引力，冲突元素则是需要磨合的部分。',
  },
};

// 元素能量分析数据
const ELEMENT_ANALYSIS: Record<string, { label: string; positive: string; negative: string }> = {
  '火': { label: '行动与激情', positive: '充满动力，适合主动出击', negative: '可能过于急躁，需要冷静' },
  '水': { label: '情感与直觉', positive: '感受力强，适合倾听内心', negative: '情绪波动，需要理性平衡' },
  '风': { label: '思维与沟通', positive: '思路清晰，适合交流决策', negative: '过于理性，需要关注感受' },
  '土': { label: '稳定与物质', positive: '基础稳固，适合务实规划', negative: '可能过于保守，需要灵活变通' },
};

const TarotPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState<TarotSpreadType>('three');
  const [result, setResult] = useState<TarotResult | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleDraw = () => {
    setDrawing(true);
    setRevealed([]);
    setTimeout(() => {
      const r = drawTarotCards(spreadType, question);
      setResult(r);
      setDrawing(false);
      // Stagger card reveals: each card flips after a delay
      r.draws.forEach((_, i) => {
        setTimeout(() => {
          setRevealed(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 400 + i * 500);
      });
    }, 1800);
  };

  const handleReset = () => {
    setResult(null);
    setQuestion('');
    setRevealed([]);
  };

  return (
    <div className="page-form tarot-page">
      {!result && !drawing && (
        <>
          <p className="tarot-page__intro">选择牌阵，默念所问，翻开命运之牌</p>

          <div className="page-form__group">
            <label className="page-form__label">牌阵选择</label>
            <div className="tarot-page__spreads">
              {SPREAD_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  className={`tarot-page__spread ${spreadType === opt.type ? 'tarot-page__spread--active' : ''}`}
                  onClick={() => setSpreadType(opt.type)}
                >
                  <span className="tarot-page__spread-label">{opt.label}</span>
                  <span className="tarot-page__spread-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 牌阵说明 */}
          <div className="tarot-page__guide" style={{ animation: 'fadeInUp 0.4s ease' }}>
            <h4 className="tarot-page__guide-title">牌阵说明 · {SPREAD_OPTIONS.find(o => o.type === spreadType)?.label}</h4>
            <p className="tarot-page__guide-intro">{SPREAD_GUIDES[spreadType].intro}</p>
            <div className="tarot-page__guide-positions">
              {SPREAD_GUIDES[spreadType].positions.map((pos, i) => (
                <div key={i} className="tarot-page__guide-pos">
                  <span className="tarot-page__guide-pos-name">第{i + 1}张 · {pos.name}</span>
                  <span className="tarot-page__guide-pos-meaning">{pos.meaning}</span>
                </div>
              ))}
            </div>
            <div className="tarot-page__guide-meta">
              <p><span className="tarot-page__guide-meta-label">适用场景</span>{SPREAD_GUIDES[spreadType].when}</p>
              <p><span className="tarot-page__guide-meta-label">解读技巧</span>{SPREAD_GUIDES[spreadType].tip}</p>
            </div>
          </div>

          <div className="page-form__group">
            <label className="page-form__label">所问之事（可选）</label>
            <input
              className="page-form__input"
              placeholder="如：这段感情走向如何？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="page-form__actions">
            <button className="btn-primary" onClick={handleDraw}>
              🃏 开始翻牌
            </button>
          </div>
        </>
      )}

      {drawing && (
        <div className="tarot-page__drawing">
          <div className="tarot-page__drawing-cards">
            <span style={{ animation: 'tarotWobble 0.6s ease 0s infinite alternate' }}>🂠</span>
            <span style={{ animation: 'tarotWobble 0.6s ease 0.15s infinite alternate' }}>🂠</span>
            <span style={{ animation: 'tarotWobble 0.6s ease 0.3s infinite alternate' }}>🂠</span>
          </div>
          <p>洗牌翻牌中...</p>
          <p className="tarot-page__drawing-sub">让直觉引导你</p>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="tarot-result" style={{ animation: 'fadeInUp 0.6s ease' }}>
          {/* 问题 */}
          {result.question !== '问事' && (
            <p className="tarot-result__question">问：{result.question}</p>
          )}

          {/* 牌面展示 - 3D flip */}
          <div className={`tarot-result__cards tarot-result__cards--${result.spreadType}`}>
            {result.draws.map((draw, i) => {
              const isRevealed = revealed[i];
              return (
                <div
                  key={i}
                  className="tarot-card"
                  style={{ animation: `fadeInUp 0.5s ease ${i * 0.2}s both` }}
                >
                  <div className="tarot-card__position">{draw.position}</div>
                  {/* 3D Flip container */}
                  <div className="tarot-card__flip">
                    <div className={`tarot-card__flip-inner ${isRevealed ? 'tarot-card__flip-inner--revealed' : ''} ${draw.orientation === 'reversed' ? 'tarot-card__flip-inner--reversed' : ''}`}>
                      {/* Card back */}
                      <div className="tarot-card__back">
                        <div className="tarot-card__back-pattern">
                          <span className="tarot-card__back-symbol">✦</span>
                        </div>
                      </div>
                      {/* Card face */}
                      <div className="tarot-card__face">
                        <div className="tarot-card__number">{draw.card.number}</div>
                        <div className="tarot-card__name">{draw.card.name}</div>
                        <div className="tarot-card__name-en">{draw.card.nameEn}</div>
                      </div>
                    </div>
                  </div>
                  {/* 元素徽章 */}
                  <div
                    className="tarot-card__element"
                    style={{
                      backgroundColor: `${ELEMENT_COLORS[draw.card.element]}22`,
                      borderColor: ELEMENT_COLORS[draw.card.element],
                      color: ELEMENT_COLORS[draw.card.element],
                      opacity: isRevealed ? 1 : 0,
                      transition: 'opacity 0.4s ease 0.3s',
                    }}
                  >
                    <span className="tarot-card__element-icon">{ELEMENT_SYMBOLS[draw.card.element]}</span>
                    <span className="tarot-card__element-text">{draw.card.element}</span>
                  </div>
                  {/* 星体 */}
                  <div className="tarot-card__planet" style={{ opacity: isRevealed ? 1 : 0, transition: 'opacity 0.4s ease 0.4s' }}>
                    <span className="tarot-card__planet-label">✦</span>
                    <span>{draw.card.planet}</span>
                  </div>
                  <div className="tarot-card__orientation" style={{ color: getOrientationColor(draw.orientation), opacity: isRevealed ? 1 : 0, transition: 'opacity 0.4s ease 0.5s' }}>
                    {draw.orientation === 'upright' ? '正位' : '逆位'}
                  </div>
                  <div className="tarot-card__keywords" style={{ opacity: isRevealed ? 1 : 0, transition: 'opacity 0.4s ease 0.6s' }}>
                    {draw.card.keywords.map((kw) => (
                      <span key={kw} className="tarot-card__keyword">{kw}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 综合解读 - show after all cards revealed */}
          <div className="tarot-result__summary" style={{ opacity: revealed.length === result.draws.length ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <h4>牌面解读</h4>
            {result.summary.split('\n\n').map((para, i) => {
              if (para === '---') return <hr key={i} className="tarot-result__divider" />;
              return <p key={i}>{para}</p>;
            })}
          </div>

          {/* 每张牌详情 */}
          <div className="tarot-result__details" style={{ opacity: revealed.length === result.draws.length ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>
            {result.draws.map((draw, i) => (
              <div key={i} className="tarot-result__detail">
                <h4>
                  {draw.position} · {draw.card.name}（{draw.orientation === 'upright' ? '正位' : '逆位'}）
                </h4>
                <div className="tarot-result__detail-meta">
                  <span
                    className="tarot-result__detail-element"
                    style={{ color: ELEMENT_COLORS[draw.card.element] }}
                  >
                    {ELEMENT_SYMBOLS[draw.card.element]} {draw.card.element}
                  </span>
                  <span className="tarot-result__detail-planet">✦ {draw.card.planet}</span>
                </div>
                <p className="tarot-result__detail-desc">{draw.card.description}</p>
                <p className="tarot-result__detail-meaning">
                  {draw.orientation === 'upright' ? draw.card.upright : draw.card.reversed}
                </p>
              </div>
            ))}
          </div>

          {/* 组合解读（多牌阵） */}
          {result.spreadType !== 'single' && result.combination && (
            <div className="tarot-result__combination" style={{ opacity: revealed.length === result.draws.length ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }}>
              <h4>🔮 组合解读</h4>
              <p className="tarot-result__combination-subtitle">
                {result.draws.map((d, i) => (
                  <span key={i}>
                    {i > 0 && <span className="tarot-result__combination-arrow"> → </span>}
                    <span
                      className="tarot-result__combination-chip"
                      style={{ borderColor: ELEMENT_COLORS[d.card.element], color: ELEMENT_COLORS[d.card.element] }}
                    >
                      {d.position}·{d.card.name}
                    </span>
                  </span>
                ))}
              </p>
              {result.combination.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* 能量分析 */}
          {revealed.length === result.draws.length && (
            <div className="tarot-result__energy">
              <h4 className="tarot-result__energy-title">能量分析</h4>
              <div className="tarot-result__energy-bars">
                {(['火', '水', '风', '土'] as const).map((el, i) => {
                  const count = result.draws.filter(d => d.card.element === el).length;
                  const total = result.draws.length;
                  const pct = Math.round((count / total) * 100);
                  const analysis = ELEMENT_ANALYSIS[el];
                  return (
                    <div key={el} className="tarot-result__energy-row" style={{ animation: `fadeInUp 0.4s ease ${0.8 + i * 0.08}s both` }}>
                      <div className="tarot-result__energy-head">
                        <span className="tarot-result__energy-icon" style={{ color: ELEMENT_COLORS[el] }}>{ELEMENT_SYMBOLS[el]}</span>
                        <span className="tarot-result__energy-label" style={{ color: ELEMENT_COLORS[el] }}>{el}象</span>
                        <span className="tarot-result__energy-sublabel">{analysis.label}</span>
                        <span className="tarot-result__energy-count">{count}张</span>
                      </div>
                      <div className="tarot-result__energy-bar">
                        <div className="tarot-result__energy-fill" style={{ width: count > 0 ? `${Math.max(pct, 15)}%` : '0%', background: ELEMENT_COLORS[el], transition: `width 0.8s ease ${0.9 + i * 0.1}s` }} />
                      </div>
                      {count > 0 && (
                        <p className="tarot-result__energy-note">{count >= total / 2 ? analysis.positive : analysis.negative}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {(() => {
                const elements = result.draws.map(d => d.card.element);
                const unique = [...new Set(elements)];
                const dominant = unique.length === 1 ? unique[0] : null;
                const balanced = unique.length === result.draws.length;
                if (dominant) {
                  return <p className="tarot-result__energy-summary">全部{dominant}象能量集中，{ELEMENT_ANALYSIS[dominant].positive}，是极强的单一能量指向。</p>;
                }
                if (balanced) {
                  return <p className="tarot-result__energy-summary">元素分布均衡，各方面能量平衡，整体局势稳定和谐。</p>;
                }
                const counts = unique.map(el => ({ el, count: elements.filter(e => e === el).length })).sort((a, b) => b.count - a.count);
                return <p className="tarot-result__energy-summary">{counts[0].el}象能量最强（{counts[0].count}张），{ELEMENT_ANALYSIS[counts[0].el].positive}。注意平衡{counts[counts.length - 1].el}象的不足。</p>;
              })()}
            </div>
          )}

          {/* 操作 */}
          <div className="page-form__actions" style={{ opacity: revealed.length === result.draws.length ? 1 : 0, transition: 'opacity 0.5s ease 0.7s' }}>
            <button className="btn-primary" onClick={handleReset}>
              重新占卜
            </button>
            <ShareButton targetRef={resultRef} fileName={`塔罗占卜_${Date.now()}.png`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotPage;
