import React from 'react';
import { Timer, X } from 'lucide-react';

export function RestBar({ seconds, initial, onDismiss, onAdd, onSub }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const pct = initial > 0 ? Math.max(0, Math.min(100, (seconds / initial) * 100)) : 0;

  return (
    <div className="fixed bottom-24 left-0 right-0 px-5 z-20 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Timer className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <div className="font-mono text-lg font-bold tabular-nums flex-1">
              {mm}:{ss.toString().padStart(2, '0')}
            </div>
            <button
              onClick={onSub}
              className="h-9 px-3 text-sm font-semibold bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              −15
            </button>
            <button
              onClick={onAdd}
              className="h-9 px-3 text-sm font-semibold bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              +30
            </button>
            <button
              onClick={onDismiss}
              className="h-9 w-9 flex items-center justify-center bg-slate-800 active:bg-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
