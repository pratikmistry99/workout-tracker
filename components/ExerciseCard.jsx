import React from 'react';
import { SET_GRID } from '../data/workouts';
import { SetRow } from './SetRow';

export function ExerciseCard({ exercise, sets, lastSession, pr, onUpdateSet, onCompleteSet }) {
  return (
    <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/30">
      <div className="px-4 pt-4 pb-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium text-base text-zinc-100 leading-tight">{exercise.name}</h3>
          {pr !== undefined && pr > 0 && (
            <span className="font-mono text-xs tabular-nums text-amber-400/90 font-semibold">
              PR {pr}
            </span>
          )}
        </div>
        <div className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
          <span className="font-mono tabular-nums">{exercise.sets}×{exercise.reps}</span>
          {exercise.note && (
            <>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">{exercise.note}</span>
            </>
          )}
        </div>
        {lastSession && lastSession.length > 0 && (
          <div className="text-xs text-zinc-500 mt-1.5 font-mono tabular-nums">
            Prev {lastSession.map((s) => `${s.weight}×${s.reps}`).join('  ')}
          </div>
        )}
      </div>
      <div className="px-2.5 pb-3 space-y-1.5">
        <div
          className="grid gap-2.5 px-3 text-[11px] uppercase tracking-widest text-zinc-500 font-medium"
          style={SET_GRID}
        >
          <div className="text-center">#</div>
          <div>lb</div>
          <div>Reps</div>
          <div />
        </div>
        {sets.map((s, idx) => (
          <SetRow
            key={idx}
            index={idx}
            set={s}
            prev={lastSession?.[idx]}
            pr={pr}
            onChange={(patch) => onUpdateSet(idx, patch)}
            onComplete={() => onCompleteSet(exercise.restTime)}
          />
        ))}
      </div>
    </div>
  );
}
