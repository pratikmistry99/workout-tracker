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
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">Editing</div>
            <h2 className="font-display text-xl text-zinc-100">{workoutName}</h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded bg-zinc-800 active:bg-zinc-700"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {items.map((ex, idx) => (
            <div key={ex.id} className="border border-zinc-800 rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="h-5 w-5 flex items-center justify-center rounded bg-zinc-800 active:bg-zinc-700 disabled:opacity-20"
                  >
                    <ChevronUp className="w-3 h-3 text-zinc-400" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="h-5 w-5 flex items-center justify-center rounded bg-zinc-800 active:bg-zinc-700 disabled:opacity-20"
                  >
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>
                </div>
                <input
                  value={ex.name}
                  onChange={(e) => update(idx, 'name', e.target.value)}
                  placeholder="Exercise name"
                  className="flex-1 bg-transparent border-b border-zinc-800 focus:border-zinc-600 px-1 py-1 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none min-w-0"
                />
                <button
                  onClick={() => remove(idx)}
                  className="h-7 w-7 flex items-center justify-center rounded bg-zinc-800/50 active:bg-red-500/20 mt-0.5"
                >
                  <Trash2 className="w-3 h-3 text-zinc-600 active:text-red-400" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 ml-7">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-600 block mb-0.5">Sets</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ex.sets}
                    onChange={(e) => update(idx, 'sets', parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800/50 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs tabular-nums text-zinc-200 outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-600 block mb-0.5">Reps</label>
                  <input
                    value={ex.reps}
                    onChange={(e) => update(idx, 'reps', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs text-zinc-200 outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-600 block mb-0.5">Rest (s)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ex.restTime}
                    onChange={(e) => update(idx, 'restTime', parseInt(e.target.value) || 60)}
                    className="w-full bg-zinc-800/50 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs tabular-nums text-zinc-200 outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="ml-7 mt-2">
                <input
                  value={ex.note || ''}
                  onChange={(e) => update(idx, 'note', e.target.value)}
                  placeholder="Note (optional)"
                  className="w-full bg-transparent border-b border-zinc-800/50 focus:border-zinc-700 px-1 py-0.5 text-xs text-zinc-400 placeholder:text-zinc-700 outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-zinc-800 rounded-lg text-xs text-zinc-500 active:text-zinc-300 active:border-zinc-600 transition mb-6"
        >
          <Plus className="w-3.5 h-3.5" />
          Add exercise
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-zinc-100 text-zinc-900 font-medium text-sm py-2.5 rounded-lg active:bg-zinc-300 transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 text-zinc-300 font-medium text-sm py-2.5 rounded-lg active:bg-zinc-700 transition"
          >
            Cancel
          </button>
        </div>

        {isCustomized && (
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 mt-3 py-2 text-xs text-zinc-600 active:text-zinc-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to defaults
          </button>
        )}
      </div>
    </div>
  );
}
