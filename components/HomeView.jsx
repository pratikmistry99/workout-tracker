import React from 'react';
import { ChevronRight, Calculator, Trophy, Clock } from 'lucide-react';
import { WORKOUT_COLORS } from '../data/workouts';
import { AccountMenu } from './AccountMenu';

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

export function HomeView({ active, history, workouts, onSelect, onViewHistory, onViewPRs, onPlateCalc, user, onLogout }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter((h) => (h.finishedAt || 0) > weekAgo).length;
  const volume = computeWeeklyVolume(history);
  const streak = computeStreak(history);

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-20">
      {/* Header */}
      <div className="mb-8 animate-fadeSlideUp flex items-start justify-between relative z-30">
        <div>
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-4xl text-zinc-100 tracking-tight leading-tight">
            Welcome, <span className="text-blue-400">{user?.name || 'Athlete'}</span>
          </h1>
        </div>
        {user && <AccountMenu user={user} onLogout={onLogout} />}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-10 animate-fadeSlideUp" style={{ animationDelay: '80ms' }}>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl px-4 py-4">
          <div className="font-display text-3xl text-zinc-100 tabular-nums">{thisWeek}</div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-medium">This week</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl px-4 py-4">
          <div className="font-mono text-xl text-zinc-100 tabular-nums font-semibold mt-1">
            {volume > 0 ? `${(volume / 1000).toFixed(1)}k` : '—'}
          </div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-medium">Volume lb</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl px-4 py-4">
          <div className="font-display text-3xl text-zinc-100 tabular-nums">{streak || '—'}</div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1 font-medium">Wk streak</div>
        </div>
      </div>

      {/* Workout list */}
      <div className="mb-10 animate-fadeSlideUp" style={{ animationDelay: '160ms' }}>
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4">Programs</h2>
        <div className="space-y-2.5">
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
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition active:scale-[0.98] border ${
                  inProg
                    ? `${colors.bg || 'bg-zinc-800/50'} ${colors.border || 'border-zinc-700/50'}`
                    : 'bg-zinc-900/40 border-zinc-800/50 active:bg-zinc-800/60'
                }`}
              >
                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${colors.dot || 'bg-zinc-700'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-base font-medium text-zinc-100">{w.name}</span>
                    {inProg && (
                      <span className="font-mono text-xs tabular-nums text-emerald-400 font-semibold">
                        {done}/{total}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400 mt-0.5">{w.subtitle}</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono tabular-nums">
                    {w.exercises.length} exercises{lastDate && <span> · {lastDate}</span>}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-10 animate-fadeSlideUp" style={{ animationDelay: '240ms' }}>
        <button
          onClick={onViewPRs}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 text-zinc-400 active:text-amber-400 active:border-amber-500/30 active:bg-amber-500/5 transition active:scale-95"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-medium">Records</span>
        </button>
        <button
          onClick={onViewHistory}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 text-zinc-400 active:text-blue-400 active:border-blue-500/30 active:bg-blue-500/5 transition active:scale-95"
        >
          <Clock className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-medium">History</span>
        </button>
        <button
          onClick={onPlateCalc}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 text-zinc-400 active:text-purple-400 active:border-purple-500/30 active:bg-purple-500/5 transition active:scale-95"
        >
          <Calculator className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-medium">Plates</span>
        </button>
      </div>

      {/* Recent sessions */}
      {history.length > 0 && (
        <div className="animate-fadeSlideUp" style={{ animationDelay: '320ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Recent</h2>
            {history.length > 5 && (
              <button onClick={onViewHistory} className="text-xs text-zinc-500 active:text-zinc-300 uppercase tracking-widest font-medium py-1 px-2">
                All
              </button>
            )}
          </div>
          <div className="space-y-1">
            {history.slice(0, 5).map((h) => {
              const w = workouts[h.workoutId];
              if (!w) return null;
              const colors = WORKOUT_COLORS[h.workoutId] || {};
              const done = Object.values(h.sets || {}).flat().filter((s) => s.done).length;
              const d = new Date(h.finishedAt);
              const duration = h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;

              return (
                <div key={h.finishedAt} className="flex items-center gap-3 py-3 px-3 rounded-xl bg-zinc-900/20">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot || 'bg-zinc-700'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-zinc-200 font-medium">{w.name}</span>
                    <span className="text-xs text-zinc-500 ml-2">
                      {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {duration && ` · ${duration}`}
                    </span>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-zinc-500 font-medium">{done} sets</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
