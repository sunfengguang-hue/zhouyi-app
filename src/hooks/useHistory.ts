import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem, DivinationResult } from '../types';

const STORAGE_KEY = 'zhouyi-history';
const MAX_HISTORY = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 同步到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // 存储满了，忽略
    }
  }, [history]);

  /** 保存一条算卦结果 */
  const addRecord = useCallback((result: DivinationResult) => {
    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      result,
      timestamp: result.timestamp,
    };
    setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));
  }, []);

  /** 删除一条记录 */
  const removeRecord = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /** 清空所有记录 */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addRecord,
    removeRecord,
    clearHistory,
  };
}
