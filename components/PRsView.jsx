import React, { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { WORKOUT_COLORS } from '../data/workouts';

function Sparkline({ data, width = 72, height = 20 }) {
  if (!data || data.length < 2) return null;
  const values = data.map((d) => d.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const trending = values[values.length - 1] >= values[0];

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={trending ? '#4ade80' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.6}
      />
    </svg>
  );
}

function derivePRData(history, workouts) {
  const prs = {};

  for (const [wId, w] of Object.entries(workouts)) {
    for (const ex of w.exercises) {
      prs[ex.id] = {
        name: ex.name,
        workoutId: wId,
        maxWeight: 0,
        maxWeightDate: null,
        est1RM: 0,
        est1RMDate: null,
        maxVol: 0,
        maxVolDate: null,
        trend: [],
      };
    }
  }

  for (const session of history) {
    const date = session.finishedAt;
    for (const [exId, sets] of Object.entries(session.sets || {})) {
      if (!prs[exId]) continue;
      const pr = prs[exId];
      let sessionMax = 0;

      for (const s of sets) {
        if (!s.done || !s.weight) continue;
        const w = parseFloat(s.weight);
        const r = parseInt(s.reps) || 0;
        if (isNaN(w) || w <= 0) continue;

        if (w > pr.maxWeight) {
          pr.maxWeight = w;
          pr.maxWeightDate = date;
        }

        const e1rm = r <= 1 ? w : Math.round(w * (1 + r / 30));
        if (e1rm > pr.est1RM) {
          pr.est1RM = e1rm;
          pr.est1RMDate = date;
        }

        const vol = w * r;
        if (vol > pr.maxVol) {
          pr.maxVol = Math.round(vol);
          pr.maxVolDate = date;
        }

        sessionMax = Math.max(sessionMax, w);
      }

      if (sessionMax > 0) {
        pr.trend.push({ weight: sessionMax, date });
      }
    }
  }

  for (const pr of Object.values(prs)) {
    pr.trend = pr.trend.slice(0, 10).reverse();
  }

  return prs;
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function PRsView({ history, workouts, onBack }) {
  const prData = useMemo(() => derivePRData(history, workouts), [history, workouts]);

  const grouped = {};
  for (const [exId, pr] of Object.entries(prData)) {
    if (!grouped[pr.workoutId]) grouped[pr.workoutId] = [];
    grouped[pr.workoutId].push({ exId, ...pr });
  }

  const hasAnyData = Object.values(prData).some((pr) => pr.maxWeight > 0);

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-16">
      <div className="flex items-center gap-3 mb-8 animate-fadeSlideUp">
        <button onClick={onBack} className="flex items-center gap-1 text-zinc-500 -ml-1 py-1 active:text-zinc-100">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">Back</span>
        </button>
        <h1 className="font-display text-2xl text-zinc-100">Records</h1>
      </div>

      {!hasAnyData ? (
        <div className="text-zinc-600 text-center py-20 text-sm">
          Complete some workouts to see your records here.
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([wId, exercises], gIdx) => {
            const w = workouts[wId];
            if (!w) return null;
            const colors = WORKOUT_COLORS[wId] || {};
            const activeExercises = exercises.filter((e) => e.maxWeight > 0);
            if (activeExercises.length === 0) return null;

            return (
              <div key={wId} className="animate-fadeSlideUp" style={{ animationDelay: `${gIdx * 100}ms` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot || 'bg-zinc-600'}`} />
                  <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{w.name}</h2>
                </div>

                <div className="space-y-px">
                  {activeExercises.map((ex) => (
                    <div key={ex.exId} className="py-3 border-b border-zinc-800/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-medium text-zinc-200">{ex.name}</span>
                        <Sparkline data={ex.trend} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">Max Weight</div>
                          <div className="font-mono text-sm tabular-nums text-zinc-100 font-semibold">
                            {ex.maxWeight}
                          </div>
                          <div className="text-[10px] text-zinc-600 font-mono tabular-nums">
                            {formatDate(ex.maxWeightDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">Est 1RM</div>
                          <div className="font-mono text-sm tabular-nums text-amber-400 font-semibold">
                            {ex.est1RM}
                          </div>
                          <div className="text-[10px] text-zinc-600 font-mono tabular-nums">
                            {formatDate(ex.est1RMDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">Best Vol</div>
                          <div className="font-mono text-sm tabular-nums text-zinc-100 font-semibold">
                            {ex.maxVol.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-zinc-600 font-mono tabular-nums">
                            {formatDate(ex.maxVolDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
