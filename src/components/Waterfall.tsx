import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { lib } from "../lib/data";
import { headline, type ResolvedModel } from "../engine/model";
import { waterfall, type Step, type StepTarget } from "../engine/waterfall";
import { formatYears } from "../lib/format";

/** "1,700", "0.052", "3.2e-5": a native result per dollar. */
const fmtNative = (x: number) => (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString("en-US") : Math.abs(x) >= 0.01 ? String(Number(x.toPrecision(2))) : x.toPrecision(2));
/** Where the method page explains each unit's way into healthy years. */
const UNIT_SECTION: Record<string, string> = { sad: "animals", ced: "animals", wellby: "wellbeing", tco2e: "climate" };

/** "× 1.4", "× 0.52", "× 0.004". */
const times = (r: number) => `× ${r >= 10 ? Math.round(r) : Math.abs(r - 1) < 0.01 ? r.toFixed(3) : r >= 0.1 ? Number(r.toPrecision(2)) : Number(r.toPrecision(1))}`;
/** "GiveWell's", "Animal Charity Evaluators'". */
const possessive = (name: string) => (name.endsWith("s") ? `${name}'` : `${name}'s`);

/** Where a step's link goes: a row of the model below (#row-<id>, which the tree opens), a slider, or
 * the method page's section on a site-wide adjustment. */
function hrefOf(t?: StepTarget): string | undefined {
  if (!t) return undefined;
  if (t.type === "row") return `#row-${t.id}`;
  if (t.type === "rows") return `#row-${t.ids[0]}`;
  if (t.type === "assumption") return `/assumptions#a-${t.id}`;
  return `/method#${t.anchor}`;
}

const KIND: Record<Step["kind"], string> = {
  change: "Changed for consistency",
  value: "The site's shared value",
  yours: "Your setting",
  site: "Site-wide",
  other: "",
};

/** From the evaluator's figure to the one this page shows (src/engine/waterfall.ts): each difference a
 * bar on one log scale, labelled with how much it multiplies the figure, linked to where it lives. A
 * model with no evaluator starts from itself at the site's defaults. The reader's own edits to the
 * model's numbers are the last step. */
export default function Waterfall({ model, av, edits }: { model: ResolvedModel; av: Record<string, number>; edits: Record<string, number> }) {
  const w = useMemo(() => {
    const out = waterfall(lib, model, av);
    if (!out || !Object.keys(edits).length) return out;
    const to = headline(lib, model, av, edits);
    return Number.isFinite(to) && to !== out.end
      ? { ...out, steps: [...out.steps, { kind: "yours" as const, label: "Your edits to this model's numbers", from: out.end, to }], end: to }
      : out;
  }, [model, av, edits]);
  if (!w || !w.steps.length) return null;
  const points = [w.startValue, ...w.steps.map((s) => s.to)];
  const positive = points.every((x) => Number.isFinite(x) && x > 0);
  if (!positive) return null;
  // The axis starts a little below the lowest point, so the smallest total still shows as a bar.
  const top = Math.log(Math.max(...points)), bottom = Math.log(Math.min(...points));
  const lo = bottom - 0.25 * (top - bottom || 1), hi = top;
  const span = hi - lo;
  // Each bar's left and right edge on the shared log axis, as percentages (a hairline where it barely moves).
  const pos = (x: number) => ((Math.log(x) - lo) / span) * 100;
  const bar = (a: number, b: number) => {
    const l = Math.min(pos(a), pos(b)), r = Math.max(pos(a), pos(b));
    return { left: `${l}%`, width: `max(2px, ${r - l}%)` };
  };
  const owner = lib.owners.get(model.owner)?.name ?? "The evaluator";
  const startLabel = w.start === "evaluator" ? `As ${owner} calculates it` : "This model at the site's defaults";
  const unitLabel = lib.assumptions.units[w.native.unit]?.label ?? w.native.unit;
  return (
    <details className="wf" open>
      <summary>
        <span className="wf-title">{w.start === "evaluator" ? `How ${possessive(owner)} figure becomes ours` : "How the model's figure becomes the one shown"}</span>
      </summary>
      <p className="wf-native">
        {w.start === "evaluator" ? `${possessive(owner)} result, in the model's own unit` : "The model's result, in its own unit"}: <strong className="num">{fmtNative(w.native.value)}</strong> {unitLabel} per dollar.
        {w.native.unit !== "daly" && <> In years of healthy life per $1,000 {w.start === "evaluator" ? `at ${possessive(owner)} own rates` : "at the site's defaults"} that is{" "}
          <strong className="num">{formatYears(w.startValue)}</strong>{" "}
          (<a href={`/method#${UNIT_SECTION[w.native.unit] ?? "healthy-years"}`}>how {unitLabel} become healthy years</a>).</>}
      </p>
      <p className="wf-lede small">
        From there, each step below multiplies the figure. They are applied one at a time in this order, so together they give the figure shown. Open a step to see where it comes from.
      </p>
      <ol className="wf-steps">
        <li className="wf-step wf-end">
          <span className="wf-label">{startLabel}</span>
          <span className="wf-track"><span className="wf-bar wf-bar-total" style={bar(Math.exp(lo), w.startValue)} /></span>
          <span className="wf-value num">{formatYears(w.startValue)}</span>
        </li>
        {w.steps.map((s, i) => {
          const href = hrefOf(s.target);
          const r = s.to / s.from;
          return (
            <li key={i} className={`wf-step wf-k-${s.kind}`}>
              <span className="wf-label">
                {href ? <a href={href} title={s.label}>{s.label}</a> : <span className="wf-text" title={s.label}>{s.label}</span>}
                {KIND[s.kind] && <span className="wf-kind small">{KIND[s.kind]}</span>}
              </span>
              <span className="wf-track"><span className={`wf-bar ${r >= 1 ? "wf-up" : "wf-down"}`} style={bar(s.from, s.to)} /></span>
              <span className="wf-value num">{times(r)}</span>
            </li>
          );
        })}
        <li className="wf-step wf-end">
          <span className="wf-label">As shown on this page</span>
          <span className="wf-track"><span className="wf-bar wf-bar-total" style={bar(Math.exp(lo), w.end)} /></span>
          <span className="wf-value num">{formatYears(w.end)}</span>
        </li>
      </ol>
    </details>
  );
}

/** The waterfall in the page's evaluation section (the `[data-waterfall="<model id>"]` slot the page
 * renders there), from the model's island, which has the model, the reader's values and their edits. */
export function WaterfallInSlot(props: { model: ResolvedModel; av: Record<string, number>; edits: Record<string, number> }) {
  const [slot, setSlot] = useState<Element | null>(null);
  useEffect(() => setSlot(document.querySelector(`[data-waterfall="${CSS.escape(props.model.id)}"]`)), [props.model.id]);
  return slot ? createPortal(<Waterfall {...props} />, slot) : null;
}
