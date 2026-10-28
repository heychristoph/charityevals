import type React from "react";
import { useMemo } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { buildLibrary, comparable, compute, type ResolvedModel } from "../engine/model";
import { useResults, useResultFor } from "../lib/use-results";
import { formatMultiple, formatValue } from "../lib/format";
import ViewToggle from "./ViewToggle";
import Derivation, { type Choice } from "./Derivation";
import ModelTree from "./ModelTree";
import { TICKS, xFor, tickLabel, clipSpan, pctStr } from "./scale";
import "./model.css";

function Tornado({ model }: { model: ResolvedModel }) {
  const r = useResultFor(model);
  const cmp = comparable(lib, model);
  const fmt = (v: number) => (cmp ? formatMultiple(v) : v === 0 ? "0" : formatValue(v, Math.abs(v) < 0.1 ? "small" : "number"));
  const bench = r.s.central / r.central;
  const rows = r.s.swings.slice(0, 8);
  const lo = Math.min(r.low, ...rows.map((s) => Math.min(s.atLow, s.atHigh) / bench));
  const hi = Math.max(r.high, ...rows.map((s) => Math.max(s.atLow, s.atHigh) / bench));
  // Log scale when every value is positive. Some unranked models (animals spared per dollar) run
  // negative at their low end, and a log scale can't show those: they get a linear scale instead.
  const log = lo > 0 && hi > 0;
  const [a, b] = log ? [Math.log10(lo) - 0.05, Math.log10(hi) + 0.05] : [lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05 || 1];
  const xn = (v: number) => (((log ? Math.log10(v) : v) - a) / (b - a)) * 100;
  const x = (v: number) => pctStr(xn(v));
  const decades: number[] = [];
  if (log) {
    // Gridlines at each power of ten, plus 2× and 5× steps when the range spans little more than a decade.
    const steps = b - a < 1.5 ? [1, 2, 5] : [1];
    for (let d = Math.floor(a); d <= Math.ceil(b); d++)
      for (const m of steps) {
        const v = m * 10 ** d;
        if (Math.log10(v) >= a && Math.log10(v) <= b) decades.push(v);
      }
  } else {
    // Round steps (1, 2 or 5 times a power of ten), about five across, always including zero when in range.
    const raw = (b - a) / 5, p = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw)!;
    for (let v = Math.ceil(a / step) * step; v <= b; v += step) decades.push(Math.abs(v) < step / 1e6 ? 0 : v);
  }

  return (
    <figure className="tornado" aria-labelledby="tornado-caption">
      <figcaption id="tornado-caption">
        <h2>What drives this result</h2>
        <p className="muted small">
          Each bar: the result as one input moves across its range. {log ? "Log" : "Linear"} scale{cmp ? ", × GiveDirectly" : ""}.
        </p>
      </figcaption>
      <div className="t-chart" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
        <div className="t-axis">
          <span />
          <div className="t-track">
            {decades.map((d) => (
              <span key={d} className="t-tick num small" style={{ left: x(d) }}>{fmt(d)}</span>
            ))}
          </div>
        </div>
        {rows.map((s) => {
          const v1 = s.atLow / bench, v2 = s.atHigh / bench;
          const [l, h] = v1 < v2 ? [v1, v2] : [v2, v1];
          const href = s.scope === "row" ? `#row-${s.id}` : s.scope === "fact" ? `/assumptions#f-${s.id.slice(1)}` : `#a-${s.id}`;
          return (
            <div key={s.id} className="t-row">
              <a href={href} className="t-label small">
                {s.label}
                <span className={`kind-dot kind-${s.scope === "assumption" ? "judgment" : s.kind}`} aria-hidden />
              </a>
              <div className="t-track">
                {decades.map((d) => <span key={d} className="t-grid" style={{ left: x(d) }} />)}
                <span className="t-bar" style={{ clipPath: clipSpan(xn(l), xn(h), "2px") }} />
                <span className="t-central" style={{ left: x(r.central) }} />
                <span className="t-end num small" style={{ left: x(l) }} data-side="left">{fmt(l)}</span>
                <span className="t-end num small" style={{ left: x(h) }} data-side="right">{fmt(h)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="small muted t-notes">
        <p className="t-legend">
          <span className="kind-dot kind-observed" /> observed <span className="kind-dot kind-estimate" /> estimate{" "}
          <span className="kind-dot kind-judgment" /> judgment or shared assumption
        </p>
        <p>
          The {rows.length} inputs that move the result most.
        </p>
      </div>
    </figure>
  );
}

export default function ModelView({ id, bulk = false, choices = [], children }: { id: string; bulk?: boolean; choices?: Choice[]; children?: React.ReactNode }) {
  // Bulk models reach the browser as one-row summaries; their page loads the full file before
  // hydrating (client:model, lib/model-directive.ts).
  const raw = bulk ? bulkRaw(id) : undefined;
  const model = useMemo(
    () => (raw ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()]).models.get(id)! : lib.models.get(id)!),
    [id, raw],
  );
  const { results, av } = useResults();
  const r = useResultFor(model);
  const rank = model.kind === "charity" ? results.findIndex((x) => x.charity.id === model.charity) + 1 : 0;
  const values = useMemo(() => compute(lib, model, av, {}, r.view), [model, av, r.view]);
  const unit = lib.assumptions.units[model.output!.unit];

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      {model.evaluator && (
        <div className="view-bar">
          <ViewToggle evaluatorName={model.evaluator.name} />
          <p className="view-note">
            {r.view === "evaluator" ? `As ${model.evaluator.name} published it.` : `${model.evaluator.name}'s analysis, with your assumptions.`}
          </p>
        </div>
      )}
      {comparable(lib, model) ? (
      <section className="bottom-line" aria-labelledby="bl-title">
          <h2 id="bl-title" className="bl-title">
            <span className="bl-figure num">{formatMultiple(r.central)}</span> as much good per dollar as GiveDirectly
            {rank > 0 && <span className="muted bl-rank"> · rank {rank} of {results.length}</span>}
          </h2>
          <div className="bl-strip">
            <div className="bl-axis" aria-hidden>
              {TICKS.map((t) => <span key={t} className="bl-tick num small" style={{ left: pctStr(xFor(t, 100)) }}>{tickLabel(t)}</span>)}
            </div>
            <div className="bl-track" role="img" aria-label={`Central ${formatMultiple(r.central)}, joint low ${formatMultiple(r.low)}, joint high ${formatMultiple(r.high)}`}>
              {TICKS.map((t) => <span key={t} className={`bl-grid ${t === 1 ? "one" : ""}`} style={{ left: pctStr(xFor(t, 100)) }} />)}
              <span className="bl-bar" style={{ clipPath: clipSpan(xFor(r.low, 100), xFor(r.high, 100), "5px") }} />
              <span className="bl-dot-layer" style={{ transform: `translateX(${pctStr(xFor(r.central, 100))})` }}><span className="bl-dot" /></span>
            </div>
          </div>
          <p className="small muted">
            <span title={`${formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number")} ${unit.label} per dollar`}>
              Plausible range {formatMultiple(r.low)} to {formatMultiple(r.high)}.
            </span>{" "}
            <a href="#your-assumptions" className="jump">Change your assumptions</a>
          </p>
        </section>
      ) : (
        <section className="bottom-line" aria-labelledby="bl-title">
          <h2 id="bl-title" className="bl-title">
            <span className="bl-figure num">{formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number")}</span> {unit.label} per dollar
          </h2>
          <p className="small muted">
            Range {formatValue(r.low, "number")} to {formatValue(r.high, "number")}. Not ranked: there's no exchange rate between {unit.label} and other good done.{" "}
            <a href="#your-assumptions" className="jump">Change your assumptions</a>
          </p>
        </section>
      )}

      {r.flags.length > 0 && (
        <section id="flags" className="flags" aria-label="Sensitivity flags">
          <ul>
            {r.flags.map((f) => (
              <li key={f.short} className={`flag flag-${f.level}`}>
                {f.level === "warn" ? <AlertTriangle size={15} aria-hidden /> : <Info size={15} aria-hidden />}
                <span>{f.text}.</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Derivation model={model} choices={choices} />

      {children}

      <Tornado model={model} />

      <ModelTree model={model} values={values} view={r.view} />
    </div>
  );
}
