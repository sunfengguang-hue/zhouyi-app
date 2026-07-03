import React, { useState } from 'react';
import type { DivinationResult } from '../../types';
import HexagramDisplay from '../HexagramDisplay/HexagramDisplay';
import './ResultPanel.css';

interface ResultPanelProps {
  result: DivinationResult;
  onSaveHistory: () => void;
  shareRef: React.RefObject<HTMLDivElement | null>;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onSaveHistory, shareRef }) => {
  const [activeTab, setActiveTab] = useState<'judgment' | 'lines' | 'interpretation'>('judgment');
  const { hexagram, changedHexagram, changedLines, lines } = result;
  // lines 类型为 number[]，但来自 HexagramLines，这里强制转换避免 TS 报错
  const lineValues: number[] = Array.from(lines);

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

          {activeTab === 'lines' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              {[...hexagram.lines].reverse().map((line) => (
                <div key={line.position} className="result-panel__yao">
                  <div className="result-panel__yao-header">
                    <span className="result-panel__yao-name text-gold">{line.name}</span>
                    <span className="result-panel__yao-bar">
                      {line.type === 'yang' ? '⚊' : '⚋'}
                    </span>
                  </div>
                  <p className="result-panel__yao-text">{line.text}</p>
                  <p className="result-panel__yao-translation">{line.translation}</p>
                  <div className="result-panel__divider" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'interpretation' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="result-panel__interp">
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💼</div>
                  <div>
                    <h4 className="result-panel__interp-title">事业</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.career}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">❤️</div>
                  <div>
                    <h4 className="result-panel__interp-title">感情</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.love}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💰</div>
                  <div>
                    <h4 className="result-panel__interp-title">财运</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.wealth}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">🏥</div>
                  <div>
                    <h4 className="result-panel__interp-title">健康</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.health}</p>
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
