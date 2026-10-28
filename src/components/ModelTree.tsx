// "How the pieces fit together": the whole model as an expandable tree. The bottom line sits at the
// top; each number opens into the numbers it's made from, each marked with how it joins them (× ÷ + −)
// and a bar for how much the bottom line moves if it were 10% higher. Leaves say what they are: your
// assumption (linked to its slider), a shared fact (with its source) or the evaluator's input.
// Only opened nodes are ever computed, so an 8,000-row model costs no more to show than a small one.
import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronRight, ExternalLink, Search, X } from "lucide-react";
import { lib, modelFile, modelUrl } from "../lib/data";
import { hasRange, inputRange, pickValue, type ResolvedModel, type View } from "../engine/model";
import type { Node } from "../engine/expr";
import { childrenOf, lookupFor, pathTo, rootOf, shapeOf, type TreeNode } from "../engine/tree";
import { formulaText } from "../engine/derive";
import { rowsFeeding } from "../engine/sensitivity";
import type { Uncertainty } from "../engine/uncertainty";
import { useAssumptionValues } from "../lib/use-results";
import { formatValue } from "../lib/format";
import { oneIn } from "../lib/comparables";
import { track } from "../lib/analytics";
import { Markdown } from "./AssumptionsPanel";
import "./tree.css";

/** Parts shown before "n more": the ones with the most leverage, in the formula's own order. */
const CAP = 6;
/** The pending-focus key for the card of a row the bottom line doesn't use. */
const ORPHAN = "@orphan";
const KIND = { observed: "observed", estimate: "estimate", judgment: "judgment" } as const;
const SPOKEN: Record<string, string> = { "×": "times", "÷": "divided by", "+": "plus", "−": "minus", "^": "to the power of" };

const fmtNum = (x: number) => formatValue(x, Math.abs(x) > 0 && Math.abs(x) < 0.001 ? "small" : "number");

/** A formula with every reference named and linked: rows open in the tree, assumptions go to their slider. */
export function Formula({ text, model }: { text: string; model: ResolvedModel }) {
  const parts = text.split(/(@[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*|\$?[a-z_][a-z0-9_]*)/gi);
  return (
    <code className="formula">
      {parts.map((p, i) => {
        if (p.startsWith("@")) {
          const f = lib.facts.get(p.slice(1));
          return f ? <a key={i} href={`/assumptions#f-${f.key}`} title={`Shared fact: ${f.group}`} className="ref ref-f">{f.group}: {f.label}</a> : p;
        }
        if (p.startsWith("$")) {
          const a = lib.assumptions.rows.find((r) => r.id === p.slice(1));
          return a ? <a key={i} href={`#a-${a.id}`} title={a.label} className="ref ref-a">{a.label}</a> : p;
        }
        const r = model.byId.get(p);
        return r ? <a key={i} href={`#row-${r.id}`} title={r.label} className="ref">{r.label}</a> : <Fragment key={i}>{p}</Fragment>;
      })}
    </code>
  );
}

const assumptionRow = (id: string) => lib.assumptions.rows.find((r) => r.id === id);
const rowLabel = (m: ResolvedModel, id: string) => m.byId.get(id)?.label || id.replace(/_/g, " ");

/** A sub-formula read in words: "Cost per net + Delivery cost", shortened when long. */
function exprLabel(m: ResolvedModel, n: Node, depth = 0): string {
  const s = (() => {
    switch (n.type) {
      case "num": return fmtNum(n.value);
      case "ref": return n.scope === "row" ? rowLabel(m, n.name) : n.scope === "assumption" ? assumptionRow(n.name)?.label ?? n.name : lib.facts.get(n.name)?.label ?? n.name;
      case "neg": return `−${exprLabel(m, n.arg, depth + 1)}`;
      default: {
        const sh = shapeOf(n);
        const inner = sh.parts.map((p, i) => `${p.op ? `${p.op} ` : i ? ", " : ""}${exprLabel(m, p.node, depth + 1)}`).join(" ").replace(/ ,/g, ",");
        const body = sh.how && n.type === "call" ? `${sh.how} (${inner})` : inner;
        return depth ? `(${body})` : body;
      }
    }
  })();
  return depth === 0 && s.length > 90 ? `${s.slice(0, 88).trimEnd()}…` : s;
}

function labelOf(m: ResolvedModel, n: TreeNode): string {
  if (n.named) return rowLabel(m, n.named);
  if (n.type === "assumption") return assumptionRow(n.refId!)?.label ?? n.refId!;
  if (n.type === "fact") return lib.facts.get(n.refId!)?.label ?? n.refId!;
  if (n.type === "const") return "Fixed number in the formula";
  if (n.type === "expr") return exprLabel(m, n.expr!);
  return rowLabel(m, n.rowId!);
}

function show(m: ResolvedModel, n: TreeNode): string {
  // The row named in the formula speaks first (it carries the label shown), then the rows it passed
  // through, then the number it ends at.
  const own = [n.named, ...n.via].map((id) => (id ? m.byId.get(id)?.format : undefined)).find(Boolean);
  const f = own ?? (n.rowId ? m.byId.get(n.rowId)?.format : n.type === "assumption" ? assumptionRow(n.refId!)?.format : n.type === "fact" ? lib.facts.get(n.refId!)?.format : undefined);
  return f && f !== "number" && f !== "small" && f !== "toggle" ? formatValue(n.value, f) : fmtNum(n.value);
}

/** The row with a published range this node stands for: the row the formula names, a row it passed
 * through on the way, or the row it ends at. */
function rangedRowOf(u: Uncertainty, n: TreeNode): string | undefined {
  return [n.named, ...n.via, n.rowId].find((id): id is string => !!id && u.ranged.has(id));
}

/** What the bars measure: the result's change if a number were 10% higher, or the share of the
 * result's uncertainty that comes through a number (its leverage times how well it's known). */
export type Metric = "spread" | "lever";

/** Share of the bottom line's uncertainty coming through this node: its leverage on the result,
 * squared, times the variance of its own logarithm. */
function spreadShare(u: Uncertainty, n: TreeNode): number {
  if (!u.rootVar || n.e === undefined) return 0;
  const ranged = rangedRowOf(u, n);
  const v = ranged ? u.rowVar(ranged)
    : n.type === "assumption" || n.type === "fact" ? u.leafVar(n.type, n.refId!)
    : n.rowId ? u.rowVar(n.rowId)
    : n.expr ? u.exprVar(n.expr)
    : 0;
  return Math.min(1, (n.e ** 2 * v) / u.rootVar);
}

const shareText = (x: number) => (x < 0.005 ? "<1%" : `${Math.round(x * 100)}%`);

/** "+6.2%": the bottom line's change if this number were 10% higher. */
function leverText(e: number | undefined): string {
  if (e === undefined) return "—";
  const pct = e * 10;
  if (Math.abs(pct) < 0.05) return "0%";
  const a = Math.abs(pct);
  return `${pct > 0 ? "+" : "−"}${a >= 10 ? a.toFixed(0) : a.toFixed(1)}%`;
}

type Ctx = {
  m: ResolvedModel;
  look: ReturnType<typeof lookupFor>;
  view: View;
  open: Set<string>;
  all: Set<string>;
  focus: string;
  flash?: string;
  metric: Metric;
  u: Uncertainty;
  /** The bar's length, 0–1, under the current metric. */
  weight: (n: TreeNode) => number;
  toggle: (n: TreeNode, depth: number) => void;
  showAll: (key: string) => void;
  fx: Set<string>;
  toggleFx: (key: string) => void;
  setFocus: (key: string) => void;
};

const domId = (key: string) => `tn-${key.replace(/\./g, "-")}`;
const isBranch = (n: TreeNode) => !!n.expr;

/** What a node is, in a word or two, beside its label. */
function Tag({ ctx, n, id }: { ctx: Ctx; n: TreeNode; id: string }) {
  const row = n.rowId ? ctx.m.byId.get(n.rowId) : undefined;
  const evaluator = ctx.m.evaluator?.name;
  if (n.type === "assumption") return <span id={id} className="tn-tag tn-tag-a"><span className="kind-dot kind-judgment" aria-hidden />your assumption</span>;
  if (n.type === "fact") return <span id={id} className="tn-tag tn-tag-f">shared fact</span>;
  if (n.type === "input" && row) {
    return (
      <span id={id} className={`tn-tag tn-tag-${row.kind ?? "observed"}`}>
        <span className={`kind-dot kind-${row.kind ?? "observed"}`} aria-hidden />
        {evaluator ?? "input"}{row.kind ? ` ${KIND[row.kind]}` : ""}
      </span>
    );
  }
  return null;
}

/** The raw formula behind a node, for readers who want it. */
function formulaOf(m: ResolvedModel, n: TreeNode): string | undefined {
  if (n.type === "expr") return formulaText(n.expr!);
  return (n.rowId ? m.byId.get(n.rowId)?.formula : undefined) ?? (n.named ? m.byId.get(n.named)?.formula : undefined);
}

/** What an open node is and where it comes from, as lines of prose. */
function detailLines(ctx: Ctx, n: TreeNode, parentLabel?: string): ReactNode[] {
  const { m, view } = ctx;
  const row = n.rowId ? m.byId.get(n.rowId) : undefined;
  const named = n.named ? m.byId.get(n.named) : undefined;
  const evaluator = m.evaluator?.name;
  const lines: ReactNode[] = [];
  const explainer = named?.explainer ?? row?.explainer;
  if (n.type === "assumption") {
    const a = assumptionRow(n.refId!);
    lines.push(<p key="a">One of the shared assumptions every model uses, and yours to set. <a href={`#a-${n.refId}`}>Adjust it</a>.</p>);
    if (a?.explainer) lines.push(<div key="ax" className="tn-explainer"><Markdown text={a.explainer} /></div>);
  } else if (n.type === "fact") {
    const f = lib.facts.get(n.refId!);
    lines.push(
      <p key="f">
        Shared fact from <a href={`/assumptions#f-${f?.key ?? n.refId}`}>{f?.group ?? "the facts"}</a>: every model that needs it reads the same value.
        {f?.source?.title && <> Source: {f.source.url ? <a href={f.source.url}>{f.source.title}</a> : f.source.title}.</>}
      </p>,
    );
  } else if (n.type === "const") {
    lines.push(<p key="c">A number written into {parentLabel ? <>the formula for {parentLabel}</> : "the formula"} itself, such as a unit conversion or a fixed adjustment.</p>);
  }
  if (explainer) lines.push(<div key="x" className="tn-explainer"><Markdown text={explainer} /></div>);
  if (n.type === "input" && row) {
    const range = inputRange(row, view);
    if (hasRange(range)) lines.push(<p key="r">Plausible range <span className="num">{formatValue(pickValue(range, "low"), row.format)} – {formatValue(pickValue(range, "high"), row.format)}</span>.</p>);
    if (row.published !== undefined) {
      const other = view === "evaluator" ? row.value : row.published;
      lines.push(<p key="p" className="tn-differs">{view === "evaluator" ? "charityevals uses" : `${evaluator ?? "The evaluator"} uses`} <span className="num">{formatValue(pickValue(other), row.format)}</span> here.</p>);
    }
  }
  // A calculated row can carry a published uncertainty range (e.g. GiveWell's 25th–75th percentile);
  // sensitivity varies the row across it.
  if (row?.node && row.range) {
    lines.push(
      <p key="cr">
        Reported range <span className="num">{formatValue(row.range.low, row.format)} – {formatValue(row.range.high, row.format)}</span>
        {row.range.note ? <>: {row.range.note}</> : "."}
      </p>,
    );
  }
  const src = row?.source ?? named?.source;
  if (src && n.type !== "fact") {
    lines.push(
      <p key="s" className="tn-source">
        Source:{" "}
        {src.url ? <a href={src.url}>{src.title ?? "link"} <ExternalLink size={12} aria-hidden /></a> : src.title}
        {src.cell && <>{src.title || src.url ? ", " : ""}cell <code>{src.cell}</code>{m.source?.sheet && <> in <a href={m.source.sheet}>the original sheet</a></>}</>}
      </p>,
    );
  }
  if (n.via.length > 1 || (n.via.length === 1 && n.via[0] !== n.named)) {
    lines.push(<p key="v">Passed along unchanged by {n.via.map((v) => rowLabel(m, v)).join(" → ")}.</p>);
  }
  if (row?.inheritedFrom) {
    const parent = lib.models.get(row.inheritedFrom);
    if (parent) lines.push(<p key="i">Defined in <a href={modelUrl(lib, parent)}>{parent.name}</a>{row.overridden?.length ? `; this model changes its ${row.overridden.join(", ")}` : ""}.</p>);
  }
  return lines;
}

function Detail({ ctx, n, id, lines, formula }: { ctx: Ctx; n: TreeNode; id: string; lines: ReactNode[]; formula?: string }) {
  if (!lines.length && !formula) return null;
  return (
    <div className="tn-detail small" id={id}>
      {lines}
      {formula && (
        <div className="tn-formula" id={`${id}-fx`}>
          <span className="tn-formula-label">Formula{n.type === "expr" ? " of this part" : ""}</span>
          <Formula text={formula} model={ctx.m} />
        </div>
      )}
    </div>
  );
}

function Item({ ctx, n, depth, pos, size, parentLabel, under }: { ctx: Ctx; n: TreeNode; depth: number; pos: number; size: number; parentLabel?: string; under?: string }) {
  const { m, look, open, all } = ctx;
  const isOpen = open.has(n.key);
  const branch = isBranch(n);
  const id = domId(n.key);
  const label = labelOf(m, n);
  const spread = ctx.metric === "spread";
  // Below a row whose own published range stands for its uncertainty, parts add none of their own.
  const rangedRow = rangedRowOf(ctx.u, n);
  const ranged = !!rangedRow;
  const below = under ?? (ranged ? label : undefined);
  const kids = isOpen && branch ? childrenOf(m, n, look) : [];
  // The parts with the most leverage, kept in formula order; the rest behind "n more".
  const ranked = [...kids].sort((a, b) => (spread && (under || ranged) ? Math.abs(b.e ?? 0) - Math.abs(a.e ?? 0) : ctx.weight(b) - ctx.weight(a)));
  const shown = all.has(n.key) || kids.length <= CAP + 1 ? kids : kids.filter((k) => ranked.indexOf(k) < CAP);
  const hidden = kids.filter((k) => !shown.includes(k));
  const hiddenWeight = hidden.reduce((s, k) => s + (spread && !(under || ranged) ? ctx.weight(k) : Math.abs(k.e ?? 0)), 0);
  const how = n.expr ? shapeOf(n.expr).how : undefined;
  const odds = oneIn(label, n.value);
  const e = n.e;
  const root = depth === 1;
  const share = spread && !under ? ctx.weight(n) : 0;
  const formula = isOpen ? formulaOf(m, n) : undefined;
  const fxOpen = !!formula && ctx.fx.has(n.key);
  const lines = isOpen ? detailLines(ctx, n, parentLabel) : [];
  const hasDetail = lines.length > 0 || fxOpen;
  return (
    <li
      role="treeitem"
      id={id}
      data-key={n.key}
      aria-level={depth}
      aria-posinset={pos}
      aria-setsize={size}
      aria-expanded={branch ? isOpen : undefined}
      aria-labelledby={`${id}-op ${id}-l ${id}-t ${id}-v ${id}-e`}
      aria-describedby={hasDetail ? `${id}-d` : undefined}
      tabIndex={ctx.focus === n.key ? 0 : -1}
      className={`tn-item ${root ? "tn-root" : ""} tn-t-${n.type} ${ctx.flash === n.key ? "tn-flash" : ""}`}
      onFocus={(ev) => ev.target === ev.currentTarget && ctx.setFocus(n.key)}
    >
      <div className={`tn-row ${isOpen ? "open" : ""}`} onClick={() => ctx.toggle(n, depth)}>
        <span className="tn-twist" aria-hidden>
          {branch ? <ChevronRight size={15} className="tn-chev" /> : <span className="tn-leafmark" />}
        </span>
        <span className="tn-name">
          <span id={`${id}-op`} className={`tn-op ${n.op && n.op.length > 1 ? "tn-op-word" : ""}`}>
            {n.op && <><span aria-hidden>{n.op}</span><span className="visually-hidden">{SPOKEN[n.op] ?? n.op}</span></>}
          </span>
          <span className="tn-text">
            <span id={`${id}-l`} className="tn-label">{label}</span>
            {how && <span className="tn-how"> · {how}</span>}
            <Tag ctx={ctx} n={n} id={`${id}-t`} />
            {formula && (
              <button type="button" className="tn-fx" aria-expanded={fxOpen} aria-controls={fxOpen ? `${id}-d-fx` : undefined}
                onClick={(ev) => { ev.stopPropagation(); ctx.toggleFx(n.key); }}>
                {fxOpen ? "hide formula" : "formula"}
              </button>
            )}
          </span>
        </span>
        <span id={`${id}-v`} className="tn-val num">
          {show(m, n)}{odds && <span className="tn-odds"> {odds}</span>}
        </span>
        <span
          id={`${id}-e`}
          className="tn-lev"
          title={spread
            ? under ? `Counted in the published range of “${under}”.`
            : `${shareText(share)} of the uncertainty in the bottom line comes${root ? "" : " through this branch"}: how much it moves the result, times how well it's known${ranged ? " (from its published range)" : ""}.`
            : e === undefined ? "No measurable effect at this value." : `If this number were 10% higher, the bottom line would move about ${leverText(e)}${root ? "" : " through this branch"}.`}
        >
          {n.type !== "const" && (spread ? (
            <>
              <span className="tn-track" aria-hidden><span className="tn-bar tn-bar-spread" style={{ width: `${share * 100}%` }} /></span>
              <span className="tn-pct num">{under
                ? <><span className="visually-hidden">, counted in the range above</span><span aria-hidden>in range</span></>
                : <><span className="visually-hidden">, share of the uncertainty </span>{shareText(share)}</>}</span>
            </>
          ) : (
            <>
              <span className="tn-track" aria-hidden><span className={`tn-bar ${e !== undefined && e < 0 ? "neg" : ""}`} style={{ width: `${Math.min(Math.abs(e ?? 0), 1) * 100}%` }} /></span>
              <span className="tn-pct num"><span className="visually-hidden">, if 10% higher the result moves </span>{leverText(e)}</span>
            </>
          ))}
        </span>
      </div>
      {isOpen && <Detail ctx={ctx} n={n} id={`${id}-d`} lines={lines} formula={fxOpen ? formula : undefined} />}
      {isOpen && branch && (
        <ul role="group" className="tn-group" data-deep={depth >= 3 ? "" : undefined}>
          {shown.map((k, i) => <Item key={k.key} ctx={ctx} n={k} depth={depth + 1} pos={i + 1} size={shown.length + (hidden.length ? 1 : 0)} parentLabel={label} under={below} />)}
          {hidden.length > 0 && (
            <li
              role="treeitem"
              id={domId(`${n.key}.more`)}
              data-key={`${n.key}.more`}
              data-more={n.key}
              aria-level={depth + 1}
              aria-posinset={shown.length + 1}
              aria-setsize={shown.length + 1}
              tabIndex={ctx.focus === `${n.key}.more` ? 0 : -1}
              className="tn-item tn-moreitem"
              onFocus={(ev) => ev.target === ev.currentTarget && ctx.setFocus(`${n.key}.more`)}
            >
              <div className="tn-row" onClick={() => ctx.showAll(n.key)}>
                <span className="tn-twist" aria-hidden />
                <span className="tn-name tn-more">
                  Show {hidden.length} more {hidden.length === 1 ? "part" : "parts"}
                  <span className="tn-more-note"> · {spread && !(under || ranged) ? `together ${shareText(hiddenWeight)} of the uncertainty or less` : `together they move the result ${leverText(hiddenWeight).replace(/^[+−]/, "")} or less`}</span>
                </span>
              </div>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}

/** Rows whose label matches, for the search box. Rows the bottom line uses come first. */
function matches(m: ResolvedModel, q: string, used: Set<string>) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length || q.trim().length < 2) return [];
  return m.rows
    .filter((r) => r.label && words.every((w) => r.label.toLowerCase().includes(w)))
    .sort((a, b) => Number(used.has(b.id)) - Number(used.has(a.id)))
    .slice(0, 8);
}

export default function ModelTree({ model, values, view, u }: { model: ResolvedModel; values: Record<string, number>; view: View; u: Uncertainty }) {
  const av = useAssumptionValues();
  const look = useMemo(() => lookupFor(lib, model, values, av, view), [model, values, av, view]);
  const root = useMemo(() => rootOf(model, look), [model, look]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(["r"]));
  const [all, setAll] = useState<Set<string>>(() => new Set());
  const [focus, setFocus] = useState("r");
  const [flash, setFlash] = useState<string>();
  const [pending, setPending] = useState<string>();
  const [orphan, setOrphan] = useState<string>();
  const [q, setQ] = useState("");
  const [fx, setFx] = useState<Set<string>>(() => new Set());
  const [metric, setMetric] = useState<Metric>("spread");
  const weight = (n: TreeNode) => (metric === "spread" ? spreadShare(u, n) : Math.abs(n.e ?? 0));
  const toggleFx = (key: string) => setFx((f) => {
    const x = new Set(f);
    x.has(key) ? x.delete(key) : x.add(key);
    return x;
  });
  const tree = useRef<HTMLUListElement>(null);
  const orphanRef = useRef<HTMLDivElement>(null);
  const used = useMemo(() => (q ? rowsFeeding(model) : new Set<string>()), [model, q]);
  const found = useMemo(() => matches(model, q, used), [model, q, used]);

  const toggle = (n: TreeNode, depth: number) => {
    const closing = open.has(n.key);
    if (!closing && isBranch(n)) track("tree_open", { value: depth });
    setOpen((o) => {
      const x = new Set(o);
      closing ? x.delete(n.key) : x.add(n.key);
      return x;
    });
    if (closing && focus.startsWith(`${n.key}.`)) setFocus(n.key);
    else setFocus(n.key);
  };

  const showAll = (key: string) => {
    setAll((a) => new Set(a).add(key));
    // Keep the keyboard in the group: on its first part, now that every part shows.
    setPending(`${key}.more`);
  };

  /** Open the tree down to a row, or show it apart when the bottom line doesn't use it. */
  const reveal = (rowId: string) => {
    if (!model.byId.has(rowId)) return;
    const path = pathTo(model, rowId, look);
    if (!path) {
      setOrphan(rowId);
      setPending(ORPHAN);
      return;
    }
    const target = path[path.length - 1];
    setOrphan(undefined);
    setOpen((o) => new Set([...o, ...path]));
    setAll((a) => new Set([...a, ...path.slice(0, -1)]));
    setFocus(target);
    setFlash(target);
    setPending(target);
  };

  /** Open the chain of parts that each carry the most leverage, from the bottom line to an input. */
  const followLever = () => {
    const keys = ["r"];
    let n = root;
    // Following the uncertainty stops at a row whose published range stands for it.
    for (let i = 0; i < 40 && n.expr && !(metric === "spread" && rangedRowOf(u, n)); i++) {
      const kids = childrenOf(model, n, look).filter((k) => k.type !== "const");
      if (!kids.length) break;
      n = kids.reduce((b, k) => (weight(k) > weight(b) ? k : b));
      keys.push(n.key);
    }
    track("tree_open", { value: keys.length, detail: metric === "spread" ? "spread" : "lever" });
    setOpen((o) => new Set([...o, ...keys]));
    setFocus(n.key);
    setFlash(n.key);
    setPending(n.key);
  };

  // Links to a row (#row-<id>) from the uncertainty list, the derivation, formulas and the history page.
  const revealLatest = useRef(reveal);
  revealLatest.current = reveal;
  useEffect(() => {
    const onHash = () => {
      const h = decodeURIComponent(location.hash);
      if (h.startsWith("#row-")) revealLatest.current(h.slice(5));
    };
    // A link to the row the address already points at fires no hashchange (the reader may have
    // collapsed it since), so such clicks reveal it directly.
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.("a[href^='#row-']");
      if (!a || ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      if (decodeURIComponent(location.hash) === decodeURIComponent(a.getAttribute("href")!)) {
        ev.preventDefault();
        revealLatest.current(decodeURIComponent(a.getAttribute("href")!).slice(5));
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // After a reveal or "show more", bring the item into view and give it the keyboard.
  const settled = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => (settled.current = true), 1000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!pending) return;
    const more = pending.endsWith(".more");
    const el = pending === ORPHAN
      ? orphanRef.current
      : more
        ? (document.getElementById(domId(pending.slice(0, -5)))?.querySelector<HTMLElement>(":scope > ul > li[role=treeitem]") ?? null)
        : document.getElementById(domId(pending));
    setPending(undefined);
    if (!el) return;
    if (more) setFocus(el.dataset.key!);
    // On arrival (a link from another page) jump straight there; within the page, glide.
    const smooth = settled.current && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!more) requestAnimationFrame(() => el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" }));
    el.focus({ preventScroll: true });
  }, [pending, open, all, orphan]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(undefined), 1600);
    return () => clearTimeout(t);
  }, [flash]);

  const nodeOf = (key: string): TreeNode | undefined => {
    let n: TreeNode | undefined = root;
    for (const i of key.split(".").slice(1)) n = n && childrenOf(model, n, look)[Number(i)];
    return n;
  };

  const onKey = (ev: KeyboardEvent<HTMLUListElement>) => {
    const cur = (ev.target as HTMLElement).closest<HTMLElement>("[role=treeitem]");
    if (!cur || ev.target !== cur || !tree.current) return;
    const items = [...tree.current.querySelectorAll<HTMLElement>("[role=treeitem]")];
    const i = items.indexOf(cur);
    const go = (el: Element | null | undefined) => {
      if (!(el instanceof HTMLElement)) return;
      ev.preventDefault();
      setFocus(el.dataset.key!);
      el.focus();
    };
    const key = cur.dataset.key!;
    const more = cur.dataset.more;
    const expanded = cur.getAttribute("aria-expanded");
    switch (ev.key) {
      case "ArrowDown": return go(items[i + 1]);
      case "ArrowUp": return go(items[i - 1]);
      case "Home": return go(items[0]);
      case "End": return go(items[items.length - 1]);
      case "ArrowRight":
        if (expanded === "false") { ev.preventDefault(); const n = nodeOf(key); if (n) toggle(n, Number(cur.getAttribute("aria-level"))); return; }
        if (expanded === "true") return go(cur.querySelector(":scope > ul > li[role=treeitem]"));
        return;
      case "ArrowLeft":
        if (expanded === "true") { ev.preventDefault(); const n = nodeOf(key); if (n) toggle(n, 0); return; }
        return go(cur.parentElement?.closest("[role=treeitem]"));
      case "Enter":
      case " ": {
        ev.preventDefault();
        if (more) return showAll(more);
        const n = nodeOf(key);
        if (n) toggle(n, Number(cur.getAttribute("aria-level")));
        return;
      }
    }
  };

  const ctx: Ctx = { m: model, look, view, open, all, focus, flash, metric, u, weight, toggle, showAll, setFocus, fx, toggleFx };
  const orphanRow = orphan ? model.byId.get(orphan) : undefined;
  const rowCount = model.rows.length.toLocaleString("en-US");

  return (
    <section className="model-tree" aria-labelledby="tree-title" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <h2 id="tree-title">How the pieces fit together</h2>
      <p className="tn-intro">
        The bottom line at the top; under each number, the numbers it's made from and how they combine. Open any of them.
      </p>
      <div className="tn-metric small" role="radiogroup" aria-label="What the bars show">
        <span className="muted">Bars show</span>
        {([["spread", "Share of the uncertainty"], ["lever", "Result if 10% higher"]] as const).map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={metric === k} className={`tn-metric-opt ${metric === k ? "on" : ""}`}
            onClick={() => { setMetric(k); track("tree_metric", { key: k }); }}>
            {label}
          </button>
        ))}
      </div>

      <div className="tn-tools">
        <div className="tn-actions small">
          <button type="button" className="link-button" onClick={followLever}>{metric === "spread" ? "Follow the biggest uncertainty" : "Follow the biggest lever"}</button>
          <button type="button" className="link-button" disabled={open.size <= 1 && !orphan} onClick={() => { setOpen(new Set(["r"])); setAll(new Set()); setOrphan(undefined); setFocus("r"); }}>Collapse all</button>
        </div>
        <div className="tn-search" role="search">
          <label htmlFor="tn-q" className="visually-hidden">Find a number in this model</label>
          <Search size={15} aria-hidden className="tn-search-icon" />
          <input id="tn-q" type="search" placeholder={`Find a number (${rowCount} rows)`} value={q} autoComplete="off"
            aria-describedby="tn-q-status" onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <p id="tn-q-status" className="visually-hidden" aria-live="polite">
        {q.trim().length >= 2 ? `${found.length === 8 ? "8 or more" : found.length} matching ${found.length === 1 ? "number" : "numbers"}` : ""}
      </p>
      {q.trim().length >= 2 && (
        <ul className="tn-results small" aria-label="Matching numbers">
          {found.length === 0 && <li className="muted">Nothing in this model is called that.</li>}
          {found.map((r) => (
            <li key={r.id}>
              <a href={`#row-${r.id}`} onClick={(e) => { e.preventDefault(); history.replaceState(null, "", `#row-${r.id}`); reveal(r.id); }}>
                {r.label}
              </a>
              <span className="num muted"> {formatValue(values[r.id], r.format)}</span>
              {!used.has(r.id) && <span className="muted"> · not used by the bottom line</span>}
            </li>
          ))}
        </ul>
      )}

      {orphanRow && (
        <div className="tn-orphan" ref={orphanRef} tabIndex={-1} aria-labelledby="tn-orphan-title">
          <div className="tn-orphan-head">
            <p id="tn-orphan-title"><strong>{orphanRow.label}</strong> <span className="num">{formatValue(values[orphanRow.id], orphanRow.format)}</span></p>
            <button type="button" className="link-button small" onClick={() => setOrphan(undefined)}><X size={14} aria-hidden /> Close</button>
          </div>
          <p className="small muted">Context only: the bottom line doesn't use this number, so it isn't in the tree.</p>
          {(() => {
            const n: TreeNode = { key: "orphan", type: orphanRow.node ? "row" : "input", rowId: orphanRow.id, via: [], value: values[orphanRow.id] };
            return <Detail ctx={ctx} id="tn-orphan-d" n={n} lines={detailLines(ctx, n)} formula={orphanRow.formula} />;
          })()}
        </div>
      )}

      <div className="tn-cols small" aria-hidden>
        <span />
        <span>Value</span>
        <span>{metric === "spread" ? "Share of the uncertainty" : "Result if 10% higher"}</span>
      </div>
      <ul ref={tree} role="tree" aria-labelledby="tree-title" className="tn-tree" onKeyDown={onKey}>
        <Item ctx={ctx} n={root} depth={1} pos={1} size={1} />
      </ul>
      <div className="tn-notes small muted">
        <p className="tn-legend">
          <span><span className="kind-dot kind-observed" aria-hidden /> observed</span>
          <span><span className="kind-dot kind-estimate" aria-hidden /> estimate</span>
          <span><span className="kind-dot kind-judgment" aria-hidden /> judgment or your assumption</span>
        </p>
        <p>
          {metric === "spread"
            ? "Share of the uncertainty: how much a number moves the result, times how well it's known (see where the uncertainty comes from, above). Shares through different branches can overlap."
            : "Bars measure each number through its own branch; a number used in several places moves the result through each."}
          The {rowCount} rows are in <a href={`https://github.com/heychristoph/charityevals/blob/main/${modelFile(model)}`}>the model file</a>.
        </p>
      </div>
    </section>
  );
}
