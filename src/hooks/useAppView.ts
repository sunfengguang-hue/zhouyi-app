import { useState, useCallback } from 'react';
import type { AppView, WuXing } from '../types';

export interface NavParams {
  preferWX?: WuXing;
  surname?: string;
}

export function useAppView() {
  const [view, setView] = useState<AppView>('home');
  const [params, setParams] = useState<NavParams | null>(null);

  const navigate = useCallback((target: AppView, navParams?: NavParams) => {
    setView(target);
    setParams(navParams ?? null);
    // 回到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => {
    setView('home');
    setParams(null);
  }, []);

  const consumeParams = useCallback(() => {
    const p = params;
    setParams(null);
    return p;
  }, [params]);

  return { view, navigate, goHome, params, consumeParams };
}
