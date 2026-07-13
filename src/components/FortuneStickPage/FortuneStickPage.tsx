import React, { useState, useEffect, useRef } from 'react';
import type { FortuneStickResult } from '../../types';
import { drawFortuneStick, getLevelColor } from '../../utils/fortuneStickCalc';
import ShareButton from '../ShareButton/ShareButton';
import './FortuneStickPage.css';

// 问事分类关键词
const topicKeywords: Record<string, { keywords: string[]; icon: string; label: string; field: 'career' | 'love' | 'wealth' | 'health' }> = {
  career: { keywords: ['事业', '工作', '职业', '升职', '跳槽', '创业', '生意', '项目', '考试', '面试', '学业', '进修', '合作', '客户'], icon: '💼', label: '事业', field: 'career' },
  love: { keywords: ['感情', '爱情', '恋爱', '婚姻', '对象', '老公', '老婆', '伴侣', '暗恋', '分手', '复合', '桃花', '相亲', '约会'], icon: '❤️', label: '感情', field: 'love' },
  wealth: { keywords: ['财运', '赚钱', '投资', '理财', '股票', '基金', '彩票', '买房', '贷款', '收入', '工资', '奖金', '生意', '副业'], icon: '💰', label: '财运', field: 'wealth' },
  health: { keywords: ['健康', '身体', '生病', '手术', '治疗', '康复', '减肥', '运动', '养生', '体检', '失眠', '压力', '焦虑'], icon: '🏥', label: '健康', field: 'health' },
};

function detectTopic(question: string): { icon: string; label: string; field: 'career' | 'love' | 'wealth' | 'health' } | null {
  if (!question || question === '问事') return null;
  for (const [, topic] of Object.entries(topicKeywords)) {
    if (topic.keywords.some(kw => question.includes(kw))) {
      return { icon: topic.icon, label: topic.label, field: topic.field };
    }
  }
  return null;
}

// 签诗赏析：将签诗四句提炼为关键词
function extractPoemKeywords(poem: string): string[] {
  const lines = poem.split('\n').filter(Boolean);
  const keywords: string[] = [];
  const patterns = [/[春风秋雨日月星山河云]/, /[龙虎凤鹤鹏鸾]/, /[金玉珠宝翠]/, /[东南西北]/, /[天地人]/, /[福禄寿喜财]/];
  lines.forEach(line => {
    patterns.forEach(p => {
      const matches = line.match(new RegExp(p.source, 'g'));
      if (matches) keywords.push(...matches.slice(0, 2));
    });
  });
  return [...new Set(keywords)].slice(0, 6);
}

const FortuneStickPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<FortuneStickResult | null>(null);
  const [shaking, setShaking] = useState(false);
  const [shakePhase, setShakePhase] = useState(0);
  const [resultReady, setResultReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const tierClass: Record<string, string> = {
    '上上签': 'fortune-result--best',
    '上签': 'fortune-result--good',
    '中签': 'fortune-result--neutral',
    '下签': 'fortune-result--bad',
    '下下签': 'fortune-result--worst',
  };

  const handleDraw = () => {
    setShaking(true);
    setShakePhase(0);
    setResultReady(false);
    setFlash(false);

    setTimeout(() => setShakePhase(1), 500);
    setTimeout(() => setShakePhase(2), 1000);
    setTimeout(() => {
      const r = drawFortuneStick(question);
      setResult(r);
      setShaking(false);
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        setResultReady(true);
      }, 600);
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

      {/* Flash overlay */}
      {flash && <div className="fortune-flash" />}

      {result && resultReady && (
        <div ref={resultRef} className={`fortune-result ${tierClass[result.stick.level] || ''}`}>
          {/* 签号与等级 */}
          <div className="fortune-result__header" style={{ animation: 'stampReveal 0.6s ease both' }}>
            <div className="fortune-result__number">第 {result.stick.id} 签</div>
            <div className="fortune-result__level" style={{ color: getLevelColor(result.stick.level), borderColor: getLevelColor(result.stick.level) }}>
              {result.stick.level}
            </div>
          </div>

          {/* 签题 */}
          <h2 className="fortune-result__title" style={{ animation: 'fortuneReveal 0.5s ease 0.15s both' }}>{result.stick.title}</h2>

          {/* 所问之事 */}
          {result.question !== '问事' && (
            <p className="fortune-result__question" style={{ animation: 'fortuneReveal 0.5s ease 0.15s both' }}>问：{result.question}</p>
          )}

          {/* 签诗 */}
          <div className="fortune-result__poem" style={{ animation: 'scrollUnroll 0.8s ease 0.25s both' }}>
            {result.stick.poem.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* 签诗赏析 */}
          {(() => {
            const keywords = extractPoemKeywords(result.stick.poem);
            if (keywords.length === 0) return null;
            return (
              <div className="fortune-result__poem-analysis" style={{ animation: 'fortuneReveal 0.5s ease 0.3s both' }}>
                <h4>签诗意象</h4>
                <div className="fortune-result__poem-keywords">
                  {keywords.map((kw, i) => (
                    <span key={i} className="fortune-result__poem-kw" style={{ animation: `popIn 0.3s ease ${0.35 + i * 0.06}s both` }}>{kw}</span>
                  ))}
                </div>
              </div>
            );
          })()}

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
          <div className="fortune-result__advice" style={{ animation: 'fortuneReveal 0.5s ease 0.55s both' }}>
            <h4>仙机提示</h4>
            <div className="fortune-result__advice-group">
              <div className="fortune-result__advice-label fortune-result__advice-label--good">
                <span>宜</span>
              </div>
              <div className="fortune-result__advice-tags">
                {result.stick.advice.good.map((item, i) => (
                  <span key={i} className="fortune-result__advice-good" style={{ animation: `popIn 0.3s ease ${0.6 + i * 0.06}s both` }}>{item}</span>
                ))}
              </div>
            </div>
            <div className="fortune-result__advice-group">
              <div className="fortune-result__advice-label fortune-result__advice-label--bad">
                <span>忌</span>
              </div>
              <div className="fortune-result__advice-tags">
                {result.stick.advice.bad.map((item, i) => (
                  <span key={i} className="fortune-result__advice-bad" style={{ animation: `popIn 0.3s ease ${0.8 + i * 0.06}s both` }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 总体解读 */}
          <div className="fortune-result__overall" style={{ animation: 'fortuneReveal 0.5s ease 0.6s both' }}>
            <h4>总体</h4>
            <p>{result.stick.meaning.overall}</p>
          </div>

          {/* 针对性解读 */}
          {(() => {
            const topic = detectTopic(result.question);
            if (!topic) return null;
            const topicMeaning = result.stick.meaning[topic.field];
            return (
              <div className="fortune-result__topic" style={{ animation: 'fortuneReveal 0.5s ease 0.65s both' }}>
                <div className="fortune-result__topic-badge">
                  <span className="fortune-result__topic-icon">{topic.icon}</span>
                  <span className="fortune-result__topic-label">针对「{topic.label}」解读</span>
                </div>
                <p className="fortune-result__topic-text">{topicMeaning}</p>
                <p className="fortune-result__topic-hint">此签在{topic.label}方面的指引尤为关键，建议重点关注</p>
              </div>
            );
          })()}

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
            <ShareButton targetRef={resultRef} fileName={`抽签_${Date.now()}.png`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneStickPage;
