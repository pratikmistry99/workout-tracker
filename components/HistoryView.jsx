import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { WORKOUT_COLORS } from '../data/workouts';

function formatDuration(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function HistoryView({ history, workouts, onBack }) {
  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-16">
      <div className="flex items-center gap-3 mb-8 animate-fadeSlideUp">
        <button onClick={onBack} className="flex items-center gap-1 text-zinc-500 -ml-1 py-1 active:text-zinc-100">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">Back</span>
        </button>
        <h1 className="font-display text-2xl text-zinc-100">History</h1>
        <span className="text-zinc-600 font-mono text-xs tabular-nums">{history.length}</span>
      </div>

      {history.length === 0 ? (
        <div className="text-zinc-600 text-center py-20 text-sm">No sessions logged yet.</div>
      ) : (
        <div className="space-y-px">
          {history.map((h, idx) => {
            const w = workouts[h.workoutId];
            if (!w) return null;
            const colors = WORKOUT_COLORS[h.workoutId] || {};
            const allSets = Object.values(h.sets || {}).flat();
            const done = allSets.filter((s) => s.done).length;
            const d = new Date(h.finishedAt);
            const duration = h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;

            return (
              <div key={h.finishedAt} className="flex items-start gap-3 py-3 border-b border-zinc-800/50 animate-fadeSlideUp" style={{ animationDelay: `${Math.min(idx, 10) * 40}ms` }}>
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colors.dot || 'bg-zinc-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-200">{w.name}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">
                    {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    {duration && <span> · {duration}</span>}
                  </div>
                  {h.notes ? (
                    <div className="text-xs text-zinc-500 mt-1 italic truncate">"{h.notes}"</div>
                  ) : null}
                </div>
                <div className="font-mono text-xs tabular-nums text-zinc-500 mt-0.5">{done} sets</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
