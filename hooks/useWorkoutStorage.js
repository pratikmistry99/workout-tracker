import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'workout-data-v1';
const DEFAULT_DATA = { history: [], lastSession: {}, active: {}, prs: {} };

export function useWorkoutStorage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...DEFAULT_DATA, ...JSON.parse(raw) });
    } catch (e) {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Storage save failed', e);
    }
  }, []);

  return { data, loading, persist };
}
