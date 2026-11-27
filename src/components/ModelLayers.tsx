// A model's section in layers, for a model with a story (`story`): the likely range first; then the
// questions that move it most; then the steps from $1,000 to the result in plain words, each number
// opening into the working behind it (Working.tsx), down to the evidence. Each layer opens from the one above.
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { lib, modelUrl } from "../lib/data";
import { assumptionValues, compute, headlineExprOf, pickValue, type Library, type ResolvedModel } from "../engine/model";
import { childrenOf, lookupFor, rootOf } from "../engine/tree";
import type { Driver, Uncertainty } from "../engine/uncertainty";
import { editText, formatValue, parseEdit } from "../lib/format";
import { useFigure } from "../lib/metric";
import { clearEdits, setEdit } from "../lib/edit-state";
import { fillStory, storyNumber, storyValue } from "../lib/story";
import { Node, pathTo, resolve, rootsOf, type Ctx, type Factor } from "./Working";
import { wholeOf, type Whole } from "../lib/whole";
import { pickDrivers } from "../lib/page-drivers";
import { ChevronRight } from "lucide-react";
import { Markdown, Slider } from "./AssumptionsPanel";
import InfoTip from "./InfoTip";
import type { Row } from "../engine/schema";
import { labelOf, plain, show } from "../lib/labels";
import "./layers.css";



export default function ModelLayers({ model, values, av, edits, u, engine, about, children }: { model: ResolvedModel; values: Record<string, number>; av: Record<string, number>; edits: Record<string, number>; u: Uncertainty; engine: Library; about?: ReactNode; children?: ReactNode }) {
  const story = model.story!;
  const fig = useFigure(lib, av);
  // The whole charity: every location it funds, weighted by its money (src/lib/whole.ts).
  const whole = useMemo(() => wholeOf(model, av, edits, engine), [model, av, edits, engine]);
  const result = whole.result;
  const range = { low: whole.low, high: whole.high };
  // The range bar's axis stays put while the reader moves things: 1/30 to 30 times the result at default values.
  const base = useMemo(() => wholeOf(model, assumptionValues(lib.assumptions), {}).result, [model]);
  const years = (x: number) => fig.format(x);
  const fill = (t: string) => fillStory(t, whole.values, result, years);

  // The page model's rows before the reader's own edits: what an edit returns to.
  const unedited = useMemo(() => compute(engine, model, av), [engine, model, av]);
  const w = useWorking(model, whole, av, engine);
  const working = useRef<HTMLDetailsElement>(null);
  /** Open "How it's worked out" down to a number (`r:<row>`, `a:<assumption>`, `f:<fact>`). */
  const jump = (target: string) => {
    const keys = pathTo(model, w.lines, target, w.conversion.factors);
    if (!keys) return;
    if (working.current) working.current.open = true;
    w.setOpen((o) => new Set([...o, ...keys]));
    const last = keys[keys.length - 1];
    setTimeout(() => {
      const el = document.getElementById(`wk-${last}`);
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      el.classList.add("wk-flash");
      setTimeout(() => el.classList.remove("wk-flash"), 1800);
    }, 60);
  };
  // An open layer's heading pins under the range while its content scrolls: it needs the range's height.
  const section = useRef<HTMLElement>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = top.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => section.current?.style.setProperty("--ly-top-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // After the first change the range lights up each time it moves (not on arrival).
  const shown = `${fig.format(range.low)}-${fig.format(range.high)}`;
  const first = useRef(shown);
  // The reader's saved values arrive just after the page does: until they have, the range isn't "moved".
  const settled = useRef(false);
  useEffect(() => { const t = setTimeout(() => (settled.current = true), 1000); return () => clearTimeout(t); }, []);
  if (!settled.current) first.current = shown;
  const moved = shown !== first.current;
  const pos = (x: number) => (x > 0 && base > 0 ? Math.max(0, Math.min(100, (Math.log(x / base) / Math.log(30) + 1) * 50)) : 0);
  const edited = Object.keys(edits).length;

  return (
    <section className="model-tree layers" aria-label="What a donation does" ref={section}>
      <div className="ly-top" ref={top}>
        <div className="ly-range">
          <p className="ly-range-line"><span key={`${fig.format(range.low)}-${fig.format(range.high)}`} className={`ly-range-num num ${moved ? "ly-moved" : ""}`}>{fig.format(range.low) === fig.format(range.high) ? fig.format(range.low) : `${fig.format(range.low)} to ${fig.format(range.high)}`}</span> <span className="ly-range-unit">{fig.metric.unit.toLowerCase()}</span></p>
          <Curve places={whole.places} page={model.id} engine={engine} pos={pos} range={range} />
        </div>
      </div>

      <details className="ly-layer">
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">What it depends on</h2></summary>
        <div className="ly-body">
          <Questions model={model} u={u} whole={whole} av={av} edits={edits} pageBase={unedited} jump={jump} />
          {edited > 0 && <p className="small"><button type="button" className="link-button" onClick={clearEdits}>Undo your {edited === 1 ? "change" : `${edited} changes`} to this model</button></p>}
        </div>
      </details>

      <details className="ly-layer" ref={working}>
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">How it's worked out</h2></summary>
        <div className="ly-body">
          <StoryChain w={w} whole={whole} />
          {whole.places.length > 1 && (
            <table className="ly-places">
              <caption>Each country, by its share of the money</caption>
              <tbody>
                {whole.places.map((p) => (
                  <tr key={p.model.id}><td><a href={modelUrl(lib, p.model)}>{p.label}</a></td><td className="num">{Math.round(p.share * 100)}%</td><td className="num">{fig.format(p.low)} to {fig.format(p.high)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </details>

      <details className="ly-layer">
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">Write-up</h2></summary>
        <div className="ly-body ly-evaluation">
          {children}
        </div>
      </details>
    </section>
  );
}

type Working = ReturnType<typeof useWorking>;

/** The state behind a story's chain: which numbers are open (a step `s<i>`, then each number below it),
 * which location's model the working shows (the largest first), and the bottom line's own working. */
export function useWorking(model: ResolvedModel, whole: Whole, av: Record<string, number>, engine: Library) {
  const fig = useFigure(lib, av);
  const [place, setPlace] = useState(0);
  const shownPlace = whole.places[Math.min(place, whole.places.length - 1)];
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (key: string) => setOpen((o) => {
    const x = new Set(o);
    if (x.has(key)) for (const k of [...x]) { if (k === key || k.startsWith(`${key}/`)) x.delete(k); }
    else x.add(key);
    return x;
  });
  const story = model.story!;
  const lines = useMemo(() => story.steps.map((s, i) => ({ line: `s${i}`, roots: rootsOf(model, s.total ?? s.op ?? "") })), [model, story]);
  // The bottom line's own working: the model's result turned into years of healthy life per $1,000.
  const conversion = useMemo(() => {
    const m = shownPlace.model;
    const toCommon = m.output ? headlineExprOf(engine, m, { type: "ref", scope: "row", name: m.output.row }) : undefined;
    const look = lookupFor(engine, m, shownPlace.values, av, "charityevals");
    const factors: Factor[] = toCommon
      ? childrenOf(m, rootOf(m, look, toCommon), look).map((n) => ({
          op: n.op,
          value: show(m, n),
          label: labelOf(m, n),
          key: n.type === "assumption" ? `a:${n.refId}` : n.type === "fact" ? `f:${n.refId}` : n.rowId ? `r:${resolve(m, n.rowId)}` : undefined,
        }))
      : [];
    return { value: fig.format(shownPlace.result), label: fig.metric.unit, factors };
  }, [shownPlace, engine, fig, av]);
  const ctx: Ctx = { model: shownPlace.model, values: shownPlace.values, av, open, toggle, conversion };
  return { model, story, fig, place, setPlace, open, setOpen, toggle, lines, conversion, ctx };
}

/** A story's steps from $1,000 to the result, each number opening into its working. `scale`: the share
 * of $1,000 the steps are for (a programme's share of a charity's money; 1 on its own page). */
export function StoryChain({ w, whole, scale = 1 }: { w: Working; whole: Whole; scale?: number }) {
  const { story, fig, lines, open, toggle, place, setPlace, ctx } = w;
  const years = (x: number) => fig.format(x);
  const fill = (t: string) => fillStory(t, whole.values, whole.result, years);
  const total = (spec: string) => {
    if (scale === 1) return storyNumber(spec, whole.values, whole.result, years);
    const [src, f] = spec.split("|").map((x) => x.trim());
    const x = storyValue(src, whole.values, whole.result) * scale;
    return f === "y" ? years(x) : formatValue(x, f === "$" ? "usd" : f === "%" ? "percent" : "number");
  };
  const last = story.steps.length - 1;
  return (
    <ol className="ly-chain">
      {story.steps.map((s, i) => {
        const { line, roots } = lines[i];
        const isOpen = open.has(line);
        const v = s.total !== undefined ? total(s.total) : fill(s.op ?? "");
        // Scaled to a programme's share, the last step is that programme's part, no longer "per $1,000".
        const text = scale !== 1 && i === last ? fill(s.text).replace(/ per \$1,000$/, "") : fill(s.text);
        return (
          <li key={i} className={`${s.total !== undefined ? "ly-total" : "ly-op"} ${i === last && scale === 1 ? "ly-end" : ""} ${roots.length ? "ly-drill" : ""} ${isOpen ? "open" : ""}`}>
            {roots.length
              ? <button type="button" className="ly-v num" aria-expanded={isOpen} onClick={() => toggle(line)}>{v}</button>
              : <span className="ly-v num">{v}</span>}
            <span className="ly-t">{text}</span>
            {isOpen && (
              <div className="wk">
                {whole.places.length > 1 && (
                  <label className="wk-place small">
                    Worked out for{" "}
                    <select value={place} onChange={(e) => setPlace(Number(e.target.value))}>
                      {whole.places.map((p, j) => <option key={p.model.id} value={j}>{p.label}</option>)}
                    </select>
                  </label>
                )}
                {roots.map((r) => <Node key={r} ctx={ctx} at={r} path={line} />)}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** The likely range as a bar shaded by the simulation's shape, on the same log axis. Each location's
 * stored 5%, 10% … 95% points (multiples of its best guess) are placed on its range and averaged by
 * funding share, as the range itself is. A plain band where a model has no usable simulation. */
export function Curve({ places, page, engine, pos, range }: { places: Whole["places"]; page: string; engine: Library; pos: (x: number) => number; range: { low: number; high: number } }) {
  const xs = useMemo(() => {
    const per = places.map((p) => {
      const d = (p.model.id === page ? engine : lib).distributions?.[p.model.id];
      if (!d || d.unstable || d.at !== undefined || !d.q?.length || !(d.q[0] > 0)) return undefined;
      const s = p.low / d.q[0];
      return d.q.map((v) => v * s);
    });
    if (per.some((x) => !x)) return undefined;
    return per[0]!.map((_, k) => places.reduce((sum, p, i) => sum + p.share * per[i]![k], 0));
  }, [places, page, engine]);
  const band = (style: React.CSSProperties) => <div className="ly-band" aria-hidden><span className="ly-track" /><span className="ly-fill" style={style} /></div>;
  if (!xs || xs.some((x) => !(x > 0))) {
    return band({ left: `${Math.round(pos(range.low) * 10) / 10}%`, width: `${Math.max(1, Math.round((pos(range.high) - pos(range.low)) * 10) / 10)}%` });
  }
  // How likely each stretch is, smoothed: each of the 19 points stands for an equal share of the results,
  // spread a little either side on the log axis (a kernel estimate). The bar is shaded by it: darkest
  // where results are most likely, fading out towards the ends.
  const L = xs.map(Math.log);
  const mean = L.reduce((a, b) => a + b, 0) / L.length;
  const sd = Math.sqrt(L.reduce((a, b) => a + (b - mean) ** 2, 0) / L.length) || 0.1;
  const h = 0.45 * sd;
  const from = L[0] - 2 * h, to = L[L.length - 1] + 2 * h;
  const N = 24;
  const grid = Array.from({ length: N + 1 }, (_, i) => from + ((to - from) * i) / N);
  const dens = grid.map((g) => L.reduce((s, l) => s + Math.exp(-((g - l) ** 2) / (2 * h * h)), 0));
  const top = Math.max(...dens);
  const left = pos(Math.exp(from)), right = pos(Math.exp(to));
  const stops = grid.map((g, i) => `color-mix(in srgb, var(--cause) ${Math.round((dens[i] / top) * 75)}%, transparent) ${Math.round(((pos(Math.exp(g)) - left) / Math.max(1e-6, right - left)) * 1000) / 10}%`);
  return band({ left: `${Math.round(left * 10) / 10}%`, width: `${Math.max(1, Math.round((right - left) * 10) / 10)}%`, background: `linear-gradient(to right, ${stops.join(", ")})`, boxShadow: "none" });
}

/** A row the reader can try other values of: an input, or a row that only passes one along. */
function editable(model: ResolvedModel, id: string): boolean {
  for (let r = model.byId.get(id), hops = 0; r && hops < 50; hops++) {
    if (!r.node || r.range) return true;
    if (r.node.type !== "ref" || r.node.scope !== "row") return r.node.type === "ref" && r.node.scope === "fact";
    r = model.byId.get(r.node.name);
  }
  return false;
}


/** An evidence number the reader can set, drawn exactly like a value's slider (AssumptionsPanel): the
 * number in a box to type into, an info tip saying where it comes from, the default marked, the ends. */
function EvidenceSlider({ label, format, value, best, low, high, settable, set, about }: { label: string; format?: Row["format"]; value: number; best: number; low: number; high: number; settable: boolean; set: (v: number) => void; about: ReactNode }) {
  const id = useId();
  const [text, setText] = useState<string>();
  const STEPS = 200;
  const toStep = (v: number) => Math.round(((Math.min(Math.max(v, low), high) - low) / (high - low)) * STEPS);
  const changed = Math.abs(value - best) > Math.abs(best) * 1e-9;
  const i = label.lastIndexOf(" ") + 1;
  const commit = () => {
    const v = text === undefined ? undefined : parseEdit(text, format);
    if (v !== undefined && text !== editText(value, format)) set(v);
    setText(undefined);
  };
  return (
    <div className={`assumption tip-host ${changed ? "changed" : ""}`}>
      <div className="assumption-head">
        <span className="assumption-name">
          {i > 0 && <label htmlFor={id}>{label.slice(0, i)}</label>}
          <span className="nobr"><label htmlFor={id}>{label.slice(i)}</label>{"\u00a0"}<InfoTip label="Where this number comes from">{about}</InfoTip></span>
        </span>
        {text === undefined || !settable ? (
          <button type="button" className="value-field num" disabled={!settable} aria-label={`${label}: ${formatValue(value, format)}. Type a value`} onClick={() => setText(editText(value, format))}>
            {formatValue(value, format)}
          </button>
        ) : (
          <span className="value-edit num">
            <input autoFocus inputMode="decimal" aria-label={`${label}, type a value`} value={text} onChange={(e) => setText(e.target.value)} onFocus={(e) => e.target.select()} onBlur={commit}
              onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setText(undefined); }} />
            {format === "percent" ? "%" : ""}
          </span>
        )}
      </div>
      {settable && (
        <div className="slider-wrap" style={{ ["--default" as string]: `${toStep(best) / STEPS}` }}>
          <span className="default-tick" aria-hidden />
          <input id={id} type="range" min={0} max={STEPS} value={toStep(value)} aria-valuetext={formatValue(value, format)}
            onChange={(e) => { const s = Number(e.target.value); set(Math.abs(s - toStep(best)) <= 2 ? best : low + (s / STEPS) * (high - low)); }} />
        </div>
      )}
    </div>
  );
}

function Questions({ model, u, whole, av, edits, pageBase, jump }: { model: ResolvedModel; u: Uncertainty; whole: Whole; av: Record<string, number>; edits: Record<string, number>; pageBase: Record<string, number>; jump: (target: string) => void }) {
  // The questions and their order come from the values the reader arrives with (a shared link, their saved
  // values), then hold still: from the first thing they change on the page, nothing re-ranks until a reload.
  const [drivers, setDrivers] = useState(() => pickDrivers(u, model));
  const [held, setHeld] = useState(false);
  useEffect(() => { if (!held) setDrivers(pickDrivers(u, model)); }, [u, model, held]);
  useEffect(() => {
    const hold = () => setHeld(true);
    window.addEventListener("input", hold, { capture: true, once: true });
    window.addEventListener("change", hold, { capture: true, once: true });
    return () => { window.removeEventListener("input", hold, { capture: true }); window.removeEventListener("change", hold, { capture: true }); };
  }, []);
  return (
    <div className="ly-questions">
      {drivers.map((d) => <Question key={d.key} d={d} model={model} whole={whole} av={av} edits={edits} pageBase={pageBase} jump={jump} />)}
    </div>
  );
}

/** One question: an assumption's slider, or a number of the model's evidence the reader can set. `whole`
 * is the model across its locations; `pageBase` the model's own rows before the reader's edits. */
export function Question({ d, model, whole, av, edits, pageBase, jump }: { d: Driver; model: ResolvedModel; whole: Whole; av: Record<string, number>; edits: Record<string, number>; pageBase: Record<string, number>; jump: (target: string) => void }) {
  const to = d.scope === "assumption" ? `a:${d.id}` : d.scope === "fact" ? `f:${d.id}` : `r:${d.id}`;
  const open = (e: { preventDefault: () => void }) => { if (to) { e.preventDefault(); jump(to); } };
  if (d.scope === "assumption") {
    const row = lib.assumptions.rows.find((r) => r.id === d.id)!;
    // The slider's own name opens the model at this value.
    return (
      <div key={d.key} className="ly-q ly-q-v" onClickCapture={(e) => { if ((e.target as Element).closest(".assumption-name label")) open(e); }}>
        <Slider row={row} value={av[d.id]} compact />
      </div>
    );
  }
  const fact = d.scope === "fact" ? lib.facts.get(d.id) : undefined;
  const row = d.scope === "row" ? model.byId.get(d.id) : undefined;
  const key = d.scope === "fact" ? `@${d.id}` : d.id;
  // The whole charity's value: the funding-weighted mean over its locations. A change to it moves
  // every location by the same proportion (src/lib/whole.ts), set through the page's own model.
  const k = fact || !pageBase[d.id] ? 1 : whole.base[d.id] / pageBase[d.id];
  const about = <>
          <p><b>{d.source === "judgment" ? "A judgment" : d.source === "data" ? "Observed data" : "An estimate"}</b>{model.evaluator?.name ? `, from ${model.evaluator.name}` : ""}. Plausible range {formatValue(d.low * k, (fact ?? row)?.format)} to {formatValue(d.high * k, (fact ?? row)?.format)}.</p>
          {(fact?.source ?? row?.source)?.title && <p>Source: {(fact?.source ?? row?.source)?.url ? <a href={(fact?.source ?? row?.source)!.url} rel="noopener">{(fact?.source ?? row?.source)!.title}</a> : (fact?.source ?? row?.source)!.title}</p>}
          {(fact?.explainer ?? row?.explainer) && <Markdown text={(fact?.explainer ?? row?.explainer)!} />}
        </>;
  return (
    <div key={d.key} className="ly-q ly-q-v" onClickCapture={(e) => { if ((e.target as Element).closest(".assumption-name label")) open(e); }}>
      <EvidenceSlider
        label={model.story?.questions?.[key] ?? plain(fact?.label ?? row?.label ?? d.label)}
        format={(fact ?? row)?.format}
        value={fact ? edits[key] ?? pickValue(fact.value) : whole.values[d.id]}
        best={fact ? pickValue(fact.value) : whole.base[d.id]}
        low={d.low * k}
        high={d.high * k}
        settable={!!fact || (!!row && editable(model, row.id))}
        set={(v) => setEdit(key, v / k, fact ? pickValue(fact.value) : pageBase[d.id])}
        about={about}
      />
    </div>
  );
}
