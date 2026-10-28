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
import Uncertainty from "./Uncertainty";
import { uncertainty } from "../engine/uncertainty";
import { TICKS, xFor, tickLabel, clipSpan, pctStr } from "./scale";
import "./model.css";

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
  const u = useMemo(() => uncertainty(lib, model, values, av, r.view), [model, values, av, r.view]);
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

      <Uncertainty model={model} u={u} />

      <ModelTree model={model} values={values} view={r.view} u={u} />
    </div>
  );
}
