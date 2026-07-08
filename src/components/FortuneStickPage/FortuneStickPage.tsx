import React, { useState } from 'react';
import type { FortuneStickResult } from '../../types';
import { drawFortuneStick, getLevelColor } from '../../utils/fortuneStickCalc';
import './FortuneStickPage.css';

const FortuneStickPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<FortuneStickResult | null>(null);
  const [shaking, setShaking] = useState(false);

  const handleDraw = () => {
    setShaking(true);
    setTimeout(() => {
      setResult(drawFortuneStick(question));
      setShaking(false);
    }, 1500);
  };

  const handleReset = () => {
    setResult(null);
    setQuestion('');
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
            <button className="btn-primary" onClick={handleDraw}>
              🎋 诚心摇签
            </button>
          </div>
        </>
      )}

      {shaking && (
        <div className="fortune-page__shaking" style={{ animation: 'pulse 0.6s ease infinite' }}>
          <div className="fortune-page__shaking-icon">🎋</div>
          <p>签筒摇动中...</p>
          <p className="fortune-page__shaking-sub">心诚则灵</p>
        </div>
      )}

      {result && (
        <div className="fortune-result" style={{ animation: 'fadeInUp 0.6s ease' }}>
          {/* 签号与等级 */}
          <div className="fortune-result__header">
            <div className="fortune-result__number">第 {result.stick.id} 签</div>
            <div className="fortune-result__level" style={{ color: getLevelColor(result.stick.level), borderColor: getLevelColor(result.stick.level) }}>
              {result.stick.level}
            </div>
          </div>

          {/* 签题 */}
          <h2 className="fortune-result__title">{result.stick.title}</h2>

          {/* 所问之事 */}
          {result.question !== '问事' && (
            <p className="fortune-result__question">问：{result.question}</p>
          )}

          {/* 签诗 */}
          <div className="fortune-result__poem">
            {result.stick.poem.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* 解曰 */}
          <div className="fortune-result__interp">
            <h4>解曰</h4>
            <p>{result.stick.interpretation}</p>
          </div>

          {/* 典故 */}
          <div className="fortune-result__story">
            <h4>典故</h4>
            <p>{result.stick.story}</p>
          </div>

          {/* 仙机提示 */}
          <div className="fortune-result__advice">
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
          <div className="fortune-result__overall">
            <h4>总体</h4>
            <p>{result.stick.meaning.overall}</p>
          </div>

          {/* 详细解读 */}
          <div className="fortune-result__details">
            <div className="fortune-result__detail">
              <span className="fortune-result__detail-icon">💼</span>
              <div>
                <h4>事业</h4>
                <p>{result.stick.meaning.career}</p>
              </div>
            </div>
            <div className="fortune-result__detail">
              <span className="fortune-result__detail-icon">❤️</span>
              <div>
                <h4>感情</h4>
                <p>{result.stick.meaning.love}</p>
              </div>
            </div>
            <div className="fortune-result__detail">
              <span className="fortune-result__detail-icon">💰</span>
              <div>
                <h4>财运</h4>
                <p>{result.stick.meaning.wealth}</p>
              </div>
            </div>
            <div className="fortune-result__detail">
              <span className="fortune-result__detail-icon">🏥</span>
              <div>
                <h4>健康</h4>
                <p>{result.stick.meaning.health}</p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="page-form__actions">
            <button className="btn-primary" onClick={handleReset}>
              再抽一签
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneStickPage;
