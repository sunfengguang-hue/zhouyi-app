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
  const [showComplete, setShowComplete] = useState(false);

  const handleStart = useCallback(() => {
    setCoinResults([]);
    setLastResult(null);
    setShowComplete(false);
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
      // Check if this was the 6th flip
      if (coinResults.length + 1 >= 6) {
        setShowComplete(true);
      }
    }, 1200);
  }, [flipping, phase, onFlipOnce, coinResults.length]);

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

          {/* 六爻卦象构建动画 */}
          {coinResults.length > 0 && (
            <div className="coin-divination__hexagram-build">
              {coinResults.map((coins, i) => {
                const sum = coins[0] + coins[1] + coins[2];
                const isYang = sum === 7 || sum === 9;
                const isChange = sum === 6 || sum === 9;
                return (
                  <div
                    key={i}
                    className={`coin-divination__hex-line coin-divination__hex-line--${isYang ? 'yang' : 'yin'} ${isChange ? 'coin-divination__hex-line--change' : ''}`}
                    style={{ animation: `hexLineReveal 0.4s ease ${i * 0.05}s both` }}
                  >
                    <span className="coin-divination__hex-pos">{positionNames[i]}</span>
                    {isYang ? (
                      <div className="coin-divination__hex-bar coin-divination__hex-bar--yang" />
                    ) : (
                      <div className="coin-divination__hex-bar-yin">
                        <div className="coin-divination__hex-bar coin-divination__hex-bar--yin" />
                        <div className="coin-divination__hex-bar coin-divination__hex-bar--yin" />
                      </div>
                    )}
                    {isChange && <span className="coin-divination__hex-change">变</span>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="coin-divination__coins">
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[0] : null} />
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[1] : null} />
            <Coin flipping={flipping} value={lastResult ? lastResult.coins[2] : null} />
          </div>

          {lastResult && !flipping && !showComplete && (
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

          {/* 完成庆祝动画 */}
          {showComplete && hasResult && (
            <div className="coin-divination__complete" style={{ animation: 'fadeInUp 0.6s ease' }}>
              <div className="coin-divination__complete-icon">☰</div>
              <p className="coin-divination__complete-text">六爻已成</p>
              <div className="coin-divination__complete-actions">
                <button className="btn-primary" onClick={onViewResult}>
                  查看卦象 →
                </button>
                <button className="btn-secondary" onClick={onReset}>
                  再算一卦
                </button>
              </div>
            </div>
          )}

          {!flipping && currentFlip < 6 && !showComplete && (
            <button className="btn-primary coin-divination__flip-btn" onClick={handleFlip}>
              {currentFlip === 0 ? '摇第一次' : `摇第${currentFlip + 1}次`}
            </button>
          )}

          {flipping && (
            <div className="coin-divination__flipping-text" style={{ animation: 'pulse 0.6s ease infinite' }}>
              铜钱旋转中...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinDivination;
