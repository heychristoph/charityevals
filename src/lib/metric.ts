// The measure the site's figures are shown in. Every model's result is computed once, in years of
// healthy life per $1,000; the other measures are that figure times one factor, the same for every
// charity, so the order never changes. The factors read the shared sliders and facts, so a measure moves
// with them as the figures do (docs/normalization.md 2.7).
import { useMemo, useSyncExternalStore } from "react";
import { pickValue, type Library } from "../engine/model";
import { formatYears } from "./format";

export type MetricId = "daly" | "dollars" | "wellby" | "cash";

export type Metric = {
  id: MetricId;
  /** In the picker. */
  label: string;
  /** Above the rankings. */
  unit: string;
  /** The definition behind the info icon. */
  about: string;
  prefix?: string;
  suffix?: string;
  /** Figures in this measure per healthy year per $1,000, at assumption values `av`. */
  factor: (lib: Library, av: Record<string, number>) => number;
};

/** Whose dollar a dollar of good is: someone earning this much a year (USD), Coefficient Giving's
 * reference for its own unit. */
export const REFERENCE_INCOME = 50000;

export const METRICS: Metric[] = [
  {
    id: "daly",
    label: "Healthy years",
    unit: "Healthy years per $1,000",
    about: "One person living one more year in full health, what researchers call a DALY. Preventing a death or an illness adds these years; so does lifting a family out of poverty or sparing animals from suffering, converted at exchange rates you can change.",
    factor: () => 1,
  },
  {
    id: "dollars",
    label: "Dollars of good",
    unit: "Dollars of good per $1",
    about: `What your dollar does, counted in dollars given to someone earning $${REFERENCE_INCOME.toLocaleString("en-US")} a year: $2,000 of good means your $1 does as much as $2,000 would for them. A dollar counts for less the more someone has, on the same income scale as every model here.`,
    prefix: "$",
    // Healthy years per $1 in units of value, over what $1 is worth to someone at the reference income
    // (a doubled income is $uov_per_ln_consumption units of value, so $1 is that ÷ the income).
    factor: (_lib, av) => (av.uov_per_daly / 1000) / (av.uov_per_ln_consumption / REFERENCE_INCOME),
  },
  {
    id: "wellby",
    label: "WELLBYs",
    unit: "WELLBYs per $1,000",
    about: "One point more life satisfaction, on a scale of 0 to 10, for one person for a year. Healthy years become WELLBYs at the rate you set under Your values.",
    factor: (_lib, av) => 1 / av.daly_per_wellby,
  },
  {
    id: "cash",
    label: "Multiples of cash",
    unit: "Times as much good as cash",
    about: "How many times as much good as giving the same money as cash to a very poor household (GiveWell's benchmark, from GiveDirectly's transfers). 10× means your $1 does what $10 in cash would.",
    suffix: "×",
    factor: (lib, av) => (av.uov_per_daly / 1000) / pickValue(lib.facts.get("cash.uov_per_dollar")?.value),
  },
];

const KEY = "charityevals:metric";
let current: MetricId = "daly";
let loaded = false;
const listeners = new Set<() => void>();
const isMetric = (x: unknown): x is MetricId => METRICS.some((m) => m.id === x);

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const fromUrl = new URLSearchParams(window.location.search).get("m");
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    /* private mode */
  }
  current = isMetric(fromUrl) ? fromUrl : isMetric(stored) ? stored : "daly";
}

export function setMetric(id: MetricId) {
  ensureLoaded();
  current = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode: the URL still carries it */
  }
  const url = new URL(window.location.href);
  if (id === "daly") url.searchParams.delete("m");
  else url.searchParams.set("m", id);
  history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

export function useMetricId(): MetricId {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => (ensureLoaded(), current),
    () => "daly",
  );
}

export type Figure = {
  metric: Metric;
  /** Figures per healthy year per $1,000. */
  factor: number;
  /** A figure in healthy years per $1,000, in the chosen measure. */
  format: (healthyYearsPer1000: number) => string;
};

export function figureIn(metric: Metric, factor: number): Figure {
  return {
    metric,
    factor,
    format: (x) => {
      const s = formatYears(x * factor);
      return s === "—" ? s : `${metric.prefix ?? ""}${s}${metric.suffix ?? ""}`;
    },
  };
}

/** The chosen measure at the reader's values. */
export function useFigure(lib: Library, av: Record<string, number>): Figure {
  const id = useMetricId();
  return useMemo(() => {
    const metric = METRICS.find((m) => m.id === id)!;
    return figureIn(metric, metric.factor(lib, av));
  }, [id, lib, av]);
}
