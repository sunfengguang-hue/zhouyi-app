import { useState, useCallback } from 'react';
import type { AppView } from '../types';

export function useAppView() {
  const [view, setView] = useState<AppView>('home');

  const navigate = useCallback((target: AppView) => {
    setView(target);
    // 回到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => setView('home'), []);

  return { view, navigate, goHome };
}
