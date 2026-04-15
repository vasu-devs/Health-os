import { createClient } from '@/lib/supabase/server';
import DailyMetrics, { type DailyMetricsRow } from '@/components/DailyMetrics';
import WorkoutRoutine from '@/components/WorkoutRoutine';
import MealPlan from '@/components/MealPlan';

export const dynamic = 'force-dynamic';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const supabase = createClient();
  const today = todayISO();

  const { data: { user } } = await supabase.auth.getUser();

  let metrics: DailyMetricsRow | null = null;
  if (user) {
    const { data } = await supabase
      .from('daily_metrics')
      .select('current_weight, sleep_hours, target_calories, consumed_calories, total_steps')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();
    metrics = data;
  }

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <main
      className="h-[100dvh] flex flex-col gap-3 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      aria-label="Today's dashboard"
    >
      <header className="shrink-0 flex items-baseline justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{todayLabel}</p>
          <h1 className="text-2xl font-semibold leading-tight">
            {user ? 'Good morning' : 'Health OS'}
          </h1>
        </div>
        <span
          aria-hidden
          className="h-9 w-9 rounded-full bg-accent/20 border border-accent/40 grid place-items-center text-accent text-sm font-semibold"
        >
          {user?.email?.[0]?.toUpperCase() ?? 'V'}
        </span>
      </header>

      <DailyMetrics initial={metrics} />

      <div className="flex-1 min-h-0 grid grid-rows-2 gap-3">
        <WorkoutRoutine />
        <MealPlan />
      </div>
    </main>
  );
}
