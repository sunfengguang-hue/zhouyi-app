import React, { useState } from 'react';
import type { DivinationResult } from '../../types';
import HexagramDisplay from '../HexagramDisplay/HexagramDisplay';
import './ResultPanel.css';

interface ResultPanelProps {
  result: DivinationResult;
  onSaveHistory: () => void;
  shareRef: React.RefObject<HTMLDivElement | null>;
}

// ── helpers ────────────────────────────────────────────────────────────────────

const TRIGRAM_ATTRIBUTE: Record<string, string> = {
  '乾': '健', '坤': '顺', '震': '动', '巽': '入',
  '坎': '陷', '离': '丽', '艮': '止', '兑': '说',
};

const TRIGRAM_ADVICE: Record<string, string> = {
  '乾': '宜刚健有为，主动出击',
  '坤': '宜厚德载物，顺势而为',
  '震': '宜积极行动，把握先机',
  '巽': '宜柔顺渗透，循序渐进',
  '坎': '宜谨慎行事，以柔克刚',
  '离': '宜光明正大，展现才华',
  '艮': '宜适时止步，沉稳应对',
  '兑': '宜和谐沟通，以诚待人',
};

function getTrigramAdvice(trigram: string): string {
  return TRIGRAM_ADVICE[trigram] || '宜顺势而为';
}

function buildComprehensiveSummary(
  fullName: string,
  upper: string,
  lower: string,
  judgment: string,
): string {
  const upperAttr = TRIGRAM_ATTRIBUTE[upper] || upper;
  const lowerAttr = TRIGRAM_ATTRIBUTE[lower] || lower;
  const auspicious = /[亨利贞吉泰]/.test(judgment);
  const toneWord = auspicious ? '整体卦象趋于吉祥亨通' : '整体卦象蕴含挑战与变数';

  return (
    `此卦为「${fullName}」，上卦${upper}（${upperAttr}），下卦${lower}（${lowerAttr}），` +
    `${upperAttr}在上而${lowerAttr}在下，二者相互感应，构成此卦独特的气场与寓意。` +
    `${toneWord}，需结合当下情境细心体悟。` +
    `卦辞所示，关键在于顺应天时、把握分寸，方能趋吉避凶。`
  );
}

function buildChangeInsight(
  originalName: string,
  changedName: string,
  upper1: string,
  upper2: string,
  lower1: string,
  lower2: string,
): string {
  const uChanged = upper1 !== upper2;
  const lChanged = lower1 !== lower2;
  let processNote: string;
  if (uChanged && lChanged) {
    processNote = '上下卦皆有变动，提示内外环境均在转化之中，需全面调整心态与策略';
  } else if (uChanged) {
    processNote = '上卦发生变动，外在形势正在变化，宜顺势而为，灵活应对外部环境';
  } else {
    processNote = '下卦发生变动，内在根基有所调整，宜稳固根本，由内而外逐步改变';
  }
  return (
    `本卦「${originalName}」显示当前所处状况，变卦「${changedName}」提示事物发展的趋向与可能。` +
    `${processNote}。变化之中蕴含转机，关键在于保持中正平和之心。`
  );
}

interface InterpretationAdvice {
  career: string;
  love: string;
  wealth: string;
  health: string;
}

function getInterpretationAdvice(upper: string, lower: string): InterpretationAdvice {
  const ua = TRIGRAM_ATTRIBUTE[upper] || '';
  const la = TRIGRAM_ATTRIBUTE[lower] || '';
  const uAdv = getTrigramAdvice(upper);
  const lAdv = getTrigramAdvice(lower);

  const baseAdvice = `上卦为${upper}（${ua}），${uAdv}；下卦为${lower}（${la}），${lAdv}。`;

  // Generate category-specific supplements based on trigram pairing
  const careerMap: Record<string, string> = {
    '健健': '事业运势强劲，可大胆推进重要项目，把握领导机遇。',
    '顺顺': '事业上宜配合大局，借力使力，不宜独行。',
    '动动': '事业充满动力，但需防止冒进，三思而后行。',
    '丽丽': '适合展示才华与创意，有利于文化、教育领域发展。',
  };
  const loveMap: Record<string, string> = {
    '健健': '感情中双方都较为强势，需注意沟通方式，以柔济刚。',
    '顺顺': '感情温和柔顺，适合稳步发展，不宜操之过急。',
    '动动': '感情充满激情与变化，需保持新鲜感的同时注重稳定。',
    '说说': '感情甜蜜和谐，善于表达爱意，适合深入交流。',
  };
  const wealthMap: Record<string, string> = {
    '健健': '财运旺盛，适合主动投资与开拓新财路。',
    '顺顺': '财运平稳，适合保守理财，随势而动。',
    '陷陷': '财运需谨慎，防范风险，避免冲动消费与投资。',
    '动动': '财运随行动而来，积极寻找机会但须控制节奏。',
  };
  const healthMap: Record<string, string> = {
    '健健': '精力充沛，但需防止过劳，注意劳逸结合。',
    '顺顺': '身体状况平和，适合养生调理，保持规律作息。',
    '陷陷': '健康方面需多加留意，定期体检，防范隐患。',
    '止止': '宜静养休憩，避免过度劳累，给身心充分恢复的时间。',
  };

  const key = ua + la;
  const career = careerMap[key] || `${baseAdvice}在事业方面，应结合上下卦之势，刚柔并济，顺势而为。`;
  const love = loveMap[key] || `${baseAdvice}在感情方面，注意彼此沟通与理解，以诚相待。`;
  const wealth = wealthMap[key] || `${baseAdvice}在财运方面，审时度势，量入为出，稳中求进。`;
  const health = healthMap[key] || `${baseAdvice}在健康方面，顺应卦象之势，调养生息，保持身心平衡。`;

  return { career, love, wealth, health };
}

// ── component ──────────────────────────────────────────────────────────────────

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onSaveHistory, shareRef }) => {
  const [activeTab, setActiveTab] = useState<'judgment' | 'lines' | 'interpretation'>('judgment');
  const { hexagram, changedHexagram, changedLines, lines } = result;
  const lineValues: number[] = Array.from(lines);

  const upper = hexagram.upperTrigram;
  const lower = hexagram.lowerTrigram;
  const summary = buildComprehensiveSummary(
    hexagram.fullName, upper, lower, hexagram.judgment,
  );
  const advice = getInterpretationAdvice(upper, lower);

  const changeInsight = changedHexagram
    ? buildChangeInsight(
        hexagram.fullName,
        changedHexagram.fullName,
        upper,
        changedHexagram.upperTrigram,
        lower,
        changedHexagram.lowerTrigram,
      )
    : null;

  return (
    <div className="result-panel" style={{ animation: 'fadeInUp 0.6s ease' }}>
      {/* 卦象展示 */}
      <div className="result-panel__hexagrams">
        <HexagramDisplay
          hexagram={hexagram}
          lines={lines}
          title="本 卦"
          changedPositions={changedLines}
        />
        {changedHexagram && (
          <div className="result-panel__arrow">→</div>
        )}
        {changedHexagram && (
          <HexagramDisplay
            hexagram={changedHexagram}
            lines={lineValues.map((v: number) => v === 6 ? 7 : v === 9 ? 8 : v)}
            title="变 卦"
          />
        )}
      </div>

      {/* 分享区域 */}
      <div ref={shareRef} className="result-panel__share-area">
        {/* 卦辞 */}
        <div className="result-panel__judgment-text">
          <p className="result-panel__judgment-quote">「{hexagram.judgment}」</p>
        </div>

        {/* Tab 切换 */}
        <div className="result-panel__tabs">
          <button
            className={`result-panel__tab ${activeTab === 'judgment' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('judgment')}
          >
            卦辞
          </button>
          <button
            className={`result-panel__tab ${activeTab === 'lines' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('lines')}
          >
            爻辞
          </button>
          <button
            className={`result-panel__tab ${activeTab === 'interpretation' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('interpretation')}
          >
            解读
          </button>
        </div>

        {/* Tab 内容 */}
        <div className="result-panel__content">
          {/* ── 卦辞 tab ── */}
          {activeTab === 'judgment' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">卦辞</h4>
                <p className="result-panel__item-text">{hexagram.judgment}</p>
                <p className="result-panel__item-translation">{hexagram.judgmentTranslation}</p>
              </div>
              <div className="result-panel__divider" />
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">象辞</h4>
                <p className="result-panel__item-text">{hexagram.image}</p>
                <p className="result-panel__item-translation">{hexagram.imageTranslation}</p>
              </div>
              <div className="result-panel__divider" />
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">彖辞</h4>
                <p className="result-panel__item-text">{hexagram.commentary}</p>
                <p className="result-panel__item-translation">{hexagram.commentaryTranslation}</p>
              </div>
            </div>
          )}

          {/* ── 爻辞 tab ── */}
          {activeTab === 'lines' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              {[...hexagram.lines].reverse().map((line) => {
                const isChanged = changedLines.includes(line.position);
                return (
                  <div
                    key={line.position}
                    className={`result-panel__yao${isChanged ? ' result-panel__yao--changed' : ''}`}
                  >
                    <div className="result-panel__yao-header">
                      <span className="result-panel__yao-name text-gold">{line.name}</span>
                      <span className="result-panel__yao-bar">
                        {line.type === 'yang' ? '⚊' : '⚋'}
                      </span>
                      {isChanged && (
                        <span className="result-panel__change-badge">变爻</span>
                      )}
                    </div>
                    <p className="result-panel__yao-text">{line.text}</p>
                    <p className="result-panel__yao-translation">{line.translation}</p>
                    <div className="result-panel__divider" />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── 解读 tab ── */}
          {activeTab === 'interpretation' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* 综合分析 */}
              <div className="result-panel__summary">
                <h4 className="result-panel__summary-title">综合分析</h4>
                <p className="result-panel__summary-text">{summary}</p>
                <div className="result-panel__trigram-info">
                  上卦：<strong>{upper}</strong>（{TRIGRAM_ATTRIBUTE[upper] || ''}）
                  &nbsp;·&nbsp;
                  下卦：<strong>{lower}</strong>（{TRIGRAM_ATTRIBUTE[lower] || ''}）
                </div>
              </div>

              {/* 变卦启示 */}
              {changeInsight && (
                <div className="result-panel__change-insight">
                  <h4 className="result-panel__change-insight-title">
                    变卦启示 — 从{hexagram.fullName}变为{changedHexagram!.fullName}
                  </h4>
                  <p className="result-panel__change-insight-text">{changeInsight}</p>
                </div>
              )}

              {/* 四维解读 + 补充建议 */}
              <div className="result-panel__interp">
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💼</div>
                  <div>
                    <h4 className="result-panel__interp-title">事业</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.career}</p>
                    <p className="result-panel__interp-advice">{advice.career}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">❤️</div>
                  <div>
                    <h4 className="result-panel__interp-title">感情</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.love}</p>
                    <p className="result-panel__interp-advice">{advice.love}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💰</div>
                  <div>
                    <h4 className="result-panel__interp-title">财运</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.wealth}</p>
                    <p className="result-panel__interp-advice">{advice.wealth}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">🏥</div>
                  <div>
                    <h4 className="result-panel__interp-title">健康</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.health}</p>
                    <p className="result-panel__interp-advice">{advice.health}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="result-panel__actions">
        <button className="btn-secondary" onClick={onSaveHistory}>
          📜 保存记录
        </button>
      </div>
    </div>
  );
};

export default ResultPanel;
