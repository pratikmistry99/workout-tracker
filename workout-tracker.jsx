import React, { useState, useRef, useCallback, useMemo } from 'react';
import { WORKOUTS, DEFAULT_REST, getEffectiveWorkouts } from './data/workouts';
import { useAuth } from './hooks/useAuth';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { useWorkoutCustomizations } from './hooks/useWorkoutCustomizations';
import { SplashScreen } from './components/SplashScreen';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { HistoryView } from './components/HistoryView';
import { WorkoutView } from './components/WorkoutView';
import { PRsView } from './components/PRsView';
import { EditExercises } from './components/EditExercises';
import { RestBar } from './components/RestBar';
import { PlateCalculator } from './components/PlateCalculator';

function vibrate(ms) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, login, signup, logout } = useAuth();

  const userId = user?.userId || null;
  const { data, persist } = useWorkoutStorage(userId);
  const { customs, saveCustoms, resetCustoms } = useWorkoutCustomizations(userId);
  const workouts = useMemo(() => getEffectiveWorkouts(customs), [customs]);

  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);
  const [view, setView] = useState('home');
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restInitial, setRestInitial] = useState(DEFAULT_REST);
  const restRef = useRef(null);

  const startWorkout = (workoutId) => {
    if (!data.active?.[workoutId]) {
      const sets = {};
      workouts[workoutId].exercises.forEach((ex) => {
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
    const arr = (active.sets[exerciseId] || []).map((s, i) => (i === setIdx ? { ...s, ...patch } : s));
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

    const newLast = { ...data.lastSession };
    Object.entries(active.sets).forEach(([exId, arr]) => {
      const done = arr.filter((s) => s.done && s.weight);
      if (done.length) newLast[exId] = done.map((s) => ({ weight: s.weight, reps: s.reps }));
    });

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
    if (next > restInitial) setRestInitial(next);
  };

  const handleSaveExercises = (workoutId, exercises) => {
    saveCustoms(workoutId, exercises);
    setEditingWorkoutId(null);
  };

  const handleResetExercises = (workoutId) => {
    resetCustoms(workoutId);
    setEditingWorkoutId(null);
  };

  // Splash screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Auth gate
  if (!user) {
    return <LoginView onLogin={login} onSignup={signup} />;
  }

  // Main app
  let content;
  if (currentWorkoutId && data.active[currentWorkoutId]) {
    content = (
      <WorkoutView
        workoutId={currentWorkoutId}
        workout={workouts[currentWorkoutId]}
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
        onEditExercises={() => setEditingWorkoutId(currentWorkoutId)}
      />
    );
  } else if (view === 'history') {
    content = <HistoryView history={data.history || []} workouts={workouts} onBack={() => setView('home')} />;
  } else if (view === 'prs') {
    content = <PRsView history={data.history || []} workouts={workouts} onBack={() => setView('home')} />;
  } else {
    content = (
      <HomeView
        active={data.active || {}}
        history={data.history || []}
        workouts={workouts}
        onSelect={startWorkout}
        onViewHistory={() => setView('history')}
        onViewPRs={() => setView('prs')}
        onPlateCalc={() => setShowPlateCalc(true)}
        user={user}
        onLogout={logout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <div key={currentWorkoutId || view} className="animate-viewEnter">
        {content}
      </div>

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

      {editingWorkoutId && (
        <EditExercises
          workoutName={workouts[editingWorkoutId].name}
          exercises={workouts[editingWorkoutId].exercises}
          defaultExercises={WORKOUTS[editingWorkoutId].exercises}
          onSave={(exercises) => handleSaveExercises(editingWorkoutId, exercises)}
          onReset={() => handleResetExercises(editingWorkoutId)}
          onClose={() => setEditingWorkoutId(null)}
        />
      )}
    </div>
  );
}
