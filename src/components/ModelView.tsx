import type React from "react";
import { useMemo } from "react";
import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { bottomLine, buildLibrary, comparable, compute, type ResolvedModel } from "../engine/model";
import { useResults, useResultFor } from "../lib/use-results";
import { formatMultiple, formatValue } from "../lib/format";
import { setView } from "../lib/assumption-state";
import { track } from "../lib/analytics";
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

/** Every model is its evaluator's; the visitor's shared assumptions may differ from the ones the
 * evaluator used (its pins, `evaluator.assumptions`). Says so when they move this result, with one way
 * to switch to the evaluator's own assumptions and back. */
function EvaluatorNote({ model, r, av }: { model: ResolvedModel; r: ReturnType<typeof useResultFor>; av: Record<string, number> }) {
  const name = model.evaluator?.name;
  const their = name?.endsWith("s") ? `${name}'` : `${name}'s`;
  const theirs = useMemo(() => {
    if (!model.evaluator || r.view === "evaluator") return undefined;
    const native = bottomLine(lib, model, av, {}, "evaluator").native;
    if (!comparable(lib, model)) return { value: native, text: formatValue(native, Math.abs(native) < 0.1 ? "small" : "number") };
    const bench = lib.models.get(lib.assumptions.common.benchmark)!;
    const multiple = bottomLine(lib, model, av, {}, "evaluator").common / bottomLine(lib, bench, av, {}, bench.evaluator ? "evaluator" : "charityevals").common;
    return { value: multiple, text: formatMultiple(multiple) };
  }, [model, av, r.view]);
  if (!name) return null;
  const switchTo = (view: "evaluator" | "charityevals") => {
    track("view_toggle", { key: view });
    setView(view);
  };
  if (r.view === "evaluator")
    return (
      <p className="small muted bl-evaluator">
        On {their} own assumptions.{" "}
        <button type="button" className="link-button" onClick={() => switchTo("charityevals")}>Use your assumptions</button>
      </p>
    );
  // A difference that doesn't show at the figure's precision isn't worth a note.
  const mine = comparable(lib, model) ? formatMultiple(r.central) : formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number");
  if (!theirs || !Number.isFinite(theirs.value) || theirs.text === mine) return null;
  return (
    <p className="small muted bl-evaluator">
      Your assumptions differ from {their}, which give <span className="num">{theirs.text}</span>.{" "}
      <button type="button" className="link-button" onClick={() => switchTo("evaluator")}>
        <RotateCcw size={14} aria-hidden /> Reset to {their} assumptions
      </button>
    </p>
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
          <EvaluatorNote model={model} r={r} av={av} />
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
          <EvaluatorNote model={model} r={r} av={av} />
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
