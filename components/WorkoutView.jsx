import React, { useState } from 'react';
import { ChevronLeft, Settings } from 'lucide-react';
import { WORKOUT_COLORS } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';

export function WorkoutView({
  workoutId,
  workout,
  active,
  lastSession,
  prs,
  onBack,
  onUpdateSet,
  onFinish,
  onCancel,
  onCompleteSet,
  onEditExercises,
}) {
  const [notes, setNotes] = useState(active.notes || '');
  const colors = WORKOUT_COLORS[workoutId] || {};

  const all = Object.values(active.sets).flat();
  const done = all.filter((s) => s.done).length;
  const total = all.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto pb-32">
      <header className="sticky top-0 z-10 bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-800/50 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1 text-zinc-500 -ml-1 py-1 active:text-zinc-100">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditExercises}
              className="h-7 w-7 flex items-center justify-center rounded bg-zinc-800/50 active:bg-zinc-700"
              title="Edit exercises"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button
              onClick={() => {
                if (confirm('Cancel this workout? Your logged sets will be discarded.')) onCancel();
              }}
              className="text-[10px] uppercase tracking-widest text-zinc-600 active:text-red-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h1 className="font-display text-2xl text-zinc-100">{workout.name}</h1>
          <span className={`text-xs ${colors.text || 'text-zinc-500'}`}>{workout.subtitle}</span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-px bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar || 'bg-zinc-600'} transition-all duration-300`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-zinc-500">
            {done}/{total}
          </span>
        </div>
      </header>

      <div className="px-4 py-4 space-y-2">
        {workout.exercises.map((ex) => {
          const sets = active.sets[ex.id] ||
            Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false }));
          return (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              sets={sets}
              lastSession={lastSession[ex.id]}
              pr={prs[ex.id]}
              onUpdateSet={(idx, patch) => onUpdateSet(ex.id, idx, patch)}
              onCompleteSet={onCompleteSet}
            />
          );
        })}

        <div className="border border-zinc-800/50 rounded-lg p-3 mt-2">
          <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium mb-1.5 block">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Form cues, weight adjustments, how it felt..."
            rows={2}
            className="w-full bg-transparent border-b border-zinc-800/50 focus:border-zinc-700 px-0 py-1 text-xs text-zinc-300 placeholder:text-zinc-700 outline-none resize-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pt-8 pb-6 px-5 z-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => {
              if (done === 0 && !confirm('No sets completed. Finish anyway?')) return;
              onFinish(notes);
            }}
            className="w-full bg-zinc-100 text-zinc-900 font-medium text-sm py-3.5 rounded-lg active:bg-zinc-300 transition"
          >
            Finish workout
          </button>
        </div>
      </div>
    </div>
  );
}
