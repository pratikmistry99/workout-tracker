import React from 'react';
import { X } from 'lucide-react';

export function RestBar({ seconds, initial, onDismiss, onAdd, onSub }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const pct = initial > 0 ? Math.max(0, Math.min(100, (seconds / initial) * 100)) : 0;

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 z-20 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-zinc-900 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="h-1 bg-zinc-800">
            <div
              className="h-full bg-blue-400 transition-all duration-1000 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Rest</span>
            <div className="font-mono text-xl font-semibold tabular-nums text-zinc-100 flex-1">
              {mm}:{ss.toString().padStart(2, '0')}
            </div>
            <button
              onClick={onSub}
              className="h-10 px-4 text-sm font-mono font-semibold bg-zinc-800 active:bg-zinc-700 rounded-xl text-zinc-300 transition active:scale-95"
            >
              −15
            </button>
            <button
              onClick={onAdd}
              className="h-10 px-4 text-sm font-mono font-semibold bg-zinc-800 active:bg-zinc-700 rounded-xl text-zinc-300 transition active:scale-95"
            >
              +30
            </button>
            <button
              onClick={onDismiss}
              className="h-10 w-10 flex items-center justify-center bg-zinc-800 active:bg-zinc-700 rounded-xl transition active:scale-95"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
