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
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl">Plate Calculator</h2>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded bg-zinc-800 active:bg-zinc-700">
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        <div className="flex bg-zinc-800/50 rounded p-0.5 mb-4">
          {['lb', 'kg'].map((u) => (
            <button
              key={u}
              onClick={() => { setUnit(u); setBarWeight(u === 'lb' ? 45 : 20); setTarget(''); }}
              className={`flex-1 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition ${
                unit === u ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1.5 block">Bar</label>
          <div className="flex gap-2">
            {BAR_OPTIONS[unit].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBarWeight(opt.value)}
                className={`flex-1 py-2 rounded text-xs font-medium border transition ${
                  barWeight === opt.value
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                    : 'bg-transparent border-zinc-800 text-zinc-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1.5 block">Target ({unit})</label>
          <input
            type="text"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="185"
            className="w-full bg-zinc-800/50 border border-zinc-800 focus:border-zinc-600 rounded px-4 py-2.5 text-center font-mono text-lg tabular-nums text-zinc-100 placeholder:text-zinc-700 outline-none"
          />
        </div>

        {target && targetNum <= barWeight && (
          <div className="text-zinc-600 text-center text-xs py-2">
            Target must exceed bar weight ({barWeight} {unit})
          </div>
        )}

        {target && targetNum > barWeight && (
          <div>
            <div className="text-xs text-zinc-500 text-center mb-3 font-mono tabular-nums">
              {perSide} {unit} per side
            </div>
            {plateList.length > 0 ? (
              <div className="space-y-1.5">
                {plateList.map(({ weight, count }) => (
                  <div key={weight} className="flex items-center gap-3 py-1">
                    <span className="font-mono text-sm tabular-nums text-zinc-100 w-12 text-right">{weight}</span>
                    <div className="flex gap-1 flex-1">
                      {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="bg-zinc-600 h-5 w-2 rounded-sm" />
                      ))}
                    </div>
                    <span className="font-mono text-xs tabular-nums text-zinc-500">×{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-600 text-center text-xs py-2">Not achievable with standard plates</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
