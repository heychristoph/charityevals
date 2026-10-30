// "How the pieces fit together": the whole model as an expandable tree. The bottom line sits at the
// top; each number opens into the numbers it's made from, each marked with how it joins them (× ÷ + −)
// and a bar for its share of the bottom line's uncertainty. Leaves say what they are: your
// assumption (linked to its slider), a shared fact (with its source) or the evaluator's input.
// Only opened nodes are ever computed, so an 8,000-row model costs no more to show than a small one.
import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AlertTriangle, ChevronRight, ExternalLink, Search, X } from "lucide-react";
import usage from "../../generated/usage.json";
import { lib, modelFile, modelUrl } from "../lib/data";
import { comparable, hasRange, pickValue, type ResolvedModel } from "../engine/model";
import type { Node } from "../engine/expr";
import type { Row } from "../engine/schema";
import { childrenOf, lookupFor, pathTo, pathToRef, rangedRowOf, rootOf, shapeOf, spreadShare, type TreeNode } from "../engine/tree";
import { formulaText } from "../engine/derive";
import { rowsFeeding } from "../engine/sensitivity";
import type { Uncertainty } from "../engine/uncertainty";
import { useAssumptionValues } from "../lib/use-results";
import { formatValue, formatAssumption, formatYears, parseEdit, editText } from "../lib/format";
import { oneIn } from "../lib/comparables";
import { track } from "../lib/analytics";
import { clearEdits, setEdit } from "../lib/edit-state";
import { Markdown } from "./AssumptionsPanel";
import InfoTip from "./InfoTip";
import type { Flag } from "../engine/sensitivity";
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
          return f ? <a key={i} href={`/data#f-${f.key}`} title={`Shared data: ${f.group}`} className="ref ref-f">{f.group}: {f.label}</a> : p;
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
        // Deeper than one level of brackets, a formula stops reading as words: name the part instead.
        if (depth >= 2) return "…";
        const sh = shapeOf(n);
        const inner = sh.parts.map((p, i) => `${p.op ? `${p.op} ` : i ? ", " : ""}${exprLabel(m, p.node, depth + 1)}`).join(" ").replace(/ ,/g, ",");
        const body = sh.how && n.type === "call" ? `${sh.how} (${inner})` : inner;
        return depth ? `(${body})` : body;
      }
    }
  })();
  return depth === 0 && s.length > 90 ? `${s.slice(0, 88).trimEnd()}…` : s;
}

/** Evaluators' jargon in row labels, in plain words: "funging" and "leverage" are other funders'
 * money pushed elsewhere or pulled in. */
function plain(label: string): string {
  return label
    .replace(/\s*\((?:funging|leverage)\)/gi, "")
    .replace(/\bleverage and funging\b/gi, (w) => (w[0] === "L" ? "Other funders" : "other funders"))
    .replace(/\bfunging\b/gi, "displaced funding");
}

function labelOf(m: ResolvedModel, n: TreeNode): string {
  return plain(rawLabelOf(m, n));
}

function rawLabelOf(m: ResolvedModel, n: TreeNode): string {
  if (n.label) return n.label;
  if (n.named) return rowLabel(m, n.named);
  if (n.type === "assumption") return assumptionRow(n.refId!)?.label ?? n.refId!;
  if (n.type === "fact") return lib.facts.get(n.refId!)?.label ?? n.refId!;
  // The headline's "× 1000" turns a value per dollar into one per $1,000.
  if (n.type === "const" && n.value === 1000 && /^r\.\d+$/.test(n.key)) return "Per $1,000 instead of per dollar";
  if (n.type === "const") return "Fixed number in the formula";
  if (n.type === "expr") return exprLabel(m, n.expr!);
  return rowLabel(m, n.rowId!);
}

function show(m: ResolvedModel, n: TreeNode, years = false): string {
  // The top row is the number under the page title, rounded the same way.
  if (years) return formatYears(n.value);
  // The row named in the formula speaks first (it carries the label shown), then the rows it passed
  // through, then the number it ends at.
  const own = [n.named, ...n.via].map((id) => (id ? m.byId.get(id)?.format : undefined)).find(Boolean);
  if (!own && n.type === "assumption" && assumptionRow(n.refId!)) return formatAssumption(assumptionRow(n.refId!)!, n.value);
  const f = own ?? (n.rowId ? m.byId.get(n.rowId)?.format : n.type === "assumption" ? assumptionRow(n.refId!)?.format : n.type === "fact" ? lib.facts.get(n.refId!)?.format : undefined);
  return f && f !== "number" && f !== "small" && f !== "toggle" ? formatValue(n.value, f) : fmtNum(n.value);
}

/** How much of the uncertainty "Reveal uncertainties" opens up to. */
const REVEAL_SHARE = 0.8;

/** A bar's width, to a tenth of a percent: the server's HTML shortens longer numbers, and the page
 * must hydrate to exactly the string it was served. */
const barWidth = (x: number) => `${Math.round(Math.min(Math.max(x, 0), 1) * 1000) / 10}%`;
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
  open: Set<string>;
  all: Set<string>;
  focus: string;
  flash?: string;
  u: Uncertainty;
  /** Caveats about the whole result, shown as a warning sign on the top row. */
  flags: Flag[];
  /** The bar's length, 0–1: the node's share of the uncertainty. */
  weight: (n: TreeNode) => number;
  toggle: (n: TreeNode, depth: number) => void;
  showAll: (key: string) => void;
  fx: Set<string>;
  toggleFx: (key: string) => void;
  setFocus: (key: string) => void;
  /** The reader's edits: inputs by row id, facts by "@key". */
  edits: Record<string, number>;
  /** The top row is in years of healthy life per $1,000. */
  years: boolean;
};

/** The models that read a shared fact, when more than one does. */
const readers = (key: string): string[] => (usage as Record<string, string[]>)[key] ?? [];

/** The number a leaf stands for that a reader can edit: an input row (by id) or a shared fact ("@key"),
 * with its value before any edit. */
function editable(ctx: Ctx, n: TreeNode): { id: string; original: number; format?: Row["format"] } | undefined {
  if (n.type === "input" && n.rowId) {
    const row = ctx.m.byId.get(n.rowId);
    return row && !row.node ? { id: row.id, original: pickValue(row.value), format: row.format } : undefined;
  }
  if (n.type === "fact") {
    const f = lib.facts.get(n.refId!);
    return f ? { id: `@${n.refId}`, original: pickValue(f.value), format: f.format } : undefined;
  }
}

/** "Try another value": a field for an input or fact, scoped to this page. */
function EditValue({ ctx, n, label }: { ctx: Ctx; n: TreeNode; label: string }) {
  const e = editable(ctx, n)!;
  const edited = e.id in ctx.edits;
  // The field shows the value as the row does (rounded); left as it is, the number keeps its full precision.
  const asText = (x: number) => editText(x, e.format);
  const [text, setText] = useState(() => asText(n.value));
  useEffect(() => setText(asText(n.value)), [n.value]);
  const commit = () => {
    if (text.trim() === asText(n.value)) return;
    const v = parseEdit(text, e.format);
    if (v === undefined) return setText(asText(n.value));
    setEdit(e.id, v, e.original);
    track("tree_edit", { detail: e.id });
  };
  return (
    <p className="tn-edit">
      <label>
        Try another value{" "}
        <input className="num" inputMode="decimal" aria-label={`${label}, try another value`} value={text}
          onChange={(ev) => setText(ev.target.value)} onFocus={(ev) => ev.target.select()} onBlur={commit}
          onKeyDown={(ev) => { ev.stopPropagation(); if (ev.key === "Enter") commit(); if (ev.key === "Escape") setText(asText(n.value)); }} />
        {e.format === "percent" ? "%" : ""}
      </label>
      {e.id.startsWith("@") && <span className="muted"> on this page only</span>}
      {edited && <> <button type="button" className="link-button" onClick={() => setEdit(e.id, undefined, e.original)}>back to {formatValue(e.original, e.format)}</button></>}
    </p>
  );
}

const domId = (key: string) => `tn-${key.replace(/\./g, "-")}`;
const isBranch = (n: TreeNode) => !!n.expr;

/** What a node is, in a word or two, beside its label. */
function Tag({ ctx, n, id }: { ctx: Ctx; n: TreeNode; id: string }) {
  const row = n.rowId ? ctx.m.byId.get(n.rowId) : undefined;
  const evaluator = ctx.m.evaluator?.name;
  const e = editable(ctx, n);
  if (e && e.id in ctx.edits) return <span id={id} className="tn-tag tn-tag-edited">your edit</span>;
  if (n.type === "assumption" && assumptionRow(n.refId!)?.fixed)
    return <span id={id} className="tn-tag"><span className="kind-dot kind-estimate" aria-hidden /><a href={`/data#a-${n.refId}`}>fixed rate</a></span>;
  if (n.type === "assumption") return <span id={id} className="tn-tag tn-tag-a"><span className="kind-dot kind-judgment" aria-hidden />your value</span>;
  if (n.type === "fact") {
    const count = readers(n.refId!).length;
    return <span id={id} className="tn-tag tn-tag-f">{count > 1 ? `shared · ${count} models` : "shared fact"}</span>;
  }
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
  const { m } = ctx;
  const row = n.rowId ? m.byId.get(n.rowId) : undefined;
  const named = n.named ? m.byId.get(n.named) : undefined;
  const evaluator = m.evaluator?.name;
  const lines: ReactNode[] = [];
  // The source line names the sheet's cell; an explainer that only repeats it ("Value from GiveWell's
  // sheet, cell J111.") says nothing more.
  const cell = (row?.source ?? named?.source)?.cell;
  const rawExplainer = named?.explainer ?? row?.explainer;
  const explainer = cell && rawExplainer
    ? rawExplainer.split(/\n\n+/).map((para) => para.split(/(?<=\.)\s+/).filter((x) => !x.includes(cell)).join(" ")).filter(Boolean).join("\n\n") || undefined
    : rawExplainer;
  if (n.type === "assumption") {
    const a = assumptionRow(n.refId!);
    lines.push(a?.fixed
      ? <p key="a">A fixed rate taken from evidence, shared by every model. <a href={`/data#a-${n.refId}`}>Its source</a>.</p>
      : <p key="a">One of your values: every model uses it, and you can change it. <a href={`#a-${n.refId}`}>Adjust it</a>.</p>);
    if (a?.explainer) lines.push(<div key="ax" className="tn-explainer"><Markdown text={a.explainer} /></div>);
  } else if (n.type === "fact") {
    const f = lib.facts.get(n.refId!);
    const others = readers(n.refId!).filter((id) => id !== m.id).map((id) => lib.models.get(id)).filter((x) => !!x);
    const SHOWN = 3;
    lines.push(
      <p key="f">
        Shared data from <a href={`/data#f-${f?.key ?? n.refId}`}>{f?.group ?? "the facts"}</a>
        {others.length > 0 && <>, also read by{" "}
          {others.slice(0, SHOWN).map((o, i) => <Fragment key={o.id}>{i ? (i === others.length - 1 ? " and " : ", ") : ""}<a href={modelUrl(lib, o)}>{o.name}</a></Fragment>)}
          {others.length > SHOWN && <> and {others.length - SHOWN} more</>}</>}.
        {f?.source?.title && <> Source: {f.source.url ? <a href={f.source.url}>{f.source.title}</a> : f.source.title}.</>}
      </p>,
    );
  } else if (n.type === "const") {
    lines.push(<p key="c">A number written into {parentLabel ? <>the formula for {parentLabel}</> : "the formula"} itself, such as a unit conversion or a fixed adjustment.</p>);
  }
  if (explainer) lines.push(<div key="x" className="tn-explainer"><Markdown text={explainer} /></div>);
  if (editable(ctx, n)) lines.push(<EditValue key="ed" ctx={ctx} n={n} label={labelOf(m, n)} />);
  if (n.type === "input" && row) {
    if (hasRange(row.value)) lines.push(<p key="r">Plausible range <span className="num">{formatValue(pickValue(row.value, "low"), row.format)} – {formatValue(pickValue(row.value, "high"), row.format)}</span>.</p>);
    if (row.published !== undefined)
      lines.push(<p key="p" className="tn-differs">{evaluator ?? "The evaluator"} uses <span className="num">{formatValue(pickValue(row.published), row.format)}</span> here.</p>);
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
  // Below a row whose own published range stands for its uncertainty, parts add none of their own.
  const rangedRow = rangedRowOf(ctx.u, n);
  const ranged = !!rangedRow;
  const below = under ?? (ranged ? label : undefined);
  const kids = isOpen && branch ? childrenOf(m, n, look) : [];
  // The parts with the most leverage, kept in formula order; the rest behind "n more".
  // Inside a published range, by leverage: the range already holds their uncertainty.
  const ranked = [...kids].sort((a, b) => (under || ranged ? Math.abs(b.e ?? 0) - Math.abs(a.e ?? 0) : ctx.weight(b) - ctx.weight(a)));
  const shown = all.has(n.key) || kids.length <= CAP + 1 ? kids : kids.filter((k) => ranked.indexOf(k) < CAP);
  const hidden = kids.filter((k) => !shown.includes(k));
  const hiddenWeight = hidden.reduce((s, k) => s + (under || ranged ? Math.abs(k.e ?? 0) : ctx.weight(k)), 0);
  const how = n.expr ? shapeOf(n.expr).how : undefined;
  const odds = oneIn(label, n.value);
  const root = depth === 1;
  const share = under ? 0 : ctx.weight(n);
  const formula = isOpen ? formulaOf(m, n) : undefined;
  const fxOpen = !!formula && ctx.fx.has(n.key);
  const lines = isOpen ? detailLines(ctx, n, parentLabel) : [];
  const hasDetail = lines.length > 0 || fxOpen;
  const ed = editable(ctx, n);
  const edited = !!ed && ed.id in ctx.edits;
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
            {root && ctx.flags.length > 0 && (
              // The sign opens its own list; it doesn't open or close the row.
              <span className="tn-flags" onClick={(ev) => ev.stopPropagation()} onKeyDown={(ev) => ev.stopPropagation()}>
                <InfoTip label={`${ctx.flags.length} ${ctx.flags.length === 1 ? "caveat" : "caveats"}`} icon={<AlertTriangle size={14} aria-hidden />}>
                  <ul className="tn-flag-list">{ctx.flags.map((f) => <li key={f.short}>{f.text}.</li>)}</ul>
                </InfoTip>
              </span>
            )}
            {formula && (
              <button type="button" className="link-button tn-fx" aria-expanded={fxOpen} aria-controls={fxOpen ? `${id}-d-fx` : undefined}
                onClick={(ev) => { ev.stopPropagation(); ctx.toggleFx(n.key); }}>
                {fxOpen ? "hide formula" : "formula"}
              </button>
            )}
          </span>
        </span>
        <span id={`${id}-v`} className={`tn-val num ${edited ? "tn-edited" : ""}`}>
          {show(m, n, root && ctx.years)}{odds && <span className="tn-odds"> {odds}</span>}
        </span>
        <span
          id={`${id}-e`}
          className="tn-lev"
          title={under ? `Counted in the published range of “${under}”.`
            : `${shareText(share)} of the uncertainty in the bottom line comes${root ? "" : " through this branch"}: how much it moves the result, times how well it's known${ranged ? " (from its published range)" : ""}.`}
        >
          {n.type !== "const" && (
            <>
              <span className="tn-track" aria-hidden><span className="tn-bar tn-bar-spread" style={{ width: barWidth(share) }} /></span>
              <span className="tn-pct num">{under
                ? <><span className="visually-hidden">, counted in the range above</span><span aria-hidden>in range</span></>
                : <><span className="visually-hidden">, share of the uncertainty </span>{shareText(share)}</>}</span>
            </>
          )}
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
                  <span className="tn-more-label">Show {hidden.length} more {hidden.length === 1 ? "part" : "parts"}</span>
                  <span className="tn-more-note"> · {under || ranged ? `together they move the result ${leverText(hiddenWeight).replace(/^[+−]/, "")} or less` : `together ${shareText(hiddenWeight)} of the uncertainty or less`}</span>
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

/** `place`: the location this model covers when it is one of several, named on the top row so it reads
 * apart from the page's headline, which may combine every funded location. */
export default function ModelTree({ model, values, edits = {}, u, flags = [], place, children }: { model: ResolvedModel; values: Record<string, number>; edits?: Record<string, number>; u: Uncertainty; flags?: Flag[]; place?: string; children?: React.ReactNode }) {
  const av = useAssumptionValues();
  const look = useMemo(() => lookupFor(lib, model, values, av, "charityevals", edits), [model, values, av, edits]);
  const editCount = Object.keys(edits).length;
  // The tree ends in the number at the top of the page: the model's result converted into years of
  // healthy life per $1,000. Models in a unit nobody converts end in their own result.
  const toCommon = comparable(lib, model) ? lib.assumptions.units[model.output!.unit].to_common : undefined;
  const root = useMemo(() => {
    const r = rootOf(model, look, toCommon);
    return place && r.label ? { ...r, label: `${r.label} in ${place}` } : r;
  }, [model, look, toCommon, place]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(toCommon === undefined ? ["r"] : ["r", "r.0"]));
  const [all, setAll] = useState<Set<string>>(() => new Set());
  const [focus, setFocus] = useState("r");
  const [flash, setFlash] = useState<string>();
  const [pending, setPending] = useState<string>();
  const [orphan, setOrphan] = useState<string>();
  const [q, setQ] = useState("");
  const [fx, setFx] = useState<Set<string>>(() => new Set());
  // Bars show each number's share of the uncertainty.
  const weight = (n: TreeNode) => spreadShare(u, n, root.value);
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
    const path = pathTo(model, rowId, look, toCommon);
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

  /** Open the tree down to the biggest sources of uncertainty, biggest first, until together they
   * cover REVEAL_SHARE of it: every path to them, with each step's parts all shown. */
  const [revealed, setRevealed] = useState(false);
  const collapse = () => { setOpen(new Set(["r"])); setAll(new Set()); setOrphan(undefined); setFocus("r"); setRevealed(false); };
  const initial = () => { setOpen(new Set(toCommon === undefined ? ["r"] : ["r", "r.0"])); setAll(new Set()); setFocus("r"); setRevealed(false); };
  const revealUncertainties = () => {
    if (revealed) return initial();
    const paths: string[][] = [];
    let covered = 0;
    for (const d of u.drivers) {
      if (covered >= REVEAL_SHARE) break;
      const path = d.scope === "row" ? pathTo(model, d.id, look, toCommon)
        : d.scope === "assumption" || d.scope === "fact" ? pathToRef(model, d.scope, d.id, look, toCommon) : undefined;
      if (!path) continue;
      paths.push(path);
      covered += d.share;
    }
    if (!paths.length) return;
    track("tree_open", { value: paths.length, detail: "reveal" });
    setRevealed(true);
    setOpen((o) => new Set([...o, ...paths.flat()]));
    setAll((a) => new Set([...a, ...paths.flatMap((p) => p.slice(0, -1))]));
    const first = paths[0].at(-1)!;
    setFocus(first);
    setFlash(first);
    setPending(first);
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

  const ctx: Ctx = { m: model, look, open, all, focus, flash, u, flags, weight, toggle, showAll, setFocus, fx, toggleFx, edits, years: toCommon !== undefined };
  const orphanRow = orphan ? model.byId.get(orphan) : undefined;
  const rowCount = model.rows.length.toLocaleString("en-US");

  return (
    <section className="model-tree" aria-labelledby="tree-title" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <div className="sec-head tip-host">
        <h2 id="tree-title">Model</h2>
        <InfoTip label="How to read this">
          The number at the top of the page first; under each number, the numbers it's made from and how they combine. Open any of them.
        </InfoTip>
      </div>
      {children && <div className="tn-about small">{children}</div>}

      <div className="tn-tools">
        <div className="tn-actions small">
          <button type="button" className="link-button tn-reveal" aria-pressed={revealed} onClick={revealUncertainties}>
            <span className="tn-check" aria-hidden />Reveal uncertainties
          </button>
          <button type="button" className="link-button" disabled={open.size <= 1 && !orphan} onClick={collapse}>Collapse all</button>
          {editCount > 0 && (
            <span className="tn-edits">
              {editCount} {editCount === 1 ? "edit" : "edits"} in the page link:{" "}
              <button type="button" className="link-button" onClick={clearEdits}>Undo</button>
            </span>
          )}
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

      <div className="tn-cols small tip-host">
        <span aria-hidden />
        <span aria-hidden>Value</span>
        <span>
          <span aria-hidden>Share of the uncertainty</span>{"\u00a0"}
          <InfoTip label="What the share of the uncertainty means">
            How much a number moves the result, times how loosely it's known. Reveal uncertainties opens the numbers behind 80% of it.
          </InfoTip>
        </span>
      </div>
      <ul ref={tree} role="tree" aria-labelledby="tree-title" className="tn-tree" onKeyDown={onKey}>
        <Item ctx={ctx} n={root} depth={1} pos={1} size={1} />
      </ul>
      <div className="tn-notes small muted">
        <p className="tn-legend">
          <span><span className="kind-dot kind-observed" aria-hidden /> observed</span>
          <span><span className="kind-dot kind-estimate" aria-hidden /> estimate</span>
          <span><span className="kind-dot kind-judgment" aria-hidden /> judgment or your value</span>
        </p>
      </div>
    </section>
  );
}
