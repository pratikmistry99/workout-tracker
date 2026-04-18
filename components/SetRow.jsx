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
      className={`grid gap-2 items-center rounded-lg px-2 py-1.5 transition ${
        isNewPR
          ? 'bg-amber-500/8 border border-amber-500/25'
          : isDone
          ? 'bg-emerald-500/8 border border-emerald-500/20'
          : 'bg-zinc-800/30 border border-transparent'
      }`}
      style={SET_GRID}
    >
      <div
        className={`text-center font-mono text-xs font-medium tabular-nums ${
          isNewPR ? 'text-amber-400' : isDone ? 'text-emerald-400' : 'text-zinc-600'
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
        className={`w-full rounded-md px-2 py-1.5 text-center font-mono text-sm tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-amber-300' : 'text-emerald-300'}`
            : 'bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-zinc-100 placeholder:text-zinc-700'
        }`}
      />
      <input
        type="text"
        inputMode="numeric"
        value={set.reps}
        onChange={(e) => onChange({ reps: e.target.value.replace(/[^\d]/g, '') })}
        placeholder={prev?.reps ? String(prev.reps) : '—'}
        disabled={isDone}
        className={`w-full rounded-md px-2 py-1.5 text-center font-mono text-sm tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-amber-300' : 'text-emerald-300'}`
            : 'bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-zinc-100 placeholder:text-zinc-700'
        }`}
      />
      <button
        onClick={handleCheck}
        className={`h-8 w-8 rounded-md flex items-center justify-center transition active:scale-95 ${
          isNewPR
            ? 'bg-amber-500 text-white'
            : isDone
            ? 'bg-emerald-500 text-white'
            : canComplete || (prev?.weight && prev?.reps)
            ? 'bg-zinc-700 text-zinc-300'
            : 'bg-zinc-800/50 text-zinc-700'
        }`}
      >
        <Check className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );
}
