// The working behind a step of "How it's worked out": a number opens into its formula with the numbers it
// reads ("= $1M ÷ $5.5"), and each of those opens in turn, down to the evidence and the reader's values.
// Read forward, from the money to the result, one level at a time.
import type { ReactNode } from "react";
import { lib } from "../lib/data";
import { pickValue, type ResolvedModel } from "../engine/model";
import { formulaText } from "../engine/derive";
import { formatAssumption, formatValue } from "../lib/format";
import { filledLabel, plain } from "./ModelTree";

/** A row, followed through rows that only pass another row along (`a = b`, the same number by another id). */
export function resolve(model: ResolvedModel, id: string): string {
  for (let hops = 0; hops < 50; hops++) {
    const f = model.byId.get(id)?.formula?.trim();
    if (!f || !/^[a-z][a-z0-9_]*$/.test(f) || !model.byId.has(f)) return id;
    id = f;
  }
  return id;
}

/** What a step's expression reads, as keys: `r:<row>`, and `c:` for `result`, the bottom line in years of
 * healthy life per $1,000 (the model's own result converted, Ctx.conversion). */
export function rootsOf(model: ResolvedModel, text: string): string[] {
  const ids = [...text.matchAll(/\b([a-z][a-z0-9_]*)\b/g)].map((m) => m[1]);
  return [...new Set(ids.flatMap((id) => (id === "result" ? ["c:"] : model.byId.has(id) ? [`r:${resolve(model, id)}`] : [])))];
}

/** A row's formula as it is computed: with the weights the engine applies (side effects, lives that never
 * start) and derived values written out, so its numbers always add up. */
function computed(model: ResolvedModel, id: string): string | undefined {
  const r = model.byId.get(id);
  return r?.node ? formulaText(r.node) : r?.formula;
}

type Token = { text: string; key?: string };
/** One factor of the bottom line: how it joins, its value, what it is, and what it opens into. */
export type Factor = { op?: string; value: string; label: string; key?: string };
const TOKEN = /\$([a-z_][a-z0-9_]*)|@([a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*)|#([a-z0-9:-]+)|\b([a-z][a-z0-9_]*)\b(?!\s*\()/gi;
const op = (s: string) => s.replace(/\*/g, " × ").replace(/\//g, " ÷ ").replace(/\s+/g, " ");

/** A formula with each number it reads in place of its name; `key` names what that number opens into:
 * `r:<row>`, `a:<assumption>` or `f:<fact>`. */
function tokens(formula: string, model: ResolvedModel, values: Record<string, number>, av: Record<string, number>): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of formula.matchAll(TOKEN)) {
    out.push({ text: op(formula.slice(last, m.index)) });
    last = m.index! + m[0].length;
    if (m[1]) {
      const a = lib.assumptions.rows.find((x) => x.id === m[1]);
      out.push(a ? { text: formatAssumption(a, av[a.id]), key: `a:${a.id}` } : { text: m[0] });
    } else if (m[2]) {
      const f = lib.facts.get(m[2]);
      out.push(f ? { text: formatValue(pickValue(f.value), f.format), key: `f:${m[2]}` } : { text: m[0] });
    } else if (m[3]) {
      // Another model's live result: its own page holds its working.
      out.push({ text: formatValue(values[`#${m[3]}`]) });
    } else {
      const r = model.byId.get(m[4]);
      out.push(r ? { text: formatValue(values[r.id], r.format === "integer" ? "number" : r.format), key: `r:${resolve(model, r.id)}` } : { text: m[0] });
    }
  }
  out.push({ text: op(formula.slice(last)) });
  return out;
}

/** What a reference opens into, by its key. */
export type Ctx = {
  model: ResolvedModel;
  values: Record<string, number>;
  av: Record<string, number>;
  open: Set<string>;
  toggle: (key: string) => void;
  /** The bottom line: the model's own result turned into years of healthy life per $1,000, one factor a
   * line (the tree's top row: tree.ts rootOf), each opening where it is a row, a value of yours or a fact. */
  conversion: { value: string; label: string; factors: Factor[] };
};

function tokenButtons(ctx: Ctx, key: string, formula: string) {
  return tokens(formula, ctx.model, ctx.values, ctx.av).map((t, i) =>
    t.key ? (
      <button key={i} type="button" className={`wk-tok num ${ctx.open.has(`${key}/${t.key}`) ? "open" : ""}`} aria-expanded={ctx.open.has(`${key}/${t.key}`)} onClick={() => ctx.toggle(`${key}/${t.key}`)}>{t.text}</button>
    ) : <span key={i}>{t.text}</span>,
  );
}

export function Node({ ctx, at, path }: { ctx: Ctx; at: string; path: string }) {
  const [kind, id] = [at.slice(0, 1), at.slice(2)];
  const key = `${path}/${at}`;
  let label: string, value: string, body: ReactNode;
  if (kind === "a") {
    const a = lib.assumptions.rows.find((x) => x.id === id)!;
    label = filledLabel(a, ctx.av[id]);
    value = formatAssumption(a, ctx.av[id]);
    body = <span className="wk-src">{a.fixed ? "A fixed rate, shared by every model" : <>Your value. <a href={`#a-${id}`}>Change it</a></>}</span>;
  } else if (kind === "f") {
    const f = lib.facts.get(id)!;
    label = f.label;
    value = formatValue(pickValue(f.value), f.format);
    body = <span className="wk-src">{f.kind === "judgment" ? "A judgment" : "Shared data"}{f.source?.title ? <>, {f.source.url ? <a href={f.source.url} rel="noopener">{f.source.title}</a> : f.source.title}</> : ""}</span>;
  } else if (kind === "c") {
    label = ctx.conversion.label;
    value = ctx.conversion.value;
    body = (
      <ul className="wk-factors">
        {ctx.conversion.factors.map((f, i) => (
          <li key={i}>
            <span className="wk-op">{f.op ?? "="}</span>{" "}
            {f.key
              ? <button type="button" className={`wk-tok num ${ctx.open.has(`${key}/${f.key}`) ? "open" : ""}`} aria-expanded={ctx.open.has(`${key}/${f.key}`)} onClick={() => ctx.toggle(`${key}/${f.key}`)}>{f.value}</button>
              : <span className="num">{f.value}</span>}{" "}
            <span className="wk-src">{f.label}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    const r = ctx.model.byId.get(id)!;
    const f = computed(ctx.model, id);
    label = plain(r.label);
    value = formatValue(ctx.values[id], r.format === "integer" ? "number" : r.format);
    body = f ? (
      <>= {tokenButtons(ctx, key, f)}</>
    ) : (
      <span className="wk-src">{r.kind === "judgment" ? "A judgment" : r.kind === "observed" ? "Observed data" : "An estimate"}{ctx.model.evaluator?.name ? ` by ${ctx.model.evaluator.name}` : ""}{r.source?.title ? <>, {r.source.url ? <a href={r.source.url} rel="noopener">{r.source.title}</a> : r.source.title}</> : ""}</span>
    );
  }
  const formula = kind === "r" ? computed(ctx.model, id) : undefined;
  const children = kind === "c"
    ? ctx.conversion.factors.filter((f) => f.key && ctx.open.has(`${key}/${f.key}`)).map((f) => ({ key: f.key }))
    : formula ? tokens(formula, ctx.model, ctx.values, ctx.av).filter((t) => t.key && ctx.open.has(`${key}/${t.key}`)) : [];
  const seen = new Set<string>();
  return (
    <div className="wk-node" id={`wk-${key}`}>
      <div className="wk-head"><span className="wk-l">{label}</span><span className="wk-n num">{value}</span></div>
      <div className="wk-f">{body}</div>
      {children.filter((t) => !seen.has(t.key!) && seen.add(t.key!)).map((t) => <Node key={t.key} ctx={ctx} at={t.key!} path={key} />)}
    </div>
  );
}

/** The keys to open, from a step down to `target` (`r:`, `a:` or `f:` key), shortest first; undefined
 * when no step reaches it. Each step's roots are `s<i>/<root key>`; `factors` are the bottom line's. */
export function pathTo(model: ResolvedModel, steps: { line: string; roots: string[] }[], target: string, factors: Factor[]): string[] | undefined {
  const want = target.startsWith("r:") ? `r:${resolve(model, target.slice(2))}` : target;
  type Item = { ref: string; keys: string[] };
  const queue: Item[] = steps.flatMap((s) => s.roots.map((r) => ({ ref: r, keys: [s.line, `${s.line}/${r}`] })));
  const seen = new Set<string>();
  for (let i = 0; i < queue.length; i++) {
    const { ref, keys } = queue[i];
    if (ref === want) return keys;
    if (seen.has(ref) || !(ref.startsWith("r:") || ref === "c:")) continue;
    seen.add(ref);
    if (ref === "c:") {
      for (const x of factors) if (x.key) queue.push({ ref: x.key, keys: [...keys, `${keys[keys.length - 1]}/${x.key}`] });
      continue;
    }
    const f = computed(model, ref.slice(2));
    if (!f) continue;
    for (const m of f.matchAll(TOKEN)) {
      const k = m[1] ? `a:${m[1]}` : m[2] ? `f:${m[2]}` : m[4] && model.byId.has(m[4]) ? `r:${resolve(model, m[4])}` : undefined;
      if (k) queue.push({ ref: k, keys: [...keys, `${keys[keys.length - 1]}/${k}`] });
    }
  }
}
