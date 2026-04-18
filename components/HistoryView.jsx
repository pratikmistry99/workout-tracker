import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { WORKOUTS } from '../data/workouts';

function formatDuration(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function HistoryView({ history, onBack }) {
  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-400 -ml-1 py-1 active:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-bold">History</h1>
        <span className="text-slate-500 text-sm">({history.length} sessions)</span>
      </div>

      {history.length === 0 ? (
        <div className="text-slate-500 text-center py-16">No sessions yet.</div>
      ) : (
        <div className="space-y-2">
          {history.map((h) => {
            const w = WORKOUTS[h.workoutId];
            if (!w) return null;
            const allSets = Object.values(h.sets || {}).flat();
            const done = allSets.filter((s) => s.done).length;
            const total = allSets.length;
            const d = new Date(h.finishedAt);
            const duration =
              h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;

            return (
              <div
                key={h.finishedAt}
                className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {d.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {duration && <span> · {duration}</span>}
                    </div>
                    {h.notes ? (
                      <div className="text-xs text-slate-400 mt-1.5 italic truncate">
                        "{h.notes}"
                      </div>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-400 text-right flex-shrink-0">
                    {done}/{total} sets
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
