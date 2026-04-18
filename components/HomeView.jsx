import React from 'react';
import { ChevronLeft, Calculator } from 'lucide-react';
import { WORKOUTS } from '../data/workouts';

function formatDuration(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function HomeView({ active, history, onSelect, onViewHistory, onPlateCalc }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter((h) => (h.finishedAt || 0) > weekAgo).length;

  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-16">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Session
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Pick your workout</h1>
          </div>
          <button
            onClick={onPlateCalc}
            className="h-10 w-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-xl transition mt-1"
            title="Plate Calculator"
          >
            <Calculator className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-400">
          {thisWeek > 0 ? (
            <>
              You've hit{' '}
              <span className="text-emerald-400 font-semibold">{thisWeek}</span>{' '}
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Recent
            </h3>
            {history.length > 5 && (
              <button
                onClick={onViewHistory}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                View all ({history.length})
              </button>
            )}
          </div>
          <div className="space-y-2">
            {history.slice(0, 5).map((h) => {
              const w = WORKOUTS[h.workoutId];
              if (!w) return null;
              const done = Object.values(h.sets || {}).flat().filter((s) => s.done).length;
              const d = new Date(h.finishedAt);
              const duration =
                h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;
              return (
                <div
                  key={h.finishedAt}
                  className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-xs text-slate-500">
                      {d.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {duration && <span> · {duration}</span>}
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
