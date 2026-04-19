import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, X, RotateCcw } from 'lucide-react';

export function EditExercises({ workoutName, exercises, defaultExercises, onSave, onReset, onClose }) {
  const [items, setItems] = useState(() => exercises.map((e) => ({ ...e })));

  const move = (idx, dir) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
  };

  const update = (idx, field, value) => {
    setItems((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  const remove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: '',
        sets: 3,
        reps: '8–10',
        note: '',
        restTime: 90,
      },
    ]);
  };

  const isCustomized = JSON.stringify(items.map(({ id, name, sets, reps, note, restTime }) => ({ id, name, sets, reps, note, restTime })))
    !== JSON.stringify(defaultExercises.map(({ id, name, sets, reps, note, restTime }) => ({ id, name, sets, reps, note, restTime })));

  const handleSave = () => {
    const valid = items.filter((e) => e.name.trim());
    onSave(valid);
  };

  const handleReset = () => {
    if (confirm('Reset to default exercises? Your customizations will be lost.')) {
      setItems(defaultExercises.map((e) => ({ ...e })));
      onReset();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#09090b] z-30 overflow-y-auto">
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Editing</div>
            <h2 className="font-display text-xl text-zinc-100">{workoutName}</h2>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-zinc-700 transition"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((ex, idx) => (
            <div key={ex.id} className="border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-800 active:bg-zinc-700 disabled:opacity-20 transition"
                  >
                    <ChevronUp className="w-4 h-4 text-zinc-300" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-800 active:bg-zinc-700 disabled:opacity-20 transition"
                  >
                    <ChevronDown className="w-4 h-4 text-zinc-300" />
                  </button>
                </div>
                <input
                  value={ex.name}
                  onChange={(e) => update(idx, 'name', e.target.value)}
                  placeholder="Exercise name"
                  className="flex-1 bg-transparent border-b border-zinc-700/50 focus:border-blue-500/50 px-1 py-2 text-base text-zinc-100 placeholder:text-zinc-600 outline-none min-w-0 transition"
                />
                <button
                  onClick={() => remove(idx)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800/50 active:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4 text-zinc-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 ml-12">
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-1.5">Sets</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ex.sets}
                    onChange={(e) => update(idx, 'sets', parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-center font-mono text-sm tabular-nums text-zinc-200 outline-none focus:border-blue-500/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-1.5">Reps</label>
                  <input
                    value={ex.reps}
                    onChange={(e) => update(idx, 'reps', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-center font-mono text-sm text-zinc-200 outline-none focus:border-blue-500/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-1.5">Rest (s)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ex.restTime}
                    onChange={(e) => update(idx, 'restTime', parseInt(e.target.value) || 60)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-center font-mono text-sm tabular-nums text-zinc-200 outline-none focus:border-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="ml-12 mt-3">
                <input
                  value={ex.note || ''}
                  onChange={(e) => update(idx, 'note', e.target.value)}
                  placeholder="Note (optional)"
                  className="w-full bg-transparent border-b border-zinc-800/50 focus:border-zinc-600 px-1 py-2 text-sm text-zinc-400 placeholder:text-zinc-600 outline-none transition"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2.5 py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-sm text-zinc-400 active:text-blue-400 active:border-blue-500/30 transition mb-6"
        >
          <Plus className="w-4 h-4" />
          Add exercise
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white font-semibold text-base py-3.5 rounded-2xl active:bg-blue-600 transition active:scale-[0.98]"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 text-zinc-300 font-medium text-base py-3.5 rounded-2xl active:bg-zinc-700 transition active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>

        {isCustomized && (
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 mt-4 py-3 text-sm text-zinc-500 active:text-zinc-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
        )}
      </div>
    </div>
  );
}
