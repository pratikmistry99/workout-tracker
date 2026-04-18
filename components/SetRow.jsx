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
      className={`grid gap-2 items-center rounded-xl px-2 py-2 transition ${
        isNewPR
          ? 'bg-yellow-500/10 border border-yellow-500/40'
          : isDone
          ? 'bg-emerald-500/10 border border-emerald-500/30'
          : 'bg-slate-800/40 border border-transparent'
      }`}
      style={SET_GRID}
    >
      <div
        className={`text-center text-sm font-semibold ${
          isNewPR ? 'text-yellow-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
        }`}
      >
        {isNewPR ? '★' : index + 1}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={set.weight}
        onChange={(e) => onChange({ weight: e.target.value.replace(/[^\d.]/g, '') })}
        placeholder={prev?.weight ? String(prev.weight) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-yellow-300' : 'text-emerald-300'}`
            : 'bg-slate-900 border border-slate-700 focus:border-slate-500 text-white placeholder:text-slate-600'
        }`}
      />
      <input
        type="text"
        inputMode="numeric"
        value={set.reps}
        onChange={(e) => onChange({ reps: e.target.value.replace(/[^\d]/g, '') })}
        placeholder={prev?.reps ? String(prev.reps) : '—'}
        disabled={isDone}
        className={`w-full rounded-lg px-2 py-2 text-center font-mono text-base tabular-nums outline-none transition min-w-0 ${
          isDone
            ? `bg-transparent ${isNewPR ? 'text-yellow-300' : 'text-emerald-300'}`
            : 'bg-slate-900 border border-slate-700 focus:border-slate-500 text-white placeholder:text-slate-600'
        }`}
      />
      <button
        onClick={handleCheck}
        className={`h-10 w-10 rounded-lg flex items-center justify-center transition active:scale-95 ${
          isNewPR
            ? 'bg-yellow-500 text-white'
            : isDone
            ? 'bg-emerald-500 text-white'
            : canComplete || (prev?.weight && prev?.reps)
            ? 'bg-slate-700 text-white'
            : 'bg-slate-800 text-slate-600'
        }`}
      >
        <Check className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
  );
}
