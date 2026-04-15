type Exercise = { name: string; detail: string };

const WORKOUT: Exercise[] = [
  { name: 'Warm-up', detail: '5 min mobility' },
  { name: 'Back squat', detail: '4 × 8 @ 80kg' },
  { name: 'Bench press', detail: '4 × 6 @ 65kg' },
  { name: 'Pull-ups', detail: '3 × AMRAP' },
  { name: 'Plank', detail: '3 × 60s' },
];

export default function WorkoutRoutine() {
  return (
    <section
      aria-label="Today's workout routine"
      className="min-h-0 flex flex-col rounded-2xl bg-surface border border-border overflow-hidden"
    >
      <header className="shrink-0 flex items-baseline justify-between px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold">Today's workout</h2>
        <span className="text-[11px] text-slate-400">Push day · 45 min</span>
      </header>
      <ul className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 divide-y divide-border/60">
        {WORKOUT.map((w) => (
          <li key={w.name} className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm truncate">{w.name}</span>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">{w.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
