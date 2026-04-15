'use client';

import { useState } from 'react';

export type DailyMetricsRow = {
  current_weight: number | null;
  sleep_hours: number | null;
  target_calories: number | null;
  consumed_calories: number | null;
  total_steps: number | null;
};

type MetricKey = 'weight' | 'sleep' | 'calories';
type Metric = {
  key: MetricKey;
  label: string;
  unit: string;
  placeholder: string;
};

const METRICS: Metric[] = [
  { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '72.4' },
  { key: 'sleep', label: 'Sleep', unit: 'hrs', placeholder: '7.5' },
  { key: 'calories', label: 'Calories', unit: 'kcal', placeholder: '2100' },
];

function toInitial(row: DailyMetricsRow | null): Record<MetricKey, string> {
  return {
    weight: row?.current_weight != null ? String(row.current_weight) : '',
    sleep: row?.sleep_hours != null ? String(row.sleep_hours) : '',
    calories: row?.consumed_calories != null ? String(row.consumed_calories) : '',
  };
}

export default function DailyMetrics({ initial }: { initial: DailyMetricsRow | null }) {
  const [values, setValues] = useState<Record<MetricKey, string>>(() => toInitial(initial));

  return (
    <section aria-label="Daily metrics" className="shrink-0 grid grid-cols-3 gap-2">
      {METRICS.map((m) => {
        const id = `metric-${m.key}`;
        return (
          <div
            key={m.key}
            className="rounded-2xl bg-surface border border-border p-3 focus-within:border-accent/60 transition-colors"
          >
            <label
              htmlFor={id}
              className="text-[10px] uppercase tracking-[0.15em] text-slate-400"
            >
              {m.label}
            </label>
            <div className="mt-1 flex items-baseline gap-1">
              <input
                id={id}
                inputMode="decimal"
                autoComplete="off"
                value={values[m.key]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [m.key]: e.target.value }))
                }
                placeholder={m.placeholder}
                aria-label={`${m.label} in ${m.unit}`}
                className="w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums outline-none placeholder:text-slate-600"
              />
              <span className="text-[10px] text-slate-500 shrink-0">{m.unit}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
