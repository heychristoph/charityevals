import { Fragment, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { lib } from "../lib/data";
import { assumptionValues, headline, type ResolvedModel } from "../engine/model";
import { parse, type Node } from "../engine/expr";
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

/** Plain words for the factors of a unit's conversion: what the number is, in a reader's terms. */
const PLAIN: Record<string, string> = {
  chicken_vs_person: "how much a chicken's day of pain counts against a person's",
  daly_per_sad: "healthy time a day of disabling pain costs, out of the 8,760 hours in a year",
  daly_per_wellby: "years of healthy life one point of life satisfaction for a year is worth",
  uov_per_daly: "doubled-income years one year of healthy life is worth",
};
type Factor = { value: string; label: string; by?: string; inv: boolean; href?: string };

/** A shared value as its slider shows it: hours for a fraction of a year, a percent, or a number. */
function show(row: { format?: string; shown_as?: { factor: number; format?: string } } | undefined, v: number): string {
  if (row?.shown_as) return `${Number((v * row.shown_as.factor).toPrecision(3))} hours`;
  return row?.format === "percent" ? `${Number((v * 100).toPrecision(3))}%` : `${Number(v.toPrecision(3))}`;
}

/** The factors that turn a result in `unit` into years of healthy life per $1,000 (model.ts headlineNode,
 * read for people): each shared value with its plain meaning and a link to its slider; a conversion that
 * isn't a plain product (climate's) as one factor. */
function conversionFactors(unit: string, model: ResolvedModel, evaluator: boolean, owner: string): Factor[] {
  const to = lib.assumptions.units[unit]?.to_common;
  if (!to || unit === "daly") return [{ value: "1,000", label: "per $1,000 instead of per dollar", inv: false }];
  const defaults = assumptionValues(lib.assumptions);
  const at = (id: string) => (evaluator && model.evaluator?.assumptions[id] !== undefined ? model.evaluator.assumptions[id] : defaults[id]);
  const parts: { node: Node; inv: boolean }[] = [];
  const split = (n: Node, inv: boolean) => {
    if (n.type === "bin" && (n.op === "*" || n.op === "/")) { split(n.left, inv); split(n.right, n.op === "/" ? !inv : inv); }
    else if (!(n.type === "num" && n.value === 1)) parts.push({ node: n, inv });
  };
  split(parse(to), false);
  const cancel = parts.findIndex((f) => !f.inv && f.node.type === "ref" && f.node.scope === "assumption" && f.node.name === "uov_per_daly");
  if (cancel >= 0) parts.splice(cancel, 1);
  else parts.push({ node: { type: "ref", scope: "assumption", name: "uov_per_daly" }, inv: true });
  const out: Factor[] = [];
  for (const { node, inv } of parts) {
    if (node.type !== "ref" || (node.scope !== "assumption" && node.scope !== "fact")) {
      // Not a plain product (a formula of several values): one factor, the method page explains it.
      return [{ value: "see how", label: `${lib.assumptions.units[unit]?.label ?? unit} become healthy years`, inv: false, href: `/method#${UNIT_SECTION[unit] ?? "healthy-years"}` }];
    }
    if (node.scope === "fact") {
      const f = lib.facts.get(node.name);
      out.push({ value: String(Number((typeof f?.value === "object" ? f.value.best ?? 0 : f?.value ?? 0).toPrecision(3))), label: f?.label ?? node.name, inv });
      continue;
    }
    const row = lib.assumptions.rows.find((r) => r.id === node.name);
    const v = at(node.name);
    const value = show(row, v);
    const pinned = evaluator && model.evaluator?.assumptions[node.name] !== undefined;
    // The start is the evaluator's own figure, so it uses their value; ours replaces it in a step below.
    const ours = pinned ? show(row, defaults[node.name]) : undefined;
    out.push({ value, label: PLAIN[node.name] ?? row?.label ?? node.name, by: pinned ? `${possessive(owner)} value; we use ${ours} (a step below)` : "your value", inv, href: `#a-${node.name}` });
  }
  out.push({ value: "1,000", label: "per $1,000 instead of per dollar", inv: false });
  return out;
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
  const unitLabel = lib.assumptions.units[w.native.unit]?.label ?? w.native.unit;
  // The unit's way into years of healthy life per $1,000, as the factors it multiplies by (the same
  // split as model.ts headlineNode: a healthy year's value in units of value cancels where it appears),
  // each at the rate the start uses: the evaluator's where it pinned one, else the site's default.
  const factors = conversionFactors(w.native.unit, model, w.start === "evaluator", owner);
  return (
    <details className="wf" open>
      <summary>
        <span className="wf-title">{w.start === "evaluator" ? `How ${possessive(owner)} figure becomes ours` : "How the model's figure becomes the one shown"}</span>
      </summary>
      {/* Their result in its own unit, times each factor that turns it into healthy years, equals the
          figure the steps start from. */}
      <h3 className="wf-h">{w.start === "evaluator" ? `${possessive(owner)} result in years of healthy life` : "The model's result in years of healthy life"}</h3>
      <div className="wf-eq" role="group" aria-label="How the result becomes years of healthy life">
        {w.reported && (
          <>
            <div className="wf-term">
              <span className="wf-term-num num">{fmtNative(w.reported.value)}</span>
              <span className="wf-term-label">{w.reported.unit}</span>
              <span className="wf-term-by">{w.start === "evaluator" ? `${possessive(owner)} final figure` : "the model's final figure"}</span>
            </div>
            <a className="wf-op wf-op-link" href={`#row-${model.output!.row}`} title="The model's own steps from their figure to this unit, in the tree above">→</a>
          </>
        )}
        <div className="wf-term">
          <span className="wf-term-num num">{fmtNative(w.native.value)}</span>
          <span className="wf-term-label">{unitLabel} per dollar</span>
          <span className="wf-term-by">{w.reported ? <a href={`#row-${model.output!.row}`}>our conversion of it (in the model above)</a> : w.start === "evaluator" ? `${possessive(owner)} result` : "the model's result"}</span>
        </div>
        {factors.map((f, i) => (
          <Fragment key={i}>
            <span className="wf-op" aria-label={f.inv ? "divided by" : "times"}>{f.inv ? "÷" : "×"}</span>
            {f.href ? (
              <a className="wf-term wf-term-link" href={f.href}>
                <span className="wf-term-num num">{f.value}</span>
                <span className="wf-term-label">{f.label}</span>
                {f.by && <span className="wf-term-by">{f.by}</span>}
              </a>
            ) : (
              <div className="wf-term">
                <span className="wf-term-num num">{f.value}</span>
                <span className="wf-term-label">{f.label}</span>
                {f.by && <span className="wf-term-by">{f.by}</span>}
              </div>
            )}
          </Fragment>
        ))}
        <span className="wf-op" aria-label="equals">=</span>
        <div className="wf-term wf-term-result">
          <span className="wf-term-num num">{formatYears(w.startValue)}</span>
          <span className="wf-term-label">years of healthy life per $1,000</span>
        </div>
      </div>
      <h3 className="wf-h">{w.start === "evaluator" ? `Where our figure differs from ${possessive(owner)}` : "From the model to the figure shown"}</h3>
      <ol className="wf-steps" style={{ paddingLeft: 0 }}>
        <li className="wf-step wf-end" style={{ marginTop: 0 }}>
          <span className="wf-label">{w.start === "evaluator" ? `As ${owner} calculates it` : "The model at the site's defaults"}</span>
          <span className="wf-track"><span className="wf-bar wf-bar-total" style={bar(Math.exp(lo), w.startValue)} /></span>
          <span className="wf-value num">{formatYears(w.startValue)}</span>
        </li>
        {w.steps.map((s, i) => {
          const href = hrefOf(s.target);
          const r = s.to / s.from;
          return (
            <li key={i} className={`wf-step wf-k-${s.kind}`} style={{ marginTop: 0 }}>
              <span className="wf-label">
                {href ? <a href={href} title={s.label}>{s.label}</a> : <span className="wf-text" title={s.label}>{s.label}</span>}
                {KIND[s.kind] && <span className="wf-kind small">{KIND[s.kind]}</span>}
              </span>
              <span className="wf-track"><span className={`wf-bar ${r >= 1 ? "wf-up" : "wf-down"}`} style={bar(s.from, s.to)} /></span>
              <span className="wf-value num">{times(r)}</span>
            </li>
          );
        })}
        <li className="wf-step wf-end" style={{ marginTop: 0 }}>
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
