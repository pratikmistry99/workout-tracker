import React from 'react';
import { Trophy } from 'lucide-react';
import { SET_GRID } from '../data/workouts';
import { SetRow } from './SetRow';

export function ExerciseCard({ exercise, sets, lastSession, pr, onUpdateSet, onCompleteSet }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-tight">{exercise.name}</h3>
          {pr !== undefined && (
            <div className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0">
              <Trophy className="w-3 h-3" />
              <span>PR {pr}lb</span>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {exercise.sets} × {exercise.reps}
          {exercise.note && <span className="text-slate-500"> · {exercise.note}</span>}
          <span className="text-slate-600"> · {exercise.restTime}s rest</span>
        </div>
        {lastSession && lastSession.length > 0 && (
          <div className="text-xs text-slate-500 mt-1.5 font-mono tabular-nums">
            Last: {lastSession.map((s) => `${s.weight}×${s.reps}`).join(' · ')}
          </div>
        )}
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        <div
          className="grid gap-2 px-1 text-xs uppercase tracking-wider text-slate-600 font-semibold"
          style={SET_GRID}
        >
          <div className="text-center">#</div>
          <div>Weight</div>
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
