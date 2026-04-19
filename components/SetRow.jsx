import React from 'react';
import { Check } from 'lucide-react';
import { SET_GRID } from '../data/workouts';

export function SetRow({ index, set, prev, pr, onChange, onComplete }) {
  const isDone = set.done;
  const canComplete = set.weight && set.reps;
  const isNewPR = isDone && set.weight && pr !== undefined && parseFloat(set.weight) > pr;

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
    if (prev?.weight && prev?.reps) {
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
      className={`grid gap-2.5 items-center rounded-xl px-3 py-2 transition ${
        isNewPR
          ? 'bg-amber-500/10 border border-amber-500/30'
          : isDone
          ? 'bg-emerald-500/10 border border-emerald-500/25'
          : 'bg-zinc-800/40 border border-zinc-800/60'
      }`}
      style={SET_GRID}
    >
      <div
        className={`text-center font-mono text-sm font-semibold tabular-nums ${
          isNewPR ? 'text-amber-400' : isDone ? 'text-emerald-400' : 'text-zinc-500'
        }`}
      >
        {isNewPR ? 'PR' : index + 1}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={set.weight}
        onChange={(e) => onChange({ weight: e.target.value.replace(/[^\d.]/g, '') })}
        placeholder={prev?.weight ? String(prev.weight) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2.5 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-amber-300' : 'text-emerald-300'}`
            : 'bg-zinc-900/80 border border-zinc-700/50 focus:border-blue-500/50 text-zinc-100 placeholder:text-zinc-600'
        }`}
      />
      <input
        type="text"
        inputMode="numeric"
        value={set.reps}
        onChange={(e) => onChange({ reps: e.target.value.replace(/[^\d]/g, '') })}
        placeholder={prev?.reps ? String(prev.reps) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2.5 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-amber-300' : 'text-emerald-300'}`
            : 'bg-zinc-900/80 border border-zinc-700/50 focus:border-blue-500/50 text-zinc-100 placeholder:text-zinc-600'
        }`}
      />
      <button
        onClick={handleCheck}
        className={`h-11 w-11 rounded-xl flex items-center justify-center transition active:scale-90 ${
          isNewPR
            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
            : isDone
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            : canComplete || (prev?.weight && prev?.reps)
            ? 'bg-zinc-700 text-zinc-200 active:bg-zinc-600'
            : 'bg-zinc-800/60 text-zinc-600'
        }`}
      >
        <Check className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
