import React from 'react';
import './Coin.css';

interface CoinProps {
  flipping: boolean;
  value: number | null; // 2(反) or 3(正)
}

const Coin: React.FC<CoinProps> = ({ flipping, value }) => {
  const isHeads = value === 3; // 字(正面)
  const showResult = value !== null && !flipping;

  return (
    <div className={`coin ${flipping ? 'coin--flipping' : ''} ${showResult ? (isHeads ? 'coin--heads' : 'coin--tails') : ''}`}>
      <div className="coin__inner">
        <div className="coin__front">
          <span className="coin__text">字</span>
        </div>
        <div className="coin__back">
          <span className="coin__text coin__text--back">花</span>
        </div>
      </div>
    </div>
  );
};

export default Coin;
