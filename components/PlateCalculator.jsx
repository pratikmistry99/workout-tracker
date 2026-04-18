import React, { useState } from 'react';
import { X } from 'lucide-react';

const PLATES = {
  lb: [45, 35, 25, 10, 5, 2.5],
  kg: [20, 15, 10, 5, 2.5, 1.25],
};

const BAR_OPTIONS = {
  lb: [
    { label: '45 lb — Olympic', value: 45 },
    { label: '35 lb — Women\'s', value: 35 },
  ],
  kg: [
    { label: '20 kg — Olympic', value: 20 },
    { label: '15 kg — Women\'s', value: 15 },
  ],
};

const PLATE_COLORS = {
  45: 'bg-red-500', 35: 'bg-blue-500', 25: 'bg-yellow-500',
  10: 'bg-green-600', 5: 'bg-slate-300', 2.5: 'bg-slate-500',
  20: 'bg-red-500', 15: 'bg-blue-500', 1.25: 'bg-slate-500',
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

  const handleUnitSwitch = (u) => {
    setUnit(u);
    setBarWeight(u === 'lb' ? 45 : 20);
    setTarget('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-30 flex items-end justify-center px-4 pb-6"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Plate Calculator</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 active:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit toggle */}
        <div className="flex bg-slate-800 rounded-xl p-1 mb-4">
          {['lb', 'kg'].map((u) => (
            <button
              key={u}
              onClick={() => handleUnitSwitch(u)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                unit === u ? 'bg-slate-600 text-white' : 'text-slate-400'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Bar weight */}
        <div className="mb-4">
          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5 block">
            Bar Weight
          </label>
          <div className="flex gap-2">
            {BAR_OPTIONS[unit].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBarWeight(opt.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                  barWeight === opt.value
                    ? 'bg-slate-700 border-slate-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target weight input */}
        <div className="mb-4">
          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5 block">
            Target Weight ({unit})
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="e.g. 185"
            className="w-full bg-slate-800 border border-slate-700 focus:border-slate-500 rounded-xl px-4 py-3 text-center font-mono text-xl text-white placeholder:text-slate-600 outline-none"
          />
        </div>

        {/* Results */}
        {target && targetNum <= barWeight && (
          <div className="text-slate-500 text-center text-sm py-2">
            Target must be greater than bar weight ({barWeight} {unit})
          </div>
        )}

        {target && targetNum > barWeight && (
          <div>
            <div className="text-xs text-slate-500 text-center mb-3">
              {perSide} {unit} per side
            </div>
            {plateList.length > 0 ? (
              <div className="space-y-2">
                {plateList.map(({ weight, count }) => (
                  <div key={weight} className="flex items-center gap-3">
                    <div
                      className={`${PLATE_COLORS[weight] || 'bg-slate-500'} text-white text-xs font-bold rounded-lg px-3 py-1.5 w-16 text-center`}
                    >
                      {weight}
                    </div>
                    <div className="flex gap-1 flex-wrap flex-1">
                      {Array.from({ length: count }).map((_, i) => (
                        <div
                          key={i}
                          className={`${PLATE_COLORS[weight] || 'bg-slate-500'} h-7 w-2.5 rounded-sm opacity-75`}
                        />
                      ))}
                    </div>
                    <div className="text-slate-400 text-sm">×{count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center text-sm py-2">
                Can't make that weight with standard plates
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
