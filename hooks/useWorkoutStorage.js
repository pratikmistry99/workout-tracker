import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001/api/workouts';
const DEFAULT_DATA = { history: [], lastSession: {}, active: {}, prs: {} };

export function useWorkoutStorage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => setData({ ...DEFAULT_DATA, ...d }))
      .catch((e) => console.error('Failed to load workout data:', e))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch((e) => console.error('Failed to save workout data:', e));
  }, []);

  return { data, loading, persist };
}
