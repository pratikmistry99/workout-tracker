export const DEFAULT_REST = 90;
export const SET_GRID = { gridTemplateColumns: '28px 1fr 1fr 44px' };

export const WORKOUT_COLORS = {
  'upper-a': { dot: 'bg-sky-400', text: 'text-sky-400', border: 'border-sky-500/40', bar: 'bg-sky-500' },
  'lower-a': { dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500' },
  'upper-b': { dot: 'bg-violet-400', text: 'text-violet-400', border: 'border-violet-500/40', bar: 'bg-violet-500' },
  'lower-b': { dot: 'bg-orange-400', text: 'text-orange-400', border: 'border-orange-500/40', bar: 'bg-orange-500' },
};

export const WORKOUTS = {
  'upper-a': {
    name: 'Upper A',
    subtitle: 'Strength + Upper Chest',
    exercises: [
      { id: 'ua-1', name: 'Incline DB Press', sets: 4, reps: '6–8', note: 'Better ROM than barbell', restTime: 180 },
      { id: 'ua-2', name: 'Weighted / Assisted Pull-Ups', sets: 3, reps: '6–8', restTime: 180 },
      { id: 'ua-3', name: 'Flat Machine Press', sets: 3, reps: '8–10', note: 'Stable = push harder', restTime: 120 },
      { id: 'ua-4', name: 'Chest-Supported Row (Heavy)', sets: 3, reps: '6–8', restTime: 150 },
      { id: 'ua-5', name: 'Seated DB Shoulder Press', sets: 3, reps: '8–10', restTime: 120 },
      { id: 'ua-6', name: 'Cable Triceps Pushdown', sets: 3, reps: '10–12', restTime: 60 },
      { id: 'ua-7', name: 'Incline DB Curl', sets: 3, reps: '10–12', restTime: 60 },
    ],
  },
  'lower-a': {
    name: 'Lower A',
    subtitle: 'Glutes + Hamstrings',
    exercises: [
      { id: 'la-1', name: 'Hack / Pendulum Squat', sets: 4, reps: '6–8', note: 'Main quad driver', restTime: 180 },
      { id: 'la-2', name: 'Romanian Deadlift', sets: 3, reps: '8', note: 'DB or BB', restTime: 180 },
      { id: 'la-3', name: 'Leg Press (Feet high)', sets: 3, reps: '10', note: 'Glute bias', restTime: 120 },
      { id: 'la-4', name: 'Seated Leg Curl', sets: 3, reps: '12–15', restTime: 90 },
      { id: 'la-5', name: 'Standing Calf Raise', sets: 4, reps: '12–15', restTime: 60 },
      { id: 'la-6', name: 'Hanging Leg Raises', sets: 3, reps: '12–15', restTime: 60 },
    ],
  },
  'upper-b': {
    name: 'Upper B',
    subtitle: 'Hypertrophy / Aesthetics',
    exercises: [
      { id: 'ub-1', name: 'Incline Machine Press / Cable Fly', sets: 3, reps: '10–12', restTime: 90 },
      { id: 'ub-2', name: 'Lat Pulldown', sets: 3, reps: '10–12', note: 'Neutral or wide', restTime: 90 },
      { id: 'ub-3', name: 'Lateral Raises', sets: 4, reps: '12–20', note: 'Slow + controlled', restTime: 60 },
      { id: 'ub-4', name: 'Rear Delt Fly (Machine)', sets: 3, reps: '15–20', restTime: 60 },
      { id: 'ub-5', name: 'Overhead Cable Tri Ext', sets: 3, reps: '12–15', restTime: 60 },
      { id: 'ub-6', name: 'Preacher / Cable Curl', sets: 3, reps: '12–15', restTime: 60 },
      { id: 'ub-7', name: 'Face Pulls', sets: 2, reps: '15–20', restTime: 60 },
    ],
  },
  'lower-b': {
    name: 'Lower B',
    subtitle: 'Quad Focus + Glute Finish',
    exercises: [
      { id: 'lb-1', name: 'Hack Squat (higher reps)', sets: 3, reps: '10–12', restTime: 150 },
      { id: 'lb-2', name: 'Leg Press (Feet low)', sets: 3, reps: '12–15', restTime: 120 },
      { id: 'lb-3', name: 'Hip Thrust', sets: 3, reps: '10–12', note: 'Machine or BB', restTime: 120 },
      { id: 'lb-4', name: 'Leg Extension', sets: 3, reps: '12–15', note: 'Pause at top', restTime: 90 },
      { id: 'lb-5', name: 'Seated Calf Raise', sets: 4, reps: '12–15', restTime: 60 },
      { id: 'lb-6', name: 'Cable Crunch', sets: 3, reps: '15', restTime: 60 },
    ],
  },
};

export function getEffectiveWorkouts(customizations = {}) {
  const result = {};
  for (const [id, workout] of Object.entries(WORKOUTS)) {
    if (customizations[id]?.exercises) {
      result[id] = { ...workout, exercises: customizations[id].exercises };
    } else {
      result[id] = workout;
    }
  }
  return result;
}
