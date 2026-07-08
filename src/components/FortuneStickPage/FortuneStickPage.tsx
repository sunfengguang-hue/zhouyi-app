import React, { useState, useEffect } from 'react';
import type { FortuneStickResult } from '../../types';
import { drawFortuneStick, getLevelColor } from '../../utils/fortuneStickCalc';
import './FortuneStickPage.css';

const FortuneStickPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<FortuneStickResult | null>(null);
  const [shaking, setShaking] = useState(false);
  const [shakePhase, setShakePhase] = useState(0);
  const [resultReady, setResultReady] = useState(false);

  const handleDraw = () => {
    setShaking(true);
    setShakePhase(0);
    setResultReady(false);

    // Phase progression for visual feedback
    setTimeout(() => setShakePhase(1), 500);
    setTimeout(() => setShakePhase(2), 1000);
    setTimeout(() => {
      setResult(drawFortuneStick(question));
      setShaking(false);
      // Small delay then show result with animation
      setTimeout(() => setResultReady(true), 50);
    }, 1800);
  };

  const handleReset = () => {
    setResult(null);
    setQuestion('');
    setResultReady(false);
  };

  return (
    <div className="page-form fortune-page">
      {!result && !shaking && (
        <>
          <p className="fortune-page__intro">心中默念所问之事，诚心摇签</p>
          <div className="page-form__group">
            <label className="page-form__label">所问之事（可选）</label>
            <input
              className="page-form__input"
              placeholder="如：今年事业运势如何？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="page-form__actions">
            <button className="btn-primary" onClick={handleDraw}>🎋 诚心摇签</button>
          </div>
        </>
      )}

      {shaking && (
        <div className="fortune-page__shaking">
          <div className="fortune-page__canister">
            <div className="fortune-page__canister-body">
              <div className="fortune-page__canister-label">灵签</div>
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`fortune-page__stick fortune-page__stick--${i} ${shakePhase >= 1 ? 'fortune-page__stick--fly' : ''}`} />
              ))}
            </div>
            <div className="fortune-page__canister-base" />
          </div>
          <p className="fortune-page__shaking-text">
            {shakePhase === 0 && '摇签中...'}
            {shakePhase === 1 && '心诚则灵...'}
            {shakePhase === 2 && '签已落定...'}
          </p>
        </div>
      )}

      {result && resultReady && (
        <div className="fortune-result">
          {/* 签号与等级 */}
          <div className="fortune-result__header" style={{ animation: 'fortuneReveal 0.5s ease both' }}>
            <div className="fortune-result__number">第 {result.stick.id} 签</div>
            <div className="fortune-result__level" style={{ color: getLevelColor(result.stick.level), borderColor: getLevelColor(result.stick.level) }}>
              {result.stick.level}
            </div>
          </div>

          {/* 签题 */}
          <h2 className="fortune-result__title" style={{ animation: 'fortuneReveal 0.5s ease 0.1s both' }}>{result.stick.title}</h2>

          {/* 所问之事 */}
          {result.question !== '问事' && (
            <p className="fortune-result__question" style={{ animation: 'fortuneReveal 0.5s ease 0.15s both' }}>问：{result.question}</p>
          )}

          {/* 签诗 */}
          <div className="fortune-result__poem" style={{ animation: 'fortuneReveal 0.5s ease 0.2s both' }}>
            {result.stick.poem.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* 解曰 */}
          <div className="fortune-result__interp" style={{ animation: 'fortuneReveal 0.5s ease 0.3s both' }}>
            <h4>解曰</h4>
            <p>{result.stick.interpretation}</p>
          </div>

          {/* 典故 */}
          <div className="fortune-result__story" style={{ animation: 'fortuneReveal 0.5s ease 0.4s both' }}>
            <h4>典故</h4>
            <p>{result.stick.story}</p>
          </div>

          {/* 仙机提示 */}
          <div className="fortune-result__advice" style={{ animation: 'fortuneReveal 0.5s ease 0.5s both' }}>
            <h4>仙机提示</h4>
            <div className="fortune-result__advice-group">
              <div className="fortune-result__advice-label fortune-result__advice-label--good">
                <span>宜</span>
              </div>
              <div className="fortune-result__advice-tags">
                {result.stick.advice.good.map((item, i) => (
                  <span key={i} className="fortune-result__advice-good">{item}</span>
                ))}
              </div>
            </div>
            <div className="fortune-result__advice-group">
              <div className="fortune-result__advice-label fortune-result__advice-label--bad">
                <span>忌</span>
              </div>
              <div className="fortune-result__advice-tags">
                {result.stick.advice.bad.map((item, i) => (
                  <span key={i} className="fortune-result__advice-bad">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 总体解读 */}
          <div className="fortune-result__overall" style={{ animation: 'fortuneReveal 0.5s ease 0.6s both' }}>
            <h4>总体</h4>
            <p>{result.stick.meaning.overall}</p>
          </div>

          {/* 详细解读 */}
          <div className="fortune-result__details">
            <div className="fortune-result__detail" style={{ animation: 'fortuneReveal 0.5s ease 0.7s both' }}>
              <span className="fortune-result__detail-icon">💼</span>
              <div>
                <h4>事业</h4>
                <p>{result.stick.meaning.career}</p>
              </div>
            </div>
            <div className="fortune-result__detail" style={{ animation: 'fortuneReveal 0.5s ease 0.8s both' }}>
              <span className="fortune-result__detail-icon">❤️</span>
              <div>
                <h4>感情</h4>
                <p>{result.stick.meaning.love}</p>
              </div>
            </div>
            <div className="fortune-result__detail" style={{ animation: 'fortuneReveal 0.5s ease 0.9s both' }}>
              <span className="fortune-result__detail-icon">💰</span>
              <div>
                <h4>财运</h4>
                <p>{result.stick.meaning.wealth}</p>
              </div>
            </div>
            <div className="fortune-result__detail" style={{ animation: 'fortuneReveal 0.5s ease 1.0s both' }}>
              <span className="fortune-result__detail-icon">🏥</span>
              <div>
                <h4>健康</h4>
                <p>{result.stick.meaning.health}</p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="page-form__actions" style={{ animation: 'fortuneReveal 0.5s ease 1.1s both' }}>
            <button className="btn-primary" onClick={handleReset}>再抽一签</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneStickPage;
