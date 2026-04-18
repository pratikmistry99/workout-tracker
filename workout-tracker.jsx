import React, { useState, useRef, useCallback } from 'react';
import { WORKOUTS, DEFAULT_REST } from './data/workouts';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { HomeView } from './components/HomeView';
import { HistoryView } from './components/HistoryView';
import { WorkoutView } from './components/WorkoutView';
import { RestBar } from './components/RestBar';
import { PlateCalculator } from './components/PlateCalculator';

function vibrate(ms) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
}

export default function App() {
  const { data, loading, persist } = useWorkoutStorage();
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restInitial, setRestInitial] = useState(DEFAULT_REST);
  const restRef = useRef(null);

  const startWorkout = (workoutId) => {
    if (!data.active?.[workoutId]) {
      const sets = {};
      WORKOUTS[workoutId].exercises.forEach((ex) => {
        sets[ex.id] = Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false }));
      });
      persist({
        ...data,
        active: {
          ...(data.active || {}),
          [workoutId]: { startedAt: Date.now(), sets, notes: '' },
        },
      });
    }
    setCurrentWorkoutId(workoutId);
  };

  const updateSet = (workoutId, exerciseId, setIdx, patch) => {
    const active = data.active[workoutId];
    if (!active) return;
    const arr = active.sets[exerciseId].map((s, i) => (i === setIdx ? { ...s, ...patch } : s));
    persist({
      ...data,
      active: {
        ...data.active,
        [workoutId]: { ...active, sets: { ...active.sets, [exerciseId]: arr } },
      },
    });
  };

  const finishWorkout = (workoutId, notes) => {
    const active = data.active[workoutId];
    if (!active) return;

    const session = {
      workoutId,
      startedAt: active.startedAt,
      finishedAt: Date.now(),
      sets: active.sets,
      notes: notes || '',
    };

    // Update last session weights
    const newLast = { ...data.lastSession };
    Object.entries(active.sets).forEach(([exId, arr]) => {
      const done = arr.filter((s) => s.done && s.weight);
      if (done.length) newLast[exId] = done.map((s) => ({ weight: s.weight, reps: s.reps }));
    });

    // Update personal records
    const newPrs = { ...(data.prs || {}) };
    Object.entries(active.sets).forEach(([exId, arr]) => {
      arr.filter((s) => s.done && s.weight).forEach((s) => {
        const w = parseFloat(s.weight);
        if (!isNaN(w) && (newPrs[exId] === undefined || w > newPrs[exId])) {
          newPrs[exId] = w;
        }
      });
    });

    const newActive = { ...data.active };
    delete newActive[workoutId];

    persist({
      history: [session, ...data.history].slice(0, 200),
      lastSession: newLast,
      active: newActive,
      prs: newPrs,
    });

    stopRest();
    setCurrentWorkoutId(null);
  };

  const cancelWorkout = (workoutId) => {
    const newActive = { ...data.active };
    delete newActive[workoutId];
    persist({ ...data, active: newActive });
    stopRest();
    setCurrentWorkoutId(null);
  };

  const startRest = useCallback((sec = DEFAULT_REST) => {
    // Don't interrupt a rest already in progress
    if (restRef.current) return;
    setRestInitial(sec);
    setRestSeconds(sec);
    restRef.current = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          clearInterval(restRef.current);
          restRef.current = null;
          vibrate([100, 60, 100]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const stopRest = useCallback(() => {
    if (restRef.current) {
      clearInterval(restRef.current);
      restRef.current = null;
    }
    setRestSeconds(0);
  }, []);

  const adjustRest = (delta) => {
    const next = Math.max(0, restSeconds + delta);
    setRestSeconds(next);
    // Keep initial >= current so the progress bar doesn't overflow
    if (next > restInitial) setRestInitial(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center">
        Loading…
      </div>
    );
  }

  let view;
  if (currentWorkoutId) {
    view = (
      <WorkoutView
        workoutId={currentWorkoutId}
        active={data.active[currentWorkoutId]}
        lastSession={data.lastSession}
        prs={data.prs || {}}
        onBack={() => setCurrentWorkoutId(null)}
        onUpdateSet={(exId, idx, patch) => updateSet(currentWorkoutId, exId, idx, patch)}
        onFinish={(notes) => finishWorkout(currentWorkoutId, notes)}
        onCancel={() => cancelWorkout(currentWorkoutId)}
        onCompleteSet={(restTime) => {
          vibrate(40);
          startRest(restTime || DEFAULT_REST);
        }}
      />
    );
  } else if (showHistory) {
    view = <HistoryView history={data.history || []} onBack={() => setShowHistory(false)} />;
  } else {
    view = (
      <HomeView
        active={data.active || {}}
        history={data.history || []}
        onSelect={startWorkout}
        onViewHistory={() => setShowHistory(true)}
        onPlateCalc={() => setShowPlateCalc(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {view}
      {restSeconds > 0 && (
        <RestBar
          seconds={restSeconds}
          initial={restInitial}
          onDismiss={stopRest}
          onAdd={() => adjustRest(30)}
          onSub={() => adjustRest(-15)}
        />
      )}
      {showPlateCalc && <PlateCalculator onClose={() => setShowPlateCalc(false)} />}
    </div>
  );
}
