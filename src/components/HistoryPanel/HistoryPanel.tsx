import React from 'react';
import type { HistoryItem } from '../../types';
import './HistoryPanel.css';

interface HistoryPanelProps {
  history: HistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRemove,
  onClear,
  onSelect,
  onClose,
}) => {
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel paper-card" onClick={(e) => e.stopPropagation()}>
        <div className="history-panel__header">
          <h3 className="history-panel__title">📜 历史记录</h3>
          <button className="history-panel__close" onClick={onClose}>✕</button>
        </div>

        {history.length === 0 ? (
          <div className="history-panel__empty">
            <p>暂无记录</p>
            <p className="history-panel__empty-sub">摇卦后的结果会保存在这里</p>
          </div>
        ) : (
          <>
            <div className="history-panel__list">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-panel__item"
                  onClick={() => onSelect(item)}
                  style={{ animation: 'fadeInUp 0.3s ease' }}
                >
                  <div className="history-panel__item-info">
                    <span className="history-panel__item-name text-gold">
                      {item.result.hexagram.fullName}
                    </span>
                    <span className="history-panel__item-time">
                      {formatDate(item.timestamp)}
                    </span>
                    {item.result.changedHexagram && (
                      <span className="history-panel__item-changed">
                        → {item.result.changedHexagram.fullName}
                      </span>
                    )}
                  </div>
                  <div className="history-panel__item-actions">
                    <button
                      className="history-panel__item-delete"
                      onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="history-panel__footer">
              <button className="btn-secondary" onClick={onClear}>
                清空记录
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
