import { useState, useCallback } from 'react';

const KEY = 'workout-customizations-v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useWorkoutCustomizations() {
  const [customs, setCustoms] = useState(load);

  const saveCustoms = useCallback((workoutId, exercises) => {
    setCustoms((prev) => {
      const next = { ...prev, [workoutId]: { exercises } };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetCustoms = useCallback((workoutId) => {
    setCustoms((prev) => {
      const next = { ...prev };
      delete next[workoutId];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { customs, saveCustoms, resetCustoms };
}
