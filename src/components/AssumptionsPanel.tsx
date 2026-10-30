import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw, Link2, Check, ChevronRight } from "lucide-react";
import MiniRanking from "./MiniRanking";
import { lib } from "../lib/data";
import { pickValue } from "../engine/model";
import { formatAssumption, formatValue, parseTyped } from "../lib/format";
import { assumptionComparable } from "../lib/comparables";
import { useAssumptionValues } from "../lib/use-results";
import { setAssumption, resetAssumptions, useOverrides } from "../lib/assumption-state";
import { cancelAssumptionEvents, track, trackAssumption } from "../lib/analytics";
import type { Row } from "../engine/schema";
import InfoTip, { WithTip } from "./InfoTip";
import "./assumptions.css";

const STEPS = 400;
/** Within this many steps of the default, the slider snaps to it: the way back to the default. */
const SNAP = 8;

function scaleFor(r: Row) {
  const best = pickValue(r.value);
  const v = typeof r.value === "object" ? r.value : { best };
  let low = v.low ?? best / 10;
  let high = v.high ?? best * 10;
  if (low === high) { low = best / 10; high = best * 10; }
  // Every positive range is a ratio, so it runs on a log scale: halving and doubling the default are the
  // same distance. A range that starts at zero (the discount rate) stays linear.
  const log = low > 0;
  return {
    low,
    high,
    log,
    toStep: (x: number) => {
      const t = log ? Math.log(x / low) / Math.log(high / low) : (x - low) / (high - low);
      return Math.round(Math.min(1, Math.max(0, t)) * STEPS);
    },
    fromStep: (s: number) => {
      const t = s / STEPS;
      const x = log ? low * (high / low) ** t : low + t * (high - low);
      return Number(x.toPrecision(2));
    },
  };
}

/** How a shared assumption reads on screen: some are multipliers shown in the site's own terms. */
function shownAs(row: Row) {
  return { k: row.shown_as?.factor ?? 1, fmt: row.shown_as?.format ?? row.format };
}

/** The value beside a slider; click it to type one in. */
function ValueField({ row, value, best, log }: { row: Row; value: number; best: number; log: boolean }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const { k, fmt } = shownAs(row);
  const shown = formatValue(value * k, fmt);
  const seed = shown.replace(/[%×,]/g, "");
  const commit = () => {
    // Left as shown (rounded), the value keeps its full precision.
    if (text.trim() === seed) return setEditing(false);
    const typed = parseTyped(text, fmt, log);
    const v = typed === undefined ? undefined : typed / k;
    if (v !== undefined) {
      setAssumption(row.id, v, best);
      trackAssumption(row.id, v, best);
    }
    setEditing(false);
  };
  if (!editing)
    return (
      <button type="button" className="value-field num" aria-label={`${row.label}: ${shown}. Type a value`} onClick={() => {
        setText(seed);
        setEditing(true);
      }}>
        {shown}
      </button>
    );
  return (
    <span className="value-edit num">
      <input
        autoFocus
        inputMode="decimal"
        aria-label={`${row.label}, type a value`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
      />
      {fmt === "percent" ? "%" : fmt === "multiple" ? "×" : ""}
    </span>
  );
}

function Slider({ row, value, compact }: { row: Row; value: number; compact: boolean }) {
  const id = useId();
  const best = pickValue(row.value);
  const scale = scaleFor(row);
  const { k, fmt } = shownAs(row);
  const changed = Math.abs(value - best) > Math.abs(best) * 1e-9;
  const av = useAssumptionValues();
  const comparable = assumptionComparable(row.id, value, av);
  return (
    <div className={`assumption tip-host ${changed ? "changed" : ""}`} id={`a-${row.id}`}>
      <div className="assumption-head">
        {compact && row.explainer ? (
          <LabelWithTip htmlFor={id} text={row.label}><InfoTip label="Why this value"><Markdown text={row.explainer} /><Technical row={row} /></InfoTip></LabelWithTip>
        ) : <label htmlFor={id} className="assumption-name">{row.label}</label>}
        <ValueField row={row} value={value} best={best} log={scale.log} />
      </div>
      <div className="slider-wrap" style={{ ["--default" as string]: `${scale.toStep(best) / STEPS}` }}>
        <span className="default-tick" aria-hidden />
        <input
          id={id}
          aria-label={row.label}
          type="range"
          min={0}
          max={STEPS}
          value={scale.toStep(value)}
          onChange={(e) => {
            const step = Number(e.target.value);
            const v = Math.abs(step - scale.toStep(best)) <= SNAP ? best : scale.fromStep(step);
            setAssumption(row.id, v, best);
            trackAssumption(row.id, v, best);
          }}
          aria-valuetext={formatValue(value * k, fmt)}
        />
      </div>
      <div className="assumption-scale small num">
        <span>{formatValue(scale.low * k, fmt)}</span>
        <span>{formatValue(scale.high * k, fmt)}</span>
      </div>
      {comparable && <p className="comparable" aria-live="polite">{comparable}</p>}
      {row.explainer && !compact && <div className="explainer small"><Markdown text={row.explainer} /><Technical row={row} /></div>}
    </div>
  );
}

/** A slider's label ending in an info tip, with the tip outside the <label> so its button stays out of
 * the label's text. The last word and the tip share one unbreakable span, as in WithTip. */
function LabelWithTip({ htmlFor, text, children }: { htmlFor: string; text: string; children: React.ReactNode }) {
  const i = text.lastIndexOf(" ") + 1;
  return (
    <span className="assumption-name">
      {i > 0 && <label htmlFor={htmlFor}>{text.slice(0, i)}</label>}
      <span className="nobr"><label htmlFor={htmlFor}>{text.slice(i)}</label>{"\u00a0"}{children}</span>
    </span>
  );
}

function Toggle({ row, value, compact }: { row: Row; value: number; compact: boolean }) {
  const best = pickValue(row.value);
  const on = value >= 0.5;
  return (
    <div className={`assumption toggle-row tip-host ${on !== best >= 0.5 ? "changed" : ""}`} id={`a-${row.id}`}>
      <div className="assumption-head">
        <span className="toggle-label">
          {compact && row.explainer ? (
            <WithTip text={row.label}><InfoTip label="What this means"><Markdown text={row.explainer} /><Technical row={row} /></InfoTip></WithTip>
          ) : row.label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={row.label}
          className="switch"
          onClick={() => {
            setAssumption(row.id, on ? 0 : 1, best);
            trackAssumption(row.id, on ? 0 : 1, best, true);
          }}
        >
          <span className="switch-knob" />
          <span className="switch-text">{on ? "On" : "Off"}</span>
        </button>
      </div>
      {row.explainer && !compact && <div className="explainer small"><Markdown text={row.explainer} /><Technical row={row} /></div>}
    </div>
  );
}

/** An evidence-based rate: its value, source and range, with nothing to drag. */
function Fixed({ row }: { row: Row }) {
  const v = typeof row.value === "object" ? row.value : undefined;
  return (
    <div className="assumption" id={`a-${row.id}`}>
      <div className="assumption-head">
        <span className="assumption-name">{row.label}</span>
        <span className="num fixed-value">{formatAssumption(row, pickValue(row.value))}</span>
      </div>
      {v?.low !== undefined && v?.high !== undefined && (
        <p className="small muted">Range {formatAssumption(row, v.low)} to {formatAssumption(row, v.high)}, used for the plausible ranges.</p>
      )}
      <div className="explainer small"><Markdown text={row.explainer ?? ""} /><Technical row={row} /></div>
    </div>
  );
}

/** The jargon name, kept out of the label and shown once for readers who know it from evaluators' sheets. */
function Technical({ row }: { row: Row }) {
  return row.technical ? <p className="technical muted">Technical name: {row.technical}</p> : null;
}

/** Paragraphs and **bold** only; explainers are short. */
export function Markdown({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i}>
          {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
          )}
        </p>
      ))}
    </>
  );
}

export default function AssumptionsPanel({ compact = true, groups }: { compact?: boolean; groups?: string[] }) {
  const overrides = useOverrides();
  const [copied, setCopied] = useState(false);
  // In the side panel each group folds; the exchange rates, which move the ranking most, start open.
  const [open, setOpen] = useState<Record<string, boolean>>({ "cross-cause": true });
  const changedCount = Object.keys(overrides).length;
  const shown = lib.assumptions.groups.filter((g) => !groups || groups.includes(g.id));
  // On a phone the panel sits below everything else: a button stays at the bottom of the screen until
  // the panel itself is in view.
  const self = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!compact) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = self.current;
      if (el) setInView(el.getBoundingClientRect().top < window.innerHeight);
    };
    const later = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", later, { passive: true });
    window.addEventListener("resize", later);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", later);
      window.removeEventListener("resize", later);
    };
  }, [compact]);

  return (
    <section id="your-assumptions" ref={self} className={`assumptions ${compact ? "compact" : ""}`} aria-labelledby="assumptions-title">
      {compact && !inView && (
        <a href="#your-assumptions" className="values-jump" onClick={() => track("values_jump", { value: changedCount })}>
          Your values{changedCount > 0 && <span className="values-jump-count"> · {changedCount} changed</span>}
        </a>
      )}
      {compact && <MiniRanking />}
      <div className="assumptions-top">
        <h2 id="assumptions-title" className={compact ? undefined : "visually-hidden"}>Your values</h2>
        <div className="assumptions-actions small">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href).then(() => {
                track("link_copy", { value: changedCount });
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }).catch(() => {
                /* no clipboard access: the address bar still has the link */
              });
            }}
          >
            {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />} {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className="link-button" disabled={!changedCount} onClick={() => {
            cancelAssumptionEvents();
            track("assumption_reset", { value: changedCount });
            resetAssumptions();
          }}>
            <RotateCcw size={14} aria-hidden /> Reset{changedCount ? ` (${changedCount})` : ""}
          </button>
        </div>
      </div>
      {shown.map((g) => {
        // Evidence-based rates aren't sliders: the side panel leaves them out, the full page lists them.
        const rows = lib.assumptions.rows.filter((r) => r.section === g.id && !(compact && r.fixed));
        if (!rows.length) return null;
        const shut = compact && !open[g.id];
        const changed = rows.filter((r) => overrides[r.id] !== undefined).length;
        return (
          <fieldset key={g.id} className={`group ${shut ? "shut" : ""}`}>
            <legend>
              {compact ? (
                <button type="button" className="group-toggle" aria-expanded={!shut} onClick={() => setOpen((o) => ({ ...o, [g.id]: shut }))}>
                  <ChevronRight size={14} className="chev" aria-hidden />
                  {g.title}
                  {shut && changed > 0 && <span className="group-changed">{changed} changed</span>}
                </button>
              ) : g.title}
            </legend>
            {!compact && g.explainer && <p className="group-explainer muted">{g.explainer}</p>}
            {!shut && rows.map((r) => (
              r.fixed
                ? <Fixed key={r.id} row={r} />
                : r.format === "toggle"
                ? <Toggle key={r.id} row={r} value={overrides[r.id] ?? pickValue(r.value)} compact={compact} />
                : <Slider key={r.id} row={r} value={overrides[r.id] ?? pickValue(r.value)} compact={compact} />
            ))}
          </fieldset>
        );
      })}
    </section>
  );
}
