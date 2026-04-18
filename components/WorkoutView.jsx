import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { WORKOUTS } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';

export function WorkoutView({
  workoutId,
  active,
  lastSession,
  prs,
  onBack,
  onUpdateSet,
  onFinish,
  onCancel,
  onCompleteSet,
}) {
  const [notes, setNotes] = useState(active.notes || '');
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
          <div
            className={`h-full ${w.accent} transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
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
            pr={prs[ex.id]}
            onUpdateSet={(idx, patch) => onUpdateSet(ex.id, idx, patch)}
            onCompleteSet={onCompleteSet}
          />
        ))}

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
            Session Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel? Any PRs, form cues, weight adjustments..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-slate-500 resize-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-6 pb-6 px-5 z-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => {
              if (done === 0 && !confirm('No sets completed. Finish anyway?')) return;
              onFinish(notes);
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
