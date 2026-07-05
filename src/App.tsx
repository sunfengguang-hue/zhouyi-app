import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import Home from './components/Home/Home';
import CoinDivination from './components/CoinDivination/CoinDivination';
import ResultPanel from './components/ResultPanel/ResultPanel';
import HistoryPanel from './components/HistoryPanel/HistoryPanel';
import ShareButton from './components/ShareButton/ShareButton';
import Toast, { type ToastData } from './components/Toast/Toast';
import { useDivination } from './hooks/useDivination';
import { useHistory } from './hooks/useHistory';
import { useAppView } from './hooks/useAppView';
import type { AppView, DivinationResult, HistoryItem } from './types';

// 占位组件 - 后续逐步实现
const BaziPage = React.lazy(() => import('./components/BaziPage/BaziPage'));
const FengshuiPage = React.lazy(() => import('./components/FengshuiPage/FengshuiPage'));
const NamingPage = React.lazy(() => import('./components/NamingPage/NamingPage'));
const FortuneStickPage = React.lazy(() => import('./components/FortuneStickPage/FortuneStickPage'));
const TarotPage = React.lazy(() => import('./components/TarotPage/TarotPage'));
const AstrologyPage = React.lazy(() => import('./components/AstrologyPage/AstrologyPage'));

const App: React.FC = () => {
  const { view, navigate: rawNavigate } = useAppView();
  const navigate = useCallback((v: AppView) => { setSaved(false); setViewingResult(null); rawNavigate(v); }, [rawNavigate]);
  const { phase, currentFlip, result, startDivination, flipOnce, reset } = useDivination();
  const { history, addRecord, removeRecord, clearHistory } = useHistory();
  const [showHistory, setShowHistory] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [saved, setSaved] = useState(false);
  const [viewingResult, setViewingResult] = useState<DivinationResult | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastData['type'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSaveHistory = useCallback(() => {
    if (saved) { showToast('已保存过', 'info'); return; }
    if (!result) return;
    addRecord(result);
    setSaved(true);
    showToast('已保存到历史记录', 'success');
  }, [result, addRecord, showToast, saved]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setViewingResult(item.result);
    setShowHistory(false);
  }, []);

  const displayResult = viewingResult || result;

  // 页面标题映射
  const pageTitles: Record<AppView, string> = {
    home: '玄学测算',
    zhouyi: '周易算卦',
    bazi: '生辰八字',
    fengshui: '罗盘风水',
    naming: '起名测名',
    astrology: '星座运势',
    fortune: '抽签问事',
    tarot: '塔罗占卜',
  };

  return (
    <Layout>
      <Header title={pageTitles[view]} compact={view === 'home'} />

      <main className="app__main">
        {/* 首页 */}
        {view === 'home' && (
          <Home onNavigate={navigate} />
        )}

        {/* 周易算卦 */}
        {view === 'zhouyi' && (
          <>
            {history.length > 0 && (
              <div className="app__nav">
                <button className="app__nav-btn" onClick={() => setShowHistory(true)}>
                  📜 历史记录 ({history.length})
                </button>
              </div>
            )}
            {phase !== 'complete' && (
              <CoinDivination
                phase={phase}
                currentFlip={currentFlip}
                onFlipOnce={flipOnce}
                onStart={startDivination}
                onReset={() => { setSaved(false); reset(); }}
              />
            )}
            {phase === 'complete' && result && !viewingResult && (
              <ResultPanel
                result={result}
                onSaveHistory={handleSaveHistory}
                shareRef={shareRef}
              />
            )}
            {viewingResult && (
              <div className="app__viewing">
                <ResultPanel
                  result={viewingResult}
                  onSaveHistory={() => showToast('查看历史记录', 'info')}
                  shareRef={shareRef}
                />
                <button className="btn-secondary app__back-btn" onClick={() => setViewingResult(null)}>
                  ← 返回
                </button>
              </div>
            )}
            {displayResult && (
              <div className="app__share">
                <ShareButton targetRef={shareRef} />
              </div>
            )}
            {showHistory && (
              <HistoryPanel
                history={history}
                onRemove={removeRecord}
                onClear={clearHistory}
                onSelect={handleSelectHistory}
                onClose={() => setShowHistory(false)}
              />
            )}
          </>
        )}

        {/* 生辰八字 */}
        {view === 'bazi' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <BaziPage />
          </React.Suspense>
        )}

        {/* 风水罗盘 */}
        {view === 'fengshui' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <FengshuiPage />
          </React.Suspense>
        )}

        {/* 起名测名 */}
        {view === 'naming' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <NamingPage />
          </React.Suspense>
        )}

        {/* 抽签问事 */}
        {view === 'fortune' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <FortuneStickPage />
          </React.Suspense>
        )}

        {/* 塔罗占卜 */}
        {view === 'tarot' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <TarotPage />
          </React.Suspense>
        )}

        {/* 星座运势 */}
        {view === 'astrology' && (
          <React.Suspense fallback={<div className="app__loading">加载中...</div>}>
            <AstrologyPage />
          </React.Suspense>
        )}
      </main>

      {/* 底部导航 */}
      <BottomNav current={view} onNavigate={navigate} />

      {/* Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </Layout>
  );
};

export default App;
