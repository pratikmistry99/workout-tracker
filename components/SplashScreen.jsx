import React, { useEffect } from 'react';
import { Dumbbell } from 'lucide-react';

export function SplashScreen({ onComplete }) {
  useEffect(() => {
    const id = setTimeout(onComplete, 1800);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center splash-out">
      <div className="flex flex-col items-center gap-5">
        <div className="splash-icon">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center border border-zinc-700/30">
            <Dumbbell className="w-8 h-8 text-zinc-100" />
          </div>
        </div>
        <div className="splash-title text-zinc-100 font-display text-3xl tracking-[0.18em] uppercase">
          Workout
        </div>
        <div className="splash-tag text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
          Track &middot; Lift &middot; Progress
        </div>
      </div>
    </div>
  );
}
