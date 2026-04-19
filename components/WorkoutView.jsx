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
      <header className="sticky top-0 z-10 bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-800/50 px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-zinc-400 -ml-1 py-2 pr-3 active:text-zinc-100 transition">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onEditExercises}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800/60 active:bg-zinc-700 transition"
              title="Edit exercises"
            >
              <Settings className="w-4.5 h-4.5 text-zinc-400" />
            </button>
            <button
              onClick={() => {
                if (confirm('Cancel this workout? Your logged sets will be discarded.')) onCancel();
              }}
              className="text-xs uppercase tracking-widest text-zinc-500 active:text-red-400 font-medium py-2 px-2 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2.5">
          <h1 className="font-display text-2xl text-zinc-100">{workout.name}</h1>
          <span className={`text-sm ${colors.text || 'text-zinc-500'}`}>{workout.subtitle}</span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar || 'bg-zinc-600'} transition-all duration-300 rounded-full`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-zinc-400 font-medium">
            {done}/{total}
          </span>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {workout.exercises.map((ex, i) => {
          const sets = active.sets[ex.id] ||
            Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false }));
          return (
            <div key={ex.id} className="animate-fadeSlideUp" style={{ animationDelay: `${i * 60}ms` }}>
            <ExerciseCard
              exercise={ex}
              sets={sets}
              lastSession={lastSession[ex.id]}
              pr={prs[ex.id]}
              onUpdateSet={(idx, patch) => onUpdateSet(ex.id, idx, patch)}
              onCompleteSet={onCompleteSet}
            />
            </div>
          );
        })}

        <div className="border border-zinc-800/60 rounded-xl p-4 mt-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-2 block">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Form cues, weight adjustments, how it felt..."
            rows={3}
            className="w-full bg-transparent border-b border-zinc-800/50 focus:border-zinc-600 px-0 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none resize-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pt-8 pb-8 px-5 z-10">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => {
              if (done === 0 && !confirm('No sets completed. Finish anyway?')) return;
              onFinish(notes);
            }}
            className="w-full bg-blue-500 text-white font-semibold text-base py-4 rounded-2xl active:bg-blue-600 transition active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}
