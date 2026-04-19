import React, { useState } from 'react';
import { X } from 'lucide-react';

const PLATES = {
  lb: [45, 35, 25, 10, 5, 2.5],
  kg: [20, 15, 10, 5, 2.5, 1.25],
};

const BAR_OPTIONS = {
  lb: [
    { label: '45 lb Olympic', value: 45 },
    { label: '35 lb Women\'s', value: 35 },
  ],
  kg: [
    { label: '20 kg Olympic', value: 20 },
    { label: '15 kg Women\'s', value: 15 },
  ],
};

function calcPlates(target, barWeight, plates) {
  const t = parseFloat(target);
  if (!t || t <= barWeight) return [];
  let remaining = Math.round(((t - barWeight) / 2) * 1000) / 1000;
  const result = [];
  for (const plate of plates) {
    const count = Math.floor(remaining / plate + 0.001);
    if (count > 0) {
      result.push({ weight: plate, count });
      remaining = Math.round((remaining - count * plate) * 1000) / 1000;
    }
  }
  return result;
}

export function PlateCalculator({ onClose }) {
  const [unit, setUnit] = useState('lb');
  const [barWeight, setBarWeight] = useState(45);
  const [target, setTarget] = useState('');

  const targetNum = parseFloat(target);
  const plateList = target ? calcPlates(target, barWeight, PLATES[unit]) : [];
  const perSide = targetNum > barWeight ? ((targetNum - barWeight) / 2).toFixed(1) : null;

  return (
    <div className="fixed inset-0 bg-black/80 z-30 flex items-end justify-center px-4 pb-6" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl">Plate Calculator</h2>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 active:bg-zinc-700 transition">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex bg-zinc-800/50 rounded-xl p-1 mb-4">
          {['lb', 'kg'].map((u) => (
            <button
              key={u}
              onClick={() => { setUnit(u); setBarWeight(u === 'lb' ? 45 : 20); setTarget(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition ${
                unit === u ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 active:text-zinc-300'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-2 block">Bar</label>
          <div className="flex gap-2.5">
            {BAR_OPTIONS[unit].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBarWeight(opt.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                  barWeight === opt.value
                    ? 'bg-zinc-800 border-blue-500/40 text-zinc-100'
                    : 'bg-transparent border-zinc-800 text-zinc-500 active:border-zinc-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs text-zinc-400 uppercase tracking-widest font-medium mb-2 block">Target ({unit})</label>
          <input
            type="text"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="185"
            className="w-full bg-zinc-800/50 border border-zinc-700/50 focus:border-blue-500/50 rounded-xl px-4 py-3.5 text-center font-mono text-xl tabular-nums text-zinc-100 placeholder:text-zinc-600 outline-none transition"
          />
        </div>

        {target && targetNum <= barWeight && (
          <div className="text-zinc-500 text-center text-sm py-3">
            Target must exceed bar weight ({barWeight} {unit})
          </div>
        )}

        {target && targetNum > barWeight && (
          <div>
            <div className="text-sm text-zinc-400 text-center mb-3 font-mono tabular-nums">
              {perSide} {unit} per side
            </div>
            {plateList.length > 0 ? (
              <div className="space-y-2">
                {plateList.map(({ weight, count }) => (
                  <div key={weight} className="flex items-center gap-3 py-2 px-3 bg-zinc-800/30 rounded-xl">
                    <span className="font-mono text-base tabular-nums text-zinc-100 w-14 text-right font-medium">{weight}</span>
                    <div className="flex gap-1.5 flex-1">
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="bg-blue-400/60 h-6 w-3 rounded-sm" />
                      ))}
                    </div>
                    <span className="font-mono text-sm tabular-nums text-zinc-400 font-medium">×{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 text-center text-sm py-3">Not achievable with standard plates</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
