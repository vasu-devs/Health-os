type Meal = { slot: string; item: string; kcal: number };

const MEALS: Meal[] = [
  { slot: 'Breakfast', item: 'Oats, berries, whey', kcal: 480 },
  { slot: 'Lunch', item: 'Chicken, rice, greens', kcal: 720 },
  { slot: 'Snack', item: 'Greek yogurt, almonds', kcal: 280 },
  { slot: 'Dinner', item: 'Salmon, quinoa, salad', kcal: 620 },
];

export default function MealPlan() {
  const total = MEALS.reduce((sum, m) => sum + m.kcal, 0);

  return (
    <section
      aria-label="Today's meal plan"
      className="min-h-0 flex flex-col rounded-2xl bg-surface border border-border overflow-hidden"
    >
      <header className="shrink-0 flex items-baseline justify-between px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold">Today's meals</h2>
        <span className="text-[11px] text-slate-400 tabular-nums">{total} kcal planned</span>
      </header>
      <ul className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 divide-y divide-border/60">
        {MEALS.map((m) => (
          <li key={m.slot} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0 flex flex-col">
              <span className="text-sm">{m.slot}</span>
              <span className="text-xs text-slate-400 truncate">{m.item}</span>
            </div>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">{m.kcal} kcal</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
