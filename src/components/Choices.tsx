import { PRESETS, applyPreset, presetOf, resetAssumptions, useOverrides } from "../lib/assumption-state";
import { METRICS, setMetric, useMetricId } from "../lib/metric";

/** The value sets, live, on the method page: the same sets as the panel's picker, sharing its state. */
export function ValueSets() {
  const current = presetOf(useOverrides());
  const sets = [{ id: "default", label: "Default", about: "The site's middle-of-the-road values: every slider at its default." }, ...PRESETS];
  return (
    <div className="choices">
      {sets.map((p) => (
        <button key={p.id} type="button" className="choice" aria-pressed={current === p.id} onClick={() => (p.id === "default" ? resetAssumptions() : applyPreset(p.id))}>
          <strong>{p.label}</strong>
          <span>{p.about}</span>
        </button>
      ))}
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
