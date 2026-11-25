// The layered page for a charity of several programmes (ModelLayers for one): the likely range for the
// whole charity; the questions that move it most, from any programme; and "How it's worked out": $1,000
// split across the programmes by their share of the money, each opening into its own story at that share.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { lib, modelUrl } from "../lib/data";
import { assumptionValues, compute } from "../engine/model";
import { uncertainty, type Driver } from "../engine/uncertainty";
import { formatValue } from "../lib/format";
import { useFigure } from "../lib/metric";
import { useAssumptionValues } from "../lib/use-results";
import { clearEdits, setPageModels, useEdits } from "../lib/edit-state";
import { fillStory, storyValue } from "../lib/story";
import { charityOf, fullModel, programsOf, type ProgramFigure } from "../lib/whole";
import { COVER, Curve, MAX, Question } from "./ModelLayers";
import { WaterfallInSlot } from "./Waterfall";
import "./layers.css";

type Ask = { d: Driver; p: ProgramFigure; weight: number };

export default function WholeLayers({ id, children }: { id: string; children?: ReactNode }) {
  const model = lib.models.get(id)!;
  const charity = lib.charities.get(model.charity)!;
  const programs = useMemo(() => programsOf(model)!, [model]);
  // Every programme's edits stay in the URL, whichever programme's numbers are being filtered (edit-state).
  setPageModels(programs.map((p) => fullModel(p.model)), lib);
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const fig = useFigure(lib, av);
  const c = useMemo(() => charityOf(programs, av, urlEdits), [programs, av, urlEdits]);
  // The range bar's axis stays put while the reader moves things: around the result at default values.
  const base = useMemo(() => charityOf(programs, assumptionValues(lib.assumptions), {}).result, [programs]);
  const pos = (x: number) => (x > 0 && base > 0 ? Math.max(0, Math.min(100, (Math.log(x / base) / Math.log(30) + 1) * 50)) : 0);
  const range = { low: c.low, high: c.high };
  const shown = fig.format(range.low) === fig.format(range.high) ? fig.format(range.low) : `${fig.format(range.low)} to ${fig.format(range.high)}`;

  // The range lights up each time it moves, once the reader's saved values have arrived.
  const first = useRef(shown);
  const settled = useRef(false);
  useEffect(() => { const t = setTimeout(() => (settled.current = true), 1000); return () => clearTimeout(t); }, []);
  if (!settled.current) first.current = shown;
  const moved = shown !== first.current;

  // An open layer's heading pins under the range: it needs the range's height.
  const section = useRef<HTMLElement>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = top.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => section.current?.style.setProperty("--ly-top-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The questions: each programme's drivers, weighted by how much of the charity's result it gives. A
  // number that two programmes name alike is left out (an edit to it would land in both).
  const rank = () => {
    const seen = new Map<string, Ask>();
    for (const p of c.programs) {
      const values = compute(lib, p.model, av, p.edits);
      const u = uncertainty(lib, p.model, values, av, "charityevals", p.edits);
      const part = c.result ? (p.share * p.whole.result) / c.result : p.share;
      for (const d of u.drivers) {
        if (d.scope === "model" || (d.scope === "row" && (!p.model.byId.has(d.id) || c.programs.some((o) => o !== p && o.model.byId.has(d.id))))) continue;
        const prev = seen.get(d.key);
        const weight = (prev?.weight ?? 0) + part * d.share;
        seen.set(d.key, { d, p: prev && prev.p.share > p.share ? prev.p : p, weight });
      }
    }
    const out: Ask[] = [];
    let covered = 0;
    for (const a of [...seen.values()].sort((x, y) => y.weight - x.weight)) {
      if (out.length >= MAX || covered >= COVER || a.weight < 0.01) break;
      out.push(a);
      covered += a.weight;
    }
    return out.map((a) => ({ key: a.d.key, program: a.p.program }));
  };
  // Ranked on arrival, then held from the reader's first change, as on a one-programme page.
  const [asks, setAsks] = useState(rank);
  const [held, setHeld] = useState(false);
  useEffect(() => { if (!held) setAsks(rank()); }, [c, held]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const hold = () => setHeld(true);
    window.addEventListener("input", hold, { capture: true, once: true });
    window.addEventListener("change", hold, { capture: true, once: true });
    return () => { window.removeEventListener("input", hold, { capture: true }); window.removeEventListener("change", hold, { capture: true }); };
  }, []);
  const unedited = useMemo(() => new Map(c.programs.map((p) => [p.program, compute(lib, p.model, av)])), [c, av]);
  const edited = Object.keys(urlEdits).length;

  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (k: string) => setOpen((o) => { const x = new Set(o); if (x.has(k)) x.delete(k); else x.add(k); return x; });
  const num = (spec: string, p: ProgramFigure, scale: number) => {
    const [src, f] = spec.split("|").map((s) => s.trim());
    const x = storyValue(src, p.whole.values, p.whole.result) * scale;
    return f === "y" ? fig.format(x) : formatValue(x, f === "$" ? "usd" : f === "%" ? "percent" : "number");
  };
  const fill = (t: string, p: ProgramFigure) => fillStory(t, p.whole.values, p.whole.result, (x) => fig.format(x));

  return (
    <div className="model-view" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
    <section className="model-tree layers" aria-label="What a donation does" ref={section}>
      <div className="ly-top" ref={top}>
        <div className="ly-range">
          <p className="ly-range-line"><span key={shown} className={`ly-range-num num ${moved ? "ly-moved" : ""}`}>{shown}</span> <span className="ly-range-unit">{fig.metric.unit.toLowerCase()}</span></p>
          <Curve places={c.places} page="" engine={lib} pos={pos} range={range} />
        </div>
      </div>

      <details className="ly-layer">
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">What it depends on</h2></summary>
        <div className="ly-body">
          <div className="ly-questions">
            {asks.map(({ key, program }) => {
              const p = c.programs.find((x) => x.program === program);
              const d = p && uncertainty(lib, p.model, compute(lib, p.model, av, p.edits), av, "charityevals", p.edits).drivers.find((x) => x.key === key);
              if (!p || !d) return null;
              return <Question key={key} d={d} model={p.model} whole={p.whole} av={av} edits={p.edits} pageBase={unedited.get(p.program)!} jump={() => {}} />;
            })}
          </div>
          {edited > 0 && <p className="small"><button type="button" className="link-button" onClick={clearEdits}>Undo your {edited === 1 ? "change" : `${edited} changes`}</button></p>}
        </div>
      </details>

      <details className="ly-layer">
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">How it's worked out</h2></summary>
        <div className="ly-body">
          <ol className="ly-chain wl-chain">
            <li className="ly-total"><span className="ly-v num">$1,000</span><span className="ly-t">given to {charity.name}</span></li>
            {c.programs.map((p) => {
              const here = open.has(p.program);
              const steps = p.model.story?.steps ?? [];
              return (
                <li key={p.program} className={`wl-prog ${here ? "open" : ""}`}>
                  <button type="button" className="wl-row" aria-expanded={here} onClick={() => toggle(p.program)}>
                    <span className="ly-v num">{formatValue(1000 * p.share, "usd")}</span>
                    <span className="wl-label"><ChevronRight size={14} className="wl-chev" aria-hidden />{p.label}</span>
                    <span className="wl-yrs num">{fig.format(p.share * p.whole.result)}</span>
                    <span className="wl-share" aria-hidden><i style={{ width: `${Math.max(0.5, p.share * 100)}%` }} /></span>
                  </button>
                  {(
                    <div className="wl-inner" hidden={!here}>
                      <ol className="ly-chain">
                        {steps.map((s, i) => (
                          <li key={i} className={s.total !== undefined ? "ly-total" : "ly-op"}>
                            <span className="ly-v num">{s.total !== undefined ? num(s.total, p, p.share) : fill(s.op ?? "", p)}</span>
                            <span className="ly-t">{i === steps.length - 1 ? fill(s.text, p).replace(/ per \$1,000$/, "") : fill(s.text, p)}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="small wl-own"><a href={modelUrl(lib, p.model)}>Its own page</a>, with every number behind these</p>
                    </div>
                  )}
                </li>
              );
            })}
            <li className="ly-total ly-end"><span className="ly-v num">{fig.format(c.result)}</span><span className="ly-t">{fig.metric.unit.toLowerCase()}</span></li>
          </ol>
        </div>
      </details>

      <details className="ly-layer">
        <summary><ChevronRight size={18} className="ly-chev" aria-hidden /><h2 className="ly-title">Write-up</h2></summary>
        <div className="ly-body ly-evaluation">{children}</div>
      </details>
      <WaterfallInSlot model={fullModel(model)} av={av} edits={c.programs.find((p) => p.model.id === id)?.edits ?? {}} />
    </section>
    </div>
  );
}
