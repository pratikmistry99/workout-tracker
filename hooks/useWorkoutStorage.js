import { useState, useCallback, useEffect } from 'react';

const DEFAULT_DATA = { history: [], lastSession: {}, active: {}, prs: {} };

function load(userId) {
  if (!userId) return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(`workout-data-v1-${userId}`);
    return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

export function useWorkoutStorage(userId) {
  const [data, setData] = useState(() => load(userId));

  useEffect(() => {
    setData(load(userId));
  }, [userId]);

  const persist = useCallback((next) => {
    setData(next);
    if (!userId) return;
    try {
      localStorage.setItem(`workout-data-v1-${userId}`, JSON.stringify(next));
    } catch (e) {
      console.error('Storage save failed', e);
    }
  }, [userId]);

  return { data, persist };
}
