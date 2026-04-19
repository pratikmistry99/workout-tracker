import { useState, useCallback, useEffect } from 'react';

function load(userId) {
  if (!userId) return {};
  try {
    const raw = localStorage.getItem(`workout-customizations-v1-${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useWorkoutCustomizations(userId) {
  const [customs, setCustoms] = useState(() => load(userId));

  useEffect(() => {
    setCustoms(load(userId));
  }, [userId]);

  const saveCustoms = useCallback((workoutId, exercises) => {
    if (!userId) return;
    setCustoms((prev) => {
      const next = { ...prev, [workoutId]: { exercises } };
      localStorage.setItem(`workout-customizations-v1-${userId}`, JSON.stringify(next));
      return next;
    });
  }, [userId]);

  const resetCustoms = useCallback((workoutId) => {
    if (!userId) return;
    setCustoms((prev) => {
      const next = { ...prev };
      delete next[workoutId];
      localStorage.setItem(`workout-customizations-v1-${userId}`, JSON.stringify(next));
      return next;
    });
  }, [userId]);

  return { customs, saveCustoms, resetCustoms };
}
