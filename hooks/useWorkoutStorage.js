import { useState, useCallback } from 'react';

const STORAGE_KEY = 'workout-data-v1';
const DEFAULT_DATA = { history: [], lastSession: {}, active: {}, prs: {} };

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

export function useWorkoutStorage() {
  const [data, setData] = useState(load);

  const persist = useCallback((next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Storage save failed', e);
    }
  }, []);

  return { data, persist };
}
