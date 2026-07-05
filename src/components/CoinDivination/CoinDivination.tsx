import React, { useState, useCallback } from 'react';
import type { CoinFlipResult } from '../../types';
import Coin from './Coin';
import './CoinDivination.css';

interface CoinDivinationProps {
  phase: 'idle' | 'flipping' | 'complete';
  currentFlip: number;
  hasResult: boolean;
  onFlipOnce: () => CoinFlipResult;
  onStart: () => void;
  onReset: () => void;
  onViewResult: () => void;
}

const CoinDivination: React.FC<CoinDivinationProps> = ({
  phase,
  currentFlip,
  hasResult,
  onFlipOnce,
  onStart,
  onReset,
  onViewResult,
}) => {
  const [flipping, setFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<CoinFlipResult | null>(null);
  const [coinResults, setCoinResults] = useState<number[][]>([]);

  const handleStart = useCallback(() => {
    setCoinResults([]);
    setLastResult(null);
    onStart();
  }, [onStart]);

  const handleFlip = useCallback(() => {
    if (flipping || phase !== 'flipping') return;
    setFlipping(true);
    const result = onFlipOnce();
    setLastResult(result);
    setCoinResults((prev) => [...prev, result.coins]);

    setTimeout(() => {
      setFlipping(false);
    }, 1200);
  }, [flipping, phase, onFlipOnce]);

  const positionNames = ['初', '二', '三', '四', '五', '上'];

  return (
    <div className="coin-divination">
      {phase === 'idle' && (
        <div className="coin-divination__idle">
          <div className="coin-divination__intro">
            <p className="coin-divination__intro-text">
              铜钱摇卦，乃周易古法
            </p>
            <p className="coin-divination__intro-sub">
              抛掷三枚铜钱，共摇六次，自下而上生成六爻
            </p>
          </div>
          <div className="coin-divination__idle-coins">
            <span className="coin-preview">🪙</span>
            <span className="coin-preview">🪙</span>
            <span className="coin-preview">🪙</span>
          </div>
          <button className="btn-primary coin-divination__start-btn" onClick={handleStart}>
            开始摇卦
          </button>
        </div>
      )}

      {(phase === 'flipping' || phase === 'complete') && (
        <div className="coin-divination__flipping">
          <div className="coin-divination__progress">
            <span className="coin-divination__progress-label">
              第 <strong>{Math.min(currentFlip + 1, 6)}</strong> 爻
            </span>
            <span className="coin-divination__progress-pos">
              {positionNames[Math.min(currentFlip, 5)]}爻
            </span>
          </div>

          <div className="coin-divination__coins">
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[0] : null} />
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[1] : null} />
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[2] : null} />
          </div>

          {lastResult && !flipping && (
            <div className="coin-divination__result" style={{ animation: 'fadeInUp 0.4s ease' }}>
              <span className={`coin-divination__sum coin-divination__sum--${lastResult.sum}`}>
                三枚之和：{lastResult.sum}
              </span>
              <span className="coin-divination__yao-type">
                {lastResult.sum === 6 && '老阴 ⚋（变爻）'}
                {lastResult.sum === 7 && '少阳 ⚊'}
                {lastResult.sum === 8 && '少阴 ⚋'}
                {lastResult.sum === 9 && '老阳 ⚊（变爻）'}
              </span>
            </div>
          )}

          {!flipping && currentFlip < 6 && (
            <button className="btn-primary coin-divination__flip-btn" onClick={handleFlip}>
              {currentFlip === 0 ? '摇第一次' : '继续摇卦'}
            </button>
          )}

          {!flipping && currentFlip >= 6 && hasResult && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', animation: 'fadeInUp 0.4s ease' }}>
              <button className="btn-primary coin-divination__flip-btn" onClick={onViewResult}>
                查看卦象 →
              </button>
              <button className="btn-secondary" onClick={onReset}>
                再算一卦
              </button>
            </div>
          )}

          {flipping && (
            <div className="coin-divination__flipping-text" style={{ animation: 'pulse 0.6s ease infinite' }}>
              铜钱旋转中...
            </div>
          )}

          {/* 已完成的爻 */}
          {coinResults.length > 0 && (
            <div className="coin-divination__history">
              <p className="coin-divination__history-title">已摇爻象：</p>
              <div className="coin-divination__history-items">
                {coinResults.map((coins, i) => {
                  const sum = coins[0] + coins[1] + coins[2];
                  return (
                    <div key={i} className="coin-divination__history-item">
                      <span className="coin-divination__history-pos">
                        {positionNames[i]}爻
                      </span>
                      <span className={`coin-divination__history-line coin-divination__history-line--${sum === 7 || sum === 9 ? 'yang' : 'yin'}`}>
                        {sum === 6 || sum === 8 ? '⚋' : '⚊'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default CoinDivination;
