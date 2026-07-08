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
