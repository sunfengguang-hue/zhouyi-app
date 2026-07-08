import React from 'react';
import type { HexagramData } from '../../types';
import './HexagramDisplay.css';

interface HexagramDisplayProps {
  hexagram: HexagramData;
  lines: number[];
  title: string;
  changedPositions?: number[];
}

const HexagramDisplay: React.FC<HexagramDisplayProps> = ({
  hexagram,
  lines,
  title,
  changedPositions = [],
}) => {
  // 从下到上渲染（索引0是第一爻，在最下面）
  const reversedLines = [...lines].reverse();

  return (
    <div className="hexagram-display">
      <div className="hexagram-display__title">{title}</div>
      <div className="hexagram-display__name">
        <span className="hexagram-display__name-main">{hexagram.fullName}</span>
        <span className="hexagram-display__name-sub">第{hexagram.number}卦</span>
      </div>
      <div className="hexagram-display__lines">
        {reversedLines.map((value, displayIndex) => {
          // displayIndex 0 = 最上面（第6爻），5 = 最下面（第1爻）
          const actualPosition = 6 - displayIndex; // 第几爻
          const isYang = value === 7 || value === 9;
          const isChanged = changedPositions.includes(actualPosition);

          return (
            <React.Fragment key={displayIndex}>
              {displayIndex === 3 && <div className="hexagram-display__trigram-sep" />}
              <div
                className="hexagram-display__line"
                style={{
                  animation: `fadeInUp 0.4s ease ${displayIndex * 0.1}s both`,
                }}
              >
                <span className="hexagram-display__line-pos">
                  {['上', '五', '四', '三', '二', '初'][displayIndex]}
                </span>
                <div className={`hexagram-display__line-bar ${isYang ? 'hexagram-display__line-bar--yang' : 'hexagram-display__line-bar--yin'} ${isChanged ? 'hexagram-display__line-bar--changed' : ''}`}>
                  {isYang ? (
                    <div className="hexagram-display__yang-bar" />
                  ) : (
                    <div className="hexagram-display__yin-bar">
                      <div className="hexagram-display__yin-segment" />
                      <div className="hexagram-display__yin-gap" />
                      <div className="hexagram-display__yin-segment" />
                    </div>
                  )}
                </div>
                {isChanged && (
                  <span className="hexagram-display__changed-mark">〇</span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HexagramDisplay;
