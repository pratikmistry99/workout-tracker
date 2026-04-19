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
        <button onClick={onBack} className="flex items-center gap-1.5 text-zinc-400 -ml-1 py-2 pr-3 active:text-zinc-100 transition">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="font-display text-2xl text-zinc-100">History</h1>
        <span className="text-zinc-500 font-mono text-sm tabular-nums font-medium">{history.length}</span>
      </div>

      {history.length === 0 ? (
        <div className="text-zinc-500 text-center py-20 text-base">No sessions logged yet.</div>
      ) : (
        <div className="space-y-2">
          {history.map((h, idx) => {
            const w = workouts[h.workoutId];
            if (!w) return null;
            const colors = WORKOUT_COLORS[h.workoutId] || {};
            const allSets = Object.values(h.sets || {}).flat();
            const done = allSets.filter((s) => s.done).length;
            const d = new Date(h.finishedAt);
            const duration = h.startedAt && h.finishedAt ? formatDuration(h.finishedAt - h.startedAt) : null;

            return (
              <div key={h.finishedAt} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40 animate-fadeSlideUp" style={{ animationDelay: `${Math.min(idx, 10) * 40}ms` }}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colors.dot || 'bg-zinc-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-zinc-100">{w.name}</div>
                  <div className="text-sm text-zinc-500 mt-0.5">
                    {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    {duration && <span> · {duration}</span>}
                  </div>
                  {h.notes ? (
                    <div className="text-sm text-zinc-400 mt-1.5 italic truncate">"{h.notes}"</div>
                  ) : null}
                </div>
                <div className="font-mono text-sm tabular-nums text-zinc-400 mt-0.5 font-medium">{done} sets</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
