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

// Error Boundary 防止子组件崩溃导致白屏
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onReset?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--gold, #d4a853)' }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>页面渲染出错了，请刷新或返回首页</p>
          <button className="btn-secondary" onClick={() => { this.setState({ hasError: false }); this.props.onReset?.(); }}>
            返回首页
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TaijiLoader: React.FC = () => (
  <div className="app__loading">
    <div className="taiji-spinner" />
    <p className="app__loading-text">推演中...</p>
  </div>
);

const App: React.FC = () => {
  const { view, navigate: rawNavigate } = useAppView();
  const navigate = useCallback((v: AppView) => { setSaved(false); setViewingResult(null); rawNavigate(v); }, [rawNavigate]);
  const { phase, currentFlip, result, startDivination, flipOnce, reset } = useDivination();
  const [divComplete, setDivComplete] = React.useState(false);
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
      <Header
        title={pageTitles[view]}
        compact={view === 'home'}
        onBack={view !== 'home' ? () => navigate('home') : undefined}
      />

      <main className="app__main">
        <ErrorBoundary onReset={() => { setSaved(false); reset(); navigate('home'); }}>
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
            {!divComplete && (
              <CoinDivination
                phase={phase}
                currentFlip={currentFlip}
                hasResult={!!result}
                onFlipOnce={flipOnce}
                onStart={(q) => { setDivComplete(false); startDivination(q); }}
                onReset={() => { setSaved(false); setDivComplete(false); reset(); }}
                onViewResult={() => setDivComplete(true)}
              />
            )}
            {divComplete && result && !viewingResult && (
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
                <ShareButton targetRef={shareRef} onError={(msg) => showToast(msg, 'error')} />
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
          <React.Suspense fallback={<TaijiLoader />}>
            <BaziPage />
          </React.Suspense>
        )}

        {/* 风水罗盘 */}
        {view === 'fengshui' && (
          <React.Suspense fallback={<TaijiLoader />}>
            <FengshuiPage />
          </React.Suspense>
        )}

        {/* 起名测名 */}
        {view === 'naming' && (
          <React.Suspense fallback={<TaijiLoader />}>
            <NamingPage />
          </React.Suspense>
        )}

        {/* 抽签问事 */}
        {view === 'fortune' && (
          <React.Suspense fallback={<TaijiLoader />}>
            <FortuneStickPage />
          </React.Suspense>
        )}

        {/* 塔罗占卜 */}
        {view === 'tarot' && (
          <React.Suspense fallback={<TaijiLoader />}>
            <TarotPage />
          </React.Suspense>
        )}

        {/* 星座运势 */}
        {view === 'astrology' && (
          <React.Suspense fallback={<TaijiLoader />}>
            <AstrologyPage />
          </React.Suspense>
        )}
        </ErrorBoundary>
      </main>

      {/* 底部导航 */}
      <BottomNav current={view} onNavigate={navigate} />

      {/* Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </Layout>
  );
};

export default App;
