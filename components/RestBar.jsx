import React from 'react';
import { X } from 'lucide-react';

export function RestBar({ seconds, initial, onDismiss, onAdd, onSub }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const pct = initial > 0 ? Math.max(0, Math.min(100, (seconds / initial) * 100)) : 0;

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 z-20 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="h-0.5 bg-zinc-800">
            <div
              className="h-full bg-zinc-400 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Rest</span>
            <div className="font-mono text-base font-semibold tabular-nums text-zinc-100 flex-1">
              {mm}:{ss.toString().padStart(2, '0')}
            </div>
            <button
              onClick={onSub}
              className="h-7 px-2.5 text-xs font-mono font-medium bg-zinc-800 active:bg-zinc-700 rounded text-zinc-400"
            >
              −15
            </button>
            <button
              onClick={onAdd}
              className="h-7 px-2.5 text-xs font-mono font-medium bg-zinc-800 active:bg-zinc-700 rounded text-zinc-400"
            >
              +30
            </button>
            <button
              onClick={onDismiss}
              className="h-7 w-7 flex items-center justify-center bg-zinc-800 active:bg-zinc-700 rounded"
            >
              <X className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
