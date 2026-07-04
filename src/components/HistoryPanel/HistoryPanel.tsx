import React, { useEffect, useRef, useState } from 'react';
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Focus panel on open
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const handleClear = () => {
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div
      className="history-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="历史记录"
    >
      <div
        ref={panelRef}
        className="history-panel paper-card"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="history-panel__header">
          <h3 className="history-panel__title" id="history-title">📜 历史记录</h3>
          <button className="history-panel__close" onClick={onClose} aria-label="关闭">✕</button>
        </div>

        {history.length === 0 ? (
          <div className="history-panel__empty">
            <p>暂无记录</p>
            <p className="history-panel__empty-sub">摇卦后的结果会保存在这里</p>
          </div>
        ) : (
          <>
            <div className="history-panel__list" role="list" aria-labelledby="history-title">
              {history.map((item) => (
                <button
                  key={item.id}
                  className="history-panel__item"
                  onClick={() => onSelect(item)}
                  style={{ animation: 'fadeInUp 0.3s ease' }}
                  aria-label={`${item.result.hexagram.fullName} ${formatDate(item.timestamp)}`}
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
                      aria-label={`删除 ${item.result.hexagram.fullName}`}
                    >
                      ✕
                    </button>
                  </div>
                </button>
              ))}
            </div>
            <div className="history-panel__footer">
              <button
                className={`btn-secondary ${confirmClear ? 'btn-secondary--warn' : ''}`}
                onClick={handleClear}
              >
                {confirmClear ? '确认清空？' : '清空记录'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
