import React from 'react';
import { SET_GRID } from '../data/workouts';
import { SetRow } from './SetRow';

export function ExerciseCard({ exercise, sets, lastSession, pr, onUpdateSet, onCompleteSet }) {
  return (
    <div className="border border-zinc-800/80 rounded-lg overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium text-sm text-zinc-100 leading-tight">{exercise.name}</h3>
          {pr !== undefined && pr > 0 && (
            <span className="font-mono text-xs tabular-nums text-amber-400/80">
              PR {pr}
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
          <span className="font-mono tabular-nums">{exercise.sets}×{exercise.reps}</span>
          {exercise.note && (
            <>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-600">{exercise.note}</span>
            </>
          )}
        </div>
        {lastSession && lastSession.length > 0 && (
          <div className="text-xs text-zinc-600 mt-1 font-mono tabular-nums">
            Prev {lastSession.map((s) => `${s.weight}×${s.reps}`).join('  ')}
          </div>
        )}
      </div>
      <div className="px-2 pb-2 space-y-1">
        <div
          className="grid gap-2 px-2 text-[10px] uppercase tracking-widest text-zinc-600 font-medium"
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
