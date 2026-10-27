import { useId, useState } from "react";
import { RotateCcw, Link2, Check, ChevronRight } from "lucide-react";
import MiniRanking from "./MiniRanking";
import { lib } from "../lib/data";
import { pickValue } from "../engine/model";
import { formatValue } from "../lib/format";
import { assumptionComparable } from "../lib/comparables";
import { useAssumptionValues } from "../lib/use-results";
import { setAssumption, resetAssumptions, useOverrides, useView } from "../lib/assumption-state";
import type { Row } from "../engine/schema";
import "./assumptions.css";

const STEPS = 400;

function scaleFor(r: Row) {
  const best = pickValue(r.value);
  const v = typeof r.value === "object" ? r.value : { best };
  let low = v.low ?? best / 10;
  let high = v.high ?? best * 10;
  if (low === high) { low = best / 10; high = best * 10; }
  const log = low > 0 && high / low >= 10;
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
      return Number(x.toPrecision(3));
    },
  };
}

function Slider({ row, value, compact }: { row: Row; value: number; compact: boolean }) {
  const id = useId();
  const best = pickValue(row.value);
  const scale = scaleFor(row);
  const changed = Math.abs(value - best) > Math.abs(best) * 1e-9;
  const av = useAssumptionValues();
  const comparable = assumptionComparable(row.id, value, av);
  return (
    <div className={`assumption ${changed ? "changed" : ""}`} id={`a-${row.id}`}>
      <div className="assumption-head">
        <label htmlFor={id}>{row.label}</label>
        <output htmlFor={id} className="num">{formatValue(value, row.format)}</output>
      </div>
      <div className="slider-wrap" style={{ ["--default" as string]: `${scale.toStep(best) / STEPS}` }}>
        <span className="default-tick" aria-hidden />
        <input
          id={id}
          type="range"
          min={0}
          max={STEPS}
          value={scale.toStep(value)}
          onChange={(e) => setAssumption(row.id, scale.fromStep(Number(e.target.value)), best)}
          aria-valuetext={formatValue(value, row.format)}
        />
      </div>
      <div className="assumption-scale small num">
        <span>{formatValue(scale.low, row.format)}</span>
        <span>{formatValue(scale.high, row.format)}</span>
      </div>
      {comparable && <p className="comparable" aria-live="polite">{comparable}</p>}
      {changed && (
        <button type="button" className="link-button small reset-one" onClick={() => setAssumption(row.id, undefined, best)}>
          <RotateCcw size={13} aria-hidden /> Back to default ({formatValue(best, row.format)})
        </button>
      )}
      {row.explainer && (
        compact ? (
          <details className="explainer small">
            <summary><ChevronRight size={14} className="chev" aria-hidden /> Why this value</summary>
            <Markdown text={row.explainer} />
          </details>
        ) : (
          <div className="explainer small"><Markdown text={row.explainer} /></div>
        )
      )}
    </div>
  );
}

function Toggle({ row, value, compact }: { row: Row; value: number; compact: boolean }) {
  const best = pickValue(row.value);
  const on = value >= 0.5;
  return (
    <div className={`assumption toggle-row ${on !== best >= 0.5 ? "changed" : ""}`} id={`a-${row.id}`}>
      <div className="assumption-head">
        <span id={`l-${row.id}`} className="toggle-label">{row.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby={`l-${row.id}`}
          className="switch"
          onClick={() => setAssumption(row.id, on ? 0 : 1, best)}
        >
          <span className="switch-knob" />
          <span className="switch-text">{on ? "On" : "Off"}</span>
        </button>
      </div>
      {row.explainer && (
        compact ? (
          <details className="explainer small">
            <summary><ChevronRight size={14} className="chev" aria-hidden /> What this means</summary>
            <Markdown text={row.explainer} />
          </details>
        ) : (
          <div className="explainer small"><Markdown text={row.explainer} /></div>
        )
      )}
    </div>
  );
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
  const view = useView();
  const [copied, setCopied] = useState(false);
  const changedCount = Object.keys(overrides).length;
  const shown = lib.assumptions.groups.filter((g) => !groups || groups.includes(g.id));

  return (
    <section id="your-assumptions" className={`assumptions ${compact ? "compact" : ""}`} aria-labelledby="assumptions-title">
      {compact && <MiniRanking />}
      <div className="assumptions-top">
        <h2 id="assumptions-title">{compact ? "Your assumptions" : "Shared assumptions"}</h2>
        <div className="assumptions-actions small">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />} {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className="link-button" disabled={!changedCount} onClick={resetAssumptions}>
            <RotateCcw size={14} aria-hidden /> Reset{changedCount ? ` (${changedCount})` : ""}
          </button>
        </div>
      </div>
      {compact && (
        <p className="small muted intro">
          Moral weights and exchange rates are judgment calls. Drag them and every result on the site recomputes.
        </p>
      )}
      {view === "evaluator" && (
        <p className="small evaluator-note">
          Evaluator view: each model uses its evaluator's own moral weights and accounting, so only the exchange rates between causes
          apply.
        </p>
      )}
      {shown.map((g) => (
        <fieldset key={g.id} className="group" disabled={view === "evaluator" && g.id !== "cross-cause"}>
          <legend>{g.title}</legend>
          {!compact && g.explainer && <p className="group-explainer muted">{g.explainer}</p>}
          {lib.assumptions.rows
            .filter((r) => r.section === g.id)
            .map((r) => (
              r.format === "toggle"
                ? <Toggle key={r.id} row={r} value={overrides[r.id] ?? pickValue(r.value)} compact={compact} />
                : <Slider key={r.id} row={r} value={overrides[r.id] ?? pickValue(r.value)} compact={compact} />
            ))}
        </fieldset>
      ))}
    </section>
  );
}
