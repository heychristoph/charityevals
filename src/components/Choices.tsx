import { useState } from "react";
import "./choices.css";
import { VALUE_SETS, chooseSet, presetOf, useOverrides } from "../lib/assumption-state";
import { METRICS, setMetric, useMetricId } from "../lib/metric";

/** The value sets, live: the same sets as the panel's picker, sharing its state. On the method page the
 * current set is marked; on the first-visit screen (Onboarding.tsx) `picked` marks only a set clicked there,
 * and `short` shows two lines of each description with a toggle for the rest. */
export function ValueSets({ picked, onPick, short = false }: { picked?: string | null; onPick?: (id: string) => void; short?: boolean } = {}) {
  const current = presetOf(useOverrides());
  const on = picked === undefined ? current : picked;
  const [open, setOpen] = useState<string[]>([]);
  const choose = (id: string) => {
    chooseSet(id);
    onPick?.(id);
  };
  return (
    <div className="choices">
      {VALUE_SETS.map((p) =>
        short ? (
          <div key={p.id} className={on === p.id ? "choice on" : "choice"}>
            <button type="button" className="choice-pick" aria-pressed={on === p.id} onClick={() => choose(p.id)}>
              <strong>{p.label}</strong>
              <span className={open.includes(p.id) ? undefined : "clamp"}>{p.about}</span>
            </button>
            <button
              type="button"
              className="link-button small choice-more"
              aria-expanded={open.includes(p.id)}
              onClick={() => setOpen(open.includes(p.id) ? open.filter((x) => x !== p.id) : [...open, p.id])}
            >
              {open.includes(p.id) ? "Less" : "More"}
            </button>
          </div>
        ) : (
          <button key={p.id} type="button" className="choice" aria-pressed={on === p.id} onClick={() => choose(p.id)}>
            <strong>{p.label}</strong>
            <span>{p.about}</span>
          </button>
        ),
      )}
    </div>
  );
}

/** The measures, live: the same choice as the panel's picker. */
export function Measures() {
  const current = useMetricId();
  return (
    <div className="choices">
      {METRICS.map((m) => (
        <button key={m.id} type="button" className="choice" aria-pressed={current === m.id} onClick={() => setMetric(m.id)}>
          <strong>{m.label}</strong>
          <span>{m.about}</span>
        </button>
      ))}
    </div>
  );
}
