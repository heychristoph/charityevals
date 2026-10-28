// "Where the uncertainty comes from": how much of the doubt about this result comes from your shared
// assumptions, the evaluator's judgment calls, their estimates and measured data, and the inputs that
// carry most of it. Each input counts by how much it moves the result times how well it's known
// (src/engine/uncertainty.ts).
import { lib } from "../lib/data";
import type { ResolvedModel } from "../engine/model";
import { DEFAULT_FACTOR, type Driver, type Source, type Uncertainty as U } from "../engine/uncertainty";
import { formatValue } from "../lib/format";

const SOURCES: { key: Source; label: string; short: string }[] = [
  { key: "judgment", label: "The evaluator's judgment calls", short: "judgment call" },
  { key: "assumption", label: "Your assumptions", short: "your assumption" },
  { key: "estimate", label: "The evaluator's estimates", short: "estimate" },
  { key: "data", label: "Measured data", short: "data" },
];
const SHORT = Object.fromEntries(SOURCES.map((s) => [s.key, s.short])) as Record<Source, string>;
const pct = (x: number) => (x < 0.005 ? "<1%" : `${Math.round(x * 100)}%`);
const TOP = 8;

function hrefOf(d: Driver) {
  return d.scope === "row" ? `#row-${d.id}` : d.scope === "assumption" ? `#a-${d.id}` : `/assumptions#f-${d.id}`;
}

/** "range 0.4–1.6" for a published range; "assumed within ×/÷ 1.5" for a default. */
function rangeText(m: ResolvedModel, d: Driver) {
  if (d.source === "assumption") return "slider's range";
  if (!d.published) return `no range published; assumed within ×/÷ ${DEFAULT_FACTOR[d.source as Exclude<Source, "assumption">]}`;
  const f = d.scope === "row" ? m.byId.get(d.id)?.format : lib.facts.get(d.id)?.format;
  const fmt = (v: number) => formatValue(v, f && f !== "toggle" ? f : Math.abs(v) < 0.001 ? "small" : "number");
  return `range ${fmt(d.low)}–${fmt(d.high)}`;
}

export default function Uncertainty({ model, u }: { model: ResolvedModel; u: U }) {
  if (!u.drivers.length) return null;
  const top = u.drivers.slice(0, TOP);
  const max = top[0].share;
  const parts = SOURCES.filter((s) => u.bySource[s.key] > 0);
  const summary = parts.map((s) => `${s.label.toLowerCase()} ${pct(u.bySource[s.key])}`).join(", ");
  const defaults = u.drivers.filter((d) => !d.published).reduce((t, d) => t + d.share, 0);
  return (
    <section className="unc" aria-labelledby="unc-title" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <h2 id="unc-title">Where the uncertainty comes from</h2>
      <p className="muted small unc-intro">
        Each input counts by how much it moves the result, times how loosely it's known.
      </p>

      <div className="unc-split" role="img" aria-label={`Share of the uncertainty: ${summary}.`}>
        {parts.map((s) => (
          <span key={s.key} className={`unc-seg unc-${s.key}`} style={{ flexGrow: u.bySource[s.key] }} />
        ))}
      </div>
      <ul className="unc-legend small" aria-hidden>
        {parts.map((s) => (
          <li key={s.key}><span className={`unc-key unc-${s.key}`} />{s.label} <span className="num">{pct(u.bySource[s.key])}</span></li>
        ))}
      </ul>

      <ol className="unc-list">
        {top.map((d) => (
          <li key={d.key} className="unc-row">
            <span className="unc-name">
              <a href={hrefOf(d)}>{d.label}</a>
              <span className="unc-meta small muted"><span className={`unc-key unc-${d.source}`} aria-hidden />{SHORT[d.source]} · {rangeText(model, d)}</span>
            </span>
            <span className="unc-track" aria-hidden><span className={`unc-bar unc-${d.source}`} style={{ width: `${(d.share / max) * 100}%` }} /></span>
            <span className="unc-pct num small">{pct(d.share)}</span>
          </li>
        ))}
      </ol>

      <p className="small muted unc-note">
        {u.drivers.length > TOP && <>The other {u.drivers.length - TOP} inputs share the remaining {pct(1 - top.reduce((t, d) => t + d.share, 0))}. </>}
        Where the evaluator gives no range, we assume one by type: judgment calls within ×/÷ {DEFAULT_FACTOR.judgment},
        estimates ×/÷ {DEFAULT_FACTOR.estimate}, data ×/÷ {DEFAULT_FACTOR.data}
        {defaults > 0 && <> ({pct(defaults)} of the total rests on these)</>}. Shares are a first-order estimate that
        treats inputs as independent. The low and high on the rankings use published ranges only.
      </p>
    </section>
  );
}
