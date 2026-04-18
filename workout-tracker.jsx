import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Check, Timer, X, Dumbbell, Flame, Zap, Target } from 'lucide-react';

const WORKOUTS = {
  'upper-a': {
    name: 'Upper A',
    subtitle: 'Strength + Upper Chest',
    icon: Flame,
    accent: 'bg-gradient-to-br from-sky-500 to-blue-700',
    accentText: 'text-sky-400',
    exercises: [
      { id: 'ua-1', name: 'Incline DB Press', sets: 4, reps: '6–8', note: 'Better ROM than barbell' },
      { id: 'ua-2', name: 'Weighted / Assisted Pull-Ups', sets: 3, reps: '6–8' },
      { id: 'ua-3', name: 'Flat Machine Press', sets: 3, reps: '8–10', note: 'Stable = push harder' },
      { id: 'ua-4', name: 'Chest-Supported Row (Heavy)', sets: 3, reps: '6–8' },
      { id: 'ua-5', name: 'Seated DB Shoulder Press', sets: 3, reps: '8–10' },
      { id: 'ua-6', name: 'Cable Triceps Pushdown', sets: 3, reps: '10–12' },
      { id: 'ua-7', name: 'Incline DB Curl', sets: 3, reps: '10–12' },
    ],
  },
  'lower-a': {
    name: 'Lower A',
    subtitle: 'Glutes + Hamstrings',
    icon: Zap,
    accent: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    accentText: 'text-emerald-400',
    exercises: [
      { id: 'la-1', name: 'Hack / Pendulum Squat', sets: 4, reps: '6–8', note: 'Main quad driver' },
      { id: 'la-2', name: 'Romanian Deadlift', sets: 3, reps: '8', note: 'DB or BB' },
      { id: 'la-3', name: 'Leg Press (Feet high)', sets: 3, reps: '10', note: 'Glute bias' },
      { id: 'la-4', name: 'Seated Leg Curl', sets: 3, reps: '12–15' },
      { id: 'la-5', name: 'Standing Calf Raise', sets: 4, reps: '12–15' },
      { id: 'la-6', name: 'Hanging Leg Raises', sets: 3, reps: '12–15' },
    ],
  },
  'upper-b': {
    name: 'Upper B',
    subtitle: 'Hypertrophy / Aesthetics',
    icon: Target,
    accent: 'bg-gradient-to-br from-violet-500 to-purple-700',
    accentText: 'text-violet-400',
    exercises: [
      { id: 'ub-1', name: 'Incline Machine Press / Cable Fly', sets: 3, reps: '10–12' },
      { id: 'ub-2', name: 'Lat Pulldown', sets: 3, reps: '10–12', note: 'Neutral or wide' },
      { id: 'ub-3', name: 'Lateral Raises', sets: 4, reps: '12–20', note: 'Slow + controlled' },
      { id: 'ub-4', name: 'Rear Delt Fly (Machine)', sets: 3, reps: '15–20' },
      { id: 'ub-5', name: 'Overhead Cable Tri Ext', sets: 3, reps: '12–15' },
      { id: 'ub-6', name: 'Preacher / Cable Curl', sets: 3, reps: '12–15' },
      { id: 'ub-7', name: 'Face Pulls', sets: 2, reps: '15–20' },
    ],
  },
  'lower-b': {
    name: 'Lower B',
    subtitle: 'Quad Focus + Glute Finish',
    icon: Dumbbell,
    accent: 'bg-gradient-to-br from-orange-500 to-rose-700',
    accentText: 'text-orange-400',
    exercises: [
      { id: 'lb-1', name: 'Hack Squat (higher reps)', sets: 3, reps: '10–12' },
      { id: 'lb-2', name: 'Leg Press (Feet low)', sets: 3, reps: '12–15' },
      { id: 'lb-3', name: 'Hip Thrust', sets: 3, reps: '10–12', note: 'Machine or BB' },
      { id: 'lb-4', name: 'Leg Extension', sets: 3, reps: '12–15', note: 'Pause at top' },
      { id: 'lb-5', name: 'Seated Calf Raise', sets: 4, reps: '12–15' },
      { id: 'lb-6', name: 'Cable Crunch', sets: 3, reps: '15' },
    ],
  },
};

const DEFAULT_REST = 90;
const STORAGE_KEY = 'workout-data-v1';
const SET_GRID = { gridTemplateColumns: '28px 1fr 1fr 44px' };

function vibrate(ms) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
}

export default function App() {
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);
  const [data, setData] = useState({ history: [], lastSession: {}, active: {} });
  const [loading, setLoading] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const restRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res?.value) setData(JSON.parse(res.value));
      } catch (e) {
        // key not found is fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Storage save failed', e);
    }
  }, []);

  const startWorkout = (workoutId) => {
    if (!data.active?.[workoutId]) {
      const sets = {};
      WORKOUTS[workoutId].exercises.forEach((ex) => {
        sets[ex.id] = Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false }));
      });
      persist({
        ...data,
        active: { ...(data.active || {}), [workoutId]: { startedAt: Date.now(), sets } },
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

  const finishWorkout = (workoutId) => {
    const active = data.active[workoutId];
    if (!active) return;
    const session = { workoutId, startedAt: active.startedAt, finishedAt: Date.now(), sets: active.sets };
    const newLast = { ...data.lastSession };
    Object.entries(active.sets).forEach(([exId, arr]) => {
      const done = arr.filter((s) => s.done && s.weight);
      if (done.length) newLast[exId] = done.map((s) => ({ weight: s.weight, reps: s.reps }));
    });
    const newActive = { ...data.active };
    delete newActive[workoutId];
    persist({
      history: [session, ...data.history].slice(0, 200),
      lastSession: newLast,
      active: newActive,
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

  const startRest = (sec = DEFAULT_REST) => {
    setRestSeconds(sec);
    if (restRef.current) clearInterval(restRef.current);
    restRef.current = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          clearInterval(restRef.current);
          vibrate([100, 60, 100]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stopRest = () => {
    if (restRef.current) clearInterval(restRef.current);
    setRestSeconds(0);
  };

  const adjustRest = (delta) => setRestSeconds((s) => Math.max(0, s + delta));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {currentWorkoutId ? (
        <WorkoutView
          workoutId={currentWorkoutId}
          active={data.active[currentWorkoutId]}
          lastSession={data.lastSession}
          onBack={() => setCurrentWorkoutId(null)}
          onUpdateSet={(exId, idx, patch) => updateSet(currentWorkoutId, exId, idx, patch)}
          onFinish={() => finishWorkout(currentWorkoutId)}
          onCancel={() => cancelWorkout(currentWorkoutId)}
          onCompleteSet={() => {
            vibrate(40);
            startRest();
          }}
        />
      ) : (
        <HomeView active={data.active || {}} history={data.history || []} onSelect={startWorkout} />
      )}
      {restSeconds > 0 && (
        <RestBar
          seconds={restSeconds}
          onDismiss={stopRest}
          onAdd={() => adjustRest(30)}
          onSub={() => adjustRest(-15)}
        />
      )}
    </div>
  );
}

function HomeView({ active, history, onSelect }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter((h) => (h.finishedAt || 0) > weekAgo).length;

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-16">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Session</div>
        <h1 className="text-3xl font-bold tracking-tight">Pick your workout</h1>
        <div className="mt-3 text-sm text-slate-400">
          {thisWeek > 0 ? (
            <>
              You've hit <span className="text-emerald-400 font-semibold">{thisWeek}</span>{' '}
              {thisWeek === 1 ? 'session' : 'sessions'} this week.
            </>
          ) : (
            "Let's get the first session in."
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Object.entries(WORKOUTS).map(([id, w]) => {
          const Icon = w.icon;
          const a = active[id];
          const inProg = !!a;
          const done = inProg ? Object.values(a.sets).flat().filter((s) => s.done).length : 0;
          const total = w.exercises.reduce((acc, e) => acc + e.sets, 0);
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`${w.accent} relative overflow-hidden rounded-2xl p-5 text-left transition active:scale-[0.98] shadow-lg shadow-black/30`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/15 backdrop-blur rounded-xl p-3">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.25} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">{w.name}</h2>
                    {inProg && (
                      <span className="text-xs uppercase tracking-wider font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                        {done}/{total}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/80">{w.subtitle}</div>
                  <div className="text-xs text-white/60 mt-1">{w.exercises.length} exercises</div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/70 rotate-180" />
              </div>
              <div className="absolute -right-6 -bottom-8 opacity-10">
                <Icon className="w-32 h-32 text-white" />
              </div>
            </button>
          );
        })}
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Recent</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((h, i) => {
              const w = WORKOUTS[h.workoutId];
              if (!w) return null;
              const done = Object.values(h.sets || {}).flat().filter((s) => s.done).length;
              const d = new Date(h.finishedAt);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-xs text-slate-500">
                      {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{done} sets</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutView({ workoutId, active, lastSession, onBack, onUpdateSet, onFinish, onCancel, onCompleteSet }) {
  const w = WORKOUTS[workoutId];
  const all = Object.values(active.sets).flat();
  const done = all.filter((s) => s.done).length;
  const total = all.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto pb-36">
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-900 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-400 -ml-1 py-1 active:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Cancel this workout? Your logged sets will be discarded.')) onCancel();
            }}
            className="text-xs text-slate-500 active:text-rose-400"
          >
            Cancel
          </button>
        </div>
        <h1 className="text-2xl font-bold">{w.name}</h1>
        <p className={`text-sm ${w.accentText}`}>{w.subtitle}</p>
        <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${w.accent} transition-all duration-300`} style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-slate-500 mt-1.5">
          {done} / {total} sets complete
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {w.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            sets={active.sets[ex.id] || []}
            lastSession={lastSession[ex.id]}
            onUpdateSet={(idx, patch) => onUpdateSet(ex.id, idx, patch)}
            onCompleteSet={onCompleteSet}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-6 pb-6 px-5 z-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => {
              if (done === 0 && !confirm('No sets completed. Finish anyway?')) return;
              onFinish();
            }}
            className={`w-full ${w.accent} text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/40 active:scale-[0.99] transition`}
          >
            Finish workout
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, sets, lastSession, onUpdateSet, onCompleteSet }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <h3 className="font-bold text-base leading-tight">{exercise.name}</h3>
        <div className="text-xs text-slate-400 mt-0.5">
          {exercise.sets} × {exercise.reps}
          {exercise.note && <span className="text-slate-500"> · {exercise.note}</span>}
        </div>
        {lastSession && lastSession.length > 0 && (
          <div className="text-xs text-slate-500 mt-1.5 font-mono tabular-nums">
            Last: {lastSession.map((s) => `${s.weight}×${s.reps}`).join(' · ')}
          </div>
        )}
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        <div className="grid gap-2 px-1 text-xs uppercase tracking-wider text-slate-600 font-semibold" style={SET_GRID}>
          <div className="text-center">#</div>
          <div>Weight</div>
          <div>Reps</div>
          <div />
        </div>
        {sets.map((s, idx) => (
          <SetRow
            key={idx}
            index={idx}
            set={s}
            prev={lastSession?.[idx]}
            onChange={(patch) => onUpdateSet(idx, patch)}
            onComplete={onCompleteSet}
          />
        ))}
      </div>
    </div>
  );
}

function SetRow({ index, set, prev, onChange, onComplete }) {
  const isDone = set.done;
  const canComplete = set.weight && set.reps;

  const handleCheck = () => {
    if (isDone) {
      onChange({ done: false });
      return;
    }
    if (canComplete) {
      onChange({ done: true });
      onComplete();
      return;
    }
    if (prev && prev.weight && prev.reps) {
      onChange({
        weight: set.weight || String(prev.weight),
        reps: set.reps || String(prev.reps),
        done: true,
      });
      onComplete();
    }
  };

  return (
    <div
      className={`grid gap-2 items-center rounded-xl px-2 py-2 transition ${
        isDone
          ? 'bg-emerald-500/10 border border-emerald-500/30'
          : 'bg-slate-800/40 border border-transparent'
      }`}
      style={SET_GRID}
    >
      <div className={`text-center text-sm font-semibold ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
        {index + 1}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={set.weight}
        onChange={(e) => onChange({ weight: e.target.value.replace(/[^\d.]/g, '') })}
        placeholder={prev?.weight ? String(prev.weight) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? 'bg-transparent text-emerald-300'
            : 'bg-slate-900 border border-slate-700 focus:border-slate-500 text-white placeholder:text-slate-600'
        }`}
      />
      <input
        type="text"
        inputMode="numeric"
        value={set.reps}
        onChange={(e) => onChange({ reps: e.target.value.replace(/[^\d]/g, '') })}
        placeholder={prev?.reps ? String(prev.reps) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? 'bg-transparent text-emerald-300'
            : 'bg-slate-900 border border-slate-700 focus:border-slate-500 text-white placeholder:text-slate-600'
        }`}
      />
      <button
        onClick={handleCheck}
        className={`h-10 w-10 rounded-lg flex items-center justify-center transition active:scale-95 ${
          isDone
            ? 'bg-emerald-500 text-white'
            : canComplete || (prev && prev.weight && prev.reps)
            ? 'bg-slate-700 text-white'
            : 'bg-slate-800 text-slate-600'
        }`}
      >
        <Check className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
  );
}

function RestBar({ seconds, onDismiss, onAdd, onSub }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const pct = Math.max(0, Math.min(100, (seconds / DEFAULT_REST) * 100));

  return (
    <div className="fixed bottom-24 left-0 right-0 px-5 z-20 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Timer className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <div className="font-mono text-lg font-bold tabular-nums flex-1">
              {mm}:{ss.toString().padStart(2, '0')}
            </div>
            <button
              onClick={onSub}
              className="h-9 px-3 text-sm font-semibold bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              −15
            </button>
            <button
              onClick={onAdd}
              className="h-9 px-3 text-sm font-semibold bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              +30
            </button>
            <button
              onClick={onDismiss}
              className="h-9 w-9 flex items-center justify-center bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
