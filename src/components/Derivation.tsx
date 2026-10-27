import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { lib, modelUrl, rawFacts } from "../lib/data";
import { buildLibrary, comparable, compute, type ResolvedModel, type View } from "../engine/model";
import type { Node } from "../engine/expr";
import { leverage, needsParens, resolveAlias, stepOf, valueOf, type Ref } from "../engine/derive";
import { useAssumptionValues, useResultsFor } from "../lib/use-results";
import { useView } from "../lib/assumption-state";
import { formatMultiple, formatValue } from "../lib/format";
import { oneIn } from "../lib/comparables";
import "./derivation.css";

/** One evaluator's current model of this charity, as offered by the toggle. */
export type Choice = { id: string; owner: string; bulk: boolean };

type Ctx = {
  m: ResolvedModel;
  values: Record<string, number>;
  av: Record<string, number>;
  lagAv: Record<string, number>;
  view: View;
  base: number;
};

const FN: Record<string, string> = {
  sum: "sum", avg: "average", min: "smaller of", max: "larger of", ln: "ln", log10: "log₁₀", exp: "exp", abs: "abs",
  if: "if", iferror: "if valid", product: "product", median: "median", sqrt: "√", round: "round", roundup: "round up",
  rounddown: "round down", pv: "present value", pv_annuity_due: "present value", and: "all of", or: "any of", not: "not",
};
const OP: Record<string, string> = { "*": "×", "/": "÷", "+": "+", "-": "−", "^": "^", "=": "=", "<>": "≠", "<": "<", ">": ">", "<=": "≤", ">=": "≥" };

const fmtNum = (x: number) => formatValue(x, Math.abs(x) > 0 && Math.abs(x) < 0.001 ? "small" : "number");

function labelOf(m: ResolvedModel, ref: Ref): string {
  if (ref.scope === "assumption") return lib.assumptions.rows.find((r) => r.id === ref.id)?.label ?? ref.id;
  if (ref.scope === "fact") return lib.facts.get(ref.id)?.label ?? ref.id;
  return m.byId.get(ref.id)?.label || ref.id.replace(/_/g, " ");
}

function formatOf(m: ResolvedModel, ref: Ref) {
  if (ref.scope === "row") return m.byId.get(ref.id)?.format;
  if (ref.scope === "assumption") return lib.assumptions.rows.find((r) => r.id === ref.id)?.format;
  return lib.facts.get(ref.id)?.format;
}

const show = (m: ResolvedModel, ref: Ref, v: number) => {
  const f = formatOf(m, ref);
  return f && f !== "number" && f !== "small" ? formatValue(v, f) : fmtNum(v);
};

/** "10% higher → result +6.2%": the elasticity, read as a what-if. */
function Leverage({ e }: { e: number | undefined }) {
  if (e === undefined) return <span className="dv-lev dv-lev-none">no effect at 0</span>;
  const pct = e * 10;
  const text = Math.abs(pct) < 0.05 ? "barely moves the result" : `result ${pct > 0 ? "+" : "−"}${Math.abs(pct) >= 10 ? Math.abs(pct).toFixed(0) : Math.abs(pct).toFixed(1)}%`;
  return (
    <span className="dv-lev" title={`If this number were 10% higher, the bottom line would change by about ${pct.toFixed(1)}%.`}>
      <span className="dv-lev-track" aria-hidden><span className={`dv-lev-bar ${e < 0 ? "neg" : ""}`} style={{ width: `${Math.min(Math.abs(e), 1) * 100}%` }} /></span>
      <span className="num">{text}</span>
    </span>
  );
}

/** One number in a formula: label, value, leverage; calculated rows open into their own formula. */
function Term({ ctx, refn, open, onToggle }: { ctx: Ctx; refn: Ref; open: boolean; onToggle: () => void }) {
  const { m, values, lagAv, view } = ctx;
  const target = refn.scope === "row" ? resolveAlias(m, refn.id).id : refn.id;
  const ref: Ref = refn.scope === "row" ? { scope: "row", id: target } : refn;
  const v = refn.scope === "row" ? values[ref.id] : valueOf(lib, m, values, ctx.av, view, { type: "ref", scope: refn.scope, name: refn.id });
  const e = useMemo(() => leverage(lib, m, lagAv, view, ref, v, ctx.base), [m, lagAv, view, ref.scope, ref.id, v, ctx.base]);
  const row = ref.scope === "row" ? m.byId.get(ref.id) : undefined;
  const opens = !!row?.node;
  const label = labelOf(m, refn.scope === "row" ? { scope: "row", id: refn.id } : refn);
  const odds = oneIn(label, v);
  const body = (
    <>
      <span className="dv-label">
        {ref.scope === "assumption" && <span className="kind-dot kind-judgment" aria-hidden />}
        {row && !row.node && row.kind && <span className={`kind-dot kind-${row.kind}`} aria-hidden />}
        {label}
      </span>
      <span className="dv-val num">{show(m, ref, v)}{odds && <span className="dv-odds"> {odds}</span>}</span>
      <Leverage e={e} />
    </>
  );
  if (opens)
    return (
      <button type="button" className={`dv-term dv-opens ${open ? "open" : ""}`} aria-expanded={open} onClick={onToggle}>
        {body}
        <span className="dv-more small"><ChevronRight size={14} aria-hidden className="dv-chev" />{open ? "Hide" : "How it's calculated"}</span>
      </button>
    );
  const href = ref.scope === "assumption" ? `#a-${ref.id}` : ref.scope === "fact" ? `/assumptions#f-${ref.id}` : `#row-${ref.id}`;
  const note = ref.scope === "assumption" ? "Your assumption" : ref.scope === "fact" ? "Shared fact" : row?.kind === "judgment" ? "Judgment" : "Input";
  return (
    <a className={`dv-term dv-leaf dv-${ref.scope}`} href={href}>
      {body}
      <span className="dv-more small">{note}{ref.scope === "assumption" ? ": change it" : ": see source"}</span>
    </a>
  );
}

/** A formula as an equation of terms, with the operators between them. */
function Equation({ ctx, node, opened, toggle }: { ctx: Ctx; node: Node; opened: string[]; toggle: (k: string) => void }) {
  const render = (n: Node, parent?: string, right = false): ReactNode => {
    switch (n.type) {
      case "num": return <span className="dv-const num">{fmtNum(n.value)}</span>;
      case "ref": {
        const key = `${n.scope}:${n.name}`;
        return <Term ctx={ctx} refn={{ scope: n.scope, id: n.name }} open={opened.includes(key)} onToggle={() => toggle(key)} />;
      }
      case "neg": return <><span className="dv-op">−</span>{render(n.arg, "*", true)}</>;
      case "call":
        return (
          <span className="dv-group">
            <span className="dv-fn">{FN[n.fn] ?? n.fn}</span><span className="dv-paren">(</span>
            {n.args.map((a, i) => <span key={i} className="dv-arg">{i > 0 && <span className="dv-op dv-comma">,</span>}{render(a)}</span>)}
            <span className="dv-paren">)</span>
          </span>
        );
      case "bin": {
        const inner = <>{render(n.left, n.op)}<span className="dv-op">{OP[n.op]}</span>{render(n.right, n.op, true)}</>;
        return needsParens(n, parent, right) ? <span className="dv-group"><span className="dv-paren">(</span>{inner}<span className="dv-paren">)</span></span> : inner;
      }
    }
  };
  return <div className="dv-eq">{render(node)}</div>;
}

/** A sum, as the shares it's made of: where the value comes from. */
function Shares({ ctx, terms, opened, toggle }: { ctx: Ctx; terms: { node: Node; sign: 1 | -1 }[]; opened: string[]; toggle: (k: string) => void }) {
  const [all, setAll] = useState(false);
  const parts = terms
    .map((t) => ({ ...t, v: t.sign * valueOf(lib, ctx.m, ctx.values, ctx.av, ctx.view, t.node) }))
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
  const pos = parts.filter((p) => p.v > 0);
  const total = pos.reduce((s, p) => s + p.v, 0);
  const shown = all ? parts : parts.slice(0, 6);
  const rest = parts.slice(6);
  const restShare = total ? rest.filter((p) => p.v > 0).reduce((s, p) => s + p.v, 0) / total : 0;
  const tint = (i: number) => `color-mix(in srgb, var(--cause) ${Math.max(22, 88 - i * 13)}%, white)`;
  return (
    <div className="dv-shares">
      {total > 0 && (
        <div className="dv-bar" role="img" aria-label={pos.slice(0, 6).map((p) => `${Math.round((p.v / total) * 100)}%`).join(", ")}>
          {pos.map((p, i) => <span key={i} style={{ width: `${(p.v / total) * 100}%`, background: tint(i) }} />)}
        </div>
      )}
      <ol className="dv-parts">
        {shown.map((p, i) => (
          <li key={i}>
            <span className="dv-swatch" style={{ background: p.v > 0 ? tint(pos.indexOf(p)) : "transparent" }} aria-hidden />
            <span className="dv-share num">{p.v < 0 ? "−" : total ? `${Math.round((p.v / total) * 100)}%` : ""}</span>
            <Equation ctx={ctx} node={p.node} opened={opened} toggle={toggle} />
          </li>
        ))}
      </ol>
      {rest.length > 0 && (
        <button type="button" className="link-button small" onClick={() => setAll(!all)}>
          {all ? "Show fewer" : `Show ${rest.length} smaller ${rest.length === 1 ? "part" : "parts"} (${Math.round(restShare * 100)}% together)`}
        </button>
      )}
    </div>
  );
}

/** A calculated row unfolded: its formula, then whatever the reader opens inside it. */
function Unfold({ ctx, rowId, depth }: { ctx: Ctx; rowId: string; depth: number }) {
  const { id, via } = resolveAlias(ctx.m, rowId);
  const step = stepOf(ctx.m, id);
  const [opened, setOpened] = useState<string[]>([]);
  const toggle = (k: string) => setOpened((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));
  if (step.type === "input") return null;
  const children = opened.filter((k) => k.startsWith("row:")).map((k) => k.slice(4));
  const r = ctx.m.byId.get(id)!;
  return (
    <div className={`dv-step ${depth ? "dv-nested" : ""}`}>
      <p className="dv-head">
        <span className="dv-head-label">{r.label || id}</span>
        {via.length > 0 && <span className="muted small"> (used as {via.map((v) => ctx.m.byId.get(v)?.label || v).join(", then ")})</span>}
        <span className="dv-eqsign"> = </span>
        <span className="dv-head-val num">{show(ctx.m, { scope: "row", id }, ctx.values[id])}</span>
      </p>
      {step.type === "sum"
        ? <Shares ctx={ctx} terms={step.terms} opened={opened} toggle={toggle} />
        : <Equation ctx={ctx} node={step.node} opened={opened} toggle={toggle} />}
      {children.map((c) => <Unfold key={c} ctx={ctx} rowId={c} depth={depth + 1} />)}
    </div>
  );
}

function useFullModel(choice: Choice, page: ResolvedModel) {
  const local = choice.id === page.id ? page : !choice.bulk ? lib.models.get(choice.id) : undefined;
  const [loaded, setLoaded] = useState<Record<string, ResolvedModel | "error">>({});
  useEffect(() => {
    if (local || loaded[choice.id]) return;
    let live = true;
    fetch(`/models/${choice.id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((raw) => {
        const m = buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()]).models.get(choice.id);
        if (live) setLoaded((l) => ({ ...l, [choice.id]: m ?? "error" }));
      })
      .catch(() => live && setLoaded((l) => ({ ...l, [choice.id]: "error" })));
    return () => { live = false; };
  }, [choice.id, local, loaded]);
  return local ?? loaded[choice.id];
}

export default function Derivation({ model, choices }: { model: ResolvedModel; choices: Choice[] }) {
  const [sel, setSel] = useState(model.id);
  const choice = choices.find((c) => c.id === sel) ?? { id: model.id, owner: model.owner, bulk: !!model.bulk };
  const m = useFullModel(choice, model);
  const av = useAssumptionValues();
  const lagAv = useDeferredValue(av);
  const pageView = useView();
  const results = useResultsFor(choices.map((c) => lib.models.get(c.id)!));
  const ready = m && m !== "error" ? m : undefined;
  const view: View = pageView === "evaluator" && ready?.evaluator ? "evaluator" : "charityevals";
  const ctx = useMemo<Ctx | undefined>(() => {
    if (!ready?.output) return undefined;
    const values = compute(lib, ready, av, {}, view);
    return { m: ready, values, av, lagAv, view, base: values[ready.output.row] };
  }, [ready, av, lagAv, view]);
  const owner = (id: string) => lib.owners.get(id)?.name ?? id;

  return (
    <section className="derivation" aria-labelledby="dv-title" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <h2 id="dv-title">How the number is built</h2>
      <p className="dv-intro">
        Open any number to see how it's calculated. The bar under each shows how much it moves the result.
      </p>
      {choices.length > 1 && (
        <div className="dv-owners" role="tablist" aria-label="Evaluator">
          {choices.map((c) => {
            const r = results.find((x) => x.model.id === c.id);
            const cm = lib.models.get(c.id);
            return (
              <button key={c.id} type="button" role="tab" aria-selected={c.id === sel} className="dv-owner" onClick={() => setSel(c.id)}>
                {owner(c.owner)}
                {r && cm && <span className="num dv-owner-val">{comparable(lib, cm) ? formatMultiple(r.central) : "not ranked"}</span>}
              </button>
            );
          })}
        </div>
      )}
      {choice.id !== model.id && ready && (
        <p className="small muted dv-switched">
          {owner(choice.owner)}'s model: <a href={modelUrl(lib, lib.models.get(choice.id)!)}>{ready.name}</a>
        </p>
      )}
      <div role={choices.length > 1 ? "tabpanel" : undefined} className="dv-panel" key={choice.id}>
        {m === "error" && (
          <p className="small">This model didn't load. <a href={modelUrl(lib, lib.models.get(choice.id)!)}>Open it on its own page</a>.</p>
        )}
        {!m && <p className="small muted dv-loading">Loading {owner(choice.owner)}'s model…</p>}
        {ctx && <Unfold ctx={ctx} rowId={ctx.m.output!.row} depth={0} />}
      </div>
    </section>
  );
}
