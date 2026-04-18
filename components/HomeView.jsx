import React from 'react';
import { ChevronRight, Calculator, Trophy, Clock } from 'lucide-react';
import { WORKOUT_COLORS } from '../data/workouts';

function formatDuration(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function computeWeeklyVolume(history) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let vol = 0;
  for (const h of history) {
    if ((h.finishedAt || 0) <= weekAgo) break;
    for (const sets of Object.values(h.sets || {})) {
      for (const s of sets) {
        if (s.done && s.weight && s.reps) {
          vol += parseFloat(s.weight) * parseInt(s.reps);
        }
      }
    }
  }
  return vol;
}

function computeStreak(history) {
  if (history.length === 0) return 0;
  let streak = 0;
  const now = new Date();
  let weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  for (let i = 0; i < 52; i++) {
    const wEnd = weekStart.getTime() + 7 * 24 * 60 * 60 * 1000;
    const hasSession = history.some((h) => h.finishedAt >= weekStart.getTime() && h.finishedAt < wEnd);
    if (hasSession) {
      streak++;
    } else if (i > 0) {
      break;
    }
    weekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  return streak;
}

export function HomeView({ active, history, workouts, onSelect, onViewHistory, onViewPRs, onPlateCalc }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter((h) => (h.finishedAt || 0) > weekAgo).length;
  const volume = computeWeeklyVolume(history);
  const streak = computeStreak(history);

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-zinc-100 tracking-tight">Workout</h1>
        <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-zinc-800/30 rounded-lg overflow-hidden mb-10">
        <div className="bg-[#09090b] px-4 py-3">
          <div className="font-display text-2xl text-zinc-100 tabular-nums">{thisWeek}</div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">This week</div>
        </div>
        <div className="bg-[#09090b] px-4 py-3">
          <div className="font-mono text-lg text-zinc-100 tabular-nums font-semibold">
            {volume > 0 ? `${(volume / 1000).toFixed(1)}k` : '—'}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">Volume lb</div>
        </div>
        <div className="bg-[#09090b] px-4 py-3">
          <div className="font-display text-2xl text-zinc-100 tabular-nums">{streak || '—'}</div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">Wk streak</div>
        </div>
      </div>

      {/* Workout list */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Programs</h2>
        </div>
        <div className="space-y-px">
          {Object.entries(workouts).map(([id, w]) => {
            const colors = WORKOUT_COLORS[id] || {};
            const a = active[id];
            const inProg = !!a;
            const done = inProg ? Object.values(a.sets).flat().filter((s) => s.done).length : 0;
            const total = w.exercises.reduce((acc, e) => acc + e.sets, 0);
            const last = history.find((h) => h.workoutId === id);
            const lastDate = last
              ? new Date(last.finishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : null;

            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="w-full flex items-center gap-3 py-3.5 border-b border-zinc-800/50 text-left active:bg-zinc-900/50 transition group"
              >
                <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${colors.dot || 'bg-zinc-700'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-zinc-100">{w.name}</span>
                    {inProg && (
                      <span className="font-mono text-[10px] tabular-nums text-emerald-400">
                        {done}/{total}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">{w.subtitle}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 font-mono tabular-nums">
                    {w.exercises.length} exercises{lastDate && <span> · {lastDate}</span>}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-active:text-zinc-500 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-2 mb-10">
        <button
          onClick={onViewPRs}
          className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-zinc-800/50 text-zinc-500 active:text-zinc-300 active:border-zinc-700 transition"
        >
          <Trophy className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-medium">Records</span>
        </button>
        <button
          onClick={onViewHistory}
          className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-zinc-800/50 text-zinc-500 active:text-zinc-300 active:border-zinc-700 transition"
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-medium">History</span>
        </button>
        <button
          onClick={onPlateCalc}
          className="flex flex-col items-center gap-1.5 py-3 rounded-lg border border-zinc-800/50 text-zinc-500 active:text-zinc-300 active:border-zinc-700 transition"
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-medium">Plates</span>
        </button>
      </div>

      {/* Recent sessions */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Recent</h2>
            {history.length > 5 && (
              <button onClick={onViewHistory} className="text-[10px] text-zinc-600 active:text-zinc-400 uppercase tracking-widest">
                All
              </button>
            )}
          </div>
          <div className="space-y-px">
            {history.slice(0, 5).map((h) => {
              const w = workouts[h.workoutId];
              if (!w) return null;
              const colors = WORKOUT_COLORS[h.workoutId] || {};
              const done = Object.values(h.sets || {}).flat().filter((s) => s.done).length;
              const d = new Date(h.finishedAt);
              const duration = h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;

              return (
                <div key={h.finishedAt} className="flex items-center gap-3 py-2.5 border-b border-zinc-800/30">
                  <div className={`w-1 h-1 rounded-full flex-shrink-0 ${colors.dot || 'bg-zinc-700'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-zinc-300">{w.name}</span>
                    <span className="text-xs text-zinc-600 ml-2">
                      {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {duration && ` · ${duration}`}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-zinc-600">{done}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
