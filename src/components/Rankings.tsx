import { useLayoutEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { lib } from "../lib/data";
import { useResults } from "../lib/use-results";
import { formatMultiple, formatValue } from "../lib/format";
import { DOMAIN, TICKS, xFor, tickLabel, clipSpan, pctStr } from "./scale";
import ViewToggle from "./ViewToggle";
import "./rankings.css";

const CAUSE_LABEL: Record<string, string> = {
  "global-health": "Global health",
  "animal-welfare": "Animal welfare",
  "ai-safety": "AI safety",
};

const pct = (v: number) => pctStr(xFor(v, 100));

/** Rows slide to their new rank when assumptions change (FLIP), so the visitor sees the reorder. */
function useFlip(order: string) {
  const refs = useRef(new Map<string, HTMLElement>());
  const last = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [id, el] of refs.current) {
      const top = el.getBoundingClientRect().top;
      const prev = last.current.get(id);
      if (prev !== undefined && prev !== top && !reduce) {
        el.animate([{ transform: `translateY(${prev - top}px)` }, { transform: "none" }], {
          duration: 420,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        });
      }
      last.current.set(id, top);
    }
  }, [order]);
  return (id: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  };
}

export default function Rankings() {
  const { results, flips, view } = useResults();
  const flipRef = useFlip(results.map((r) => r.model.id).join());
  const label = lib.assumptions.common.benchmark_label;

  return (
    <figure className="rankings" aria-labelledby="rankings-caption">
      <div className="view-bar">
        <ViewToggle />
        <p className="view-note">
          {view === "evaluator"
            ? "Each charity as its evaluator published it (GiveWell, Animal Charity Evaluators), compared with our exchange rates between causes."
            : "Our models: the evaluators' analyses plus your assumptions and our accounting adjustments."}
        </p>
      </div>
      <figcaption id="rankings-caption" className="rankings-caption">
        <strong>Good done per dollar, as a multiple of GiveDirectly</strong>
        <span className="muted"> · central estimate (dot) with joint low to joint high (bar), log scale</span>
      </figcaption>

      <div className="r-axis" aria-hidden>
        <div />
        <div className="r-track">
          {TICKS.map((t) => (
            <span key={t} className="r-tick num" style={{ left: pct(t) }}>{tickLabel(t)}</span>
          ))}
        </div>
        <div />
      </div>

      <ol className="r-list">
        {results.map((r, i) => {
          const m = r.model;
          const unit = lib.assumptions.units[m.output!.unit];
          const warns = r.flags.filter((f) => f.level === "warn");
          const clampedLow = r.low < DOMAIN[0];
          const clampedHigh = r.high > DOMAIN[1];
          return (
            <li key={m.id} ref={flipRef(m.id)} className="r-row" style={{ ["--cause" as string]: `var(--cause-${m.cause})` }}>
              <div className="r-name">
                <span className="r-rank num">{i + 1}</span>
                <div>
                  <a href={`/${m.id}`} className="r-link">{m.name}</a>
                  <div className="r-meta small">
                    <span className="r-cause">{CAUSE_LABEL[m.cause]}</span>
                    {m.kind === "variant" && <span className="muted"> · variant</span>}
                    <span className="muted"> · {r.view === "evaluator" ? `as published by ${m.evaluator?.name}` : `from ${m.source?.publisher}`}</span>
                  </div>
                </div>
              </div>

              <div className="r-track" role="img" aria-label={`${m.name}: ${formatMultiple(r.central)}${label}, range ${formatMultiple(r.low)} to ${formatMultiple(r.high)}`}>
                {TICKS.map((t) => (
                  <span key={t} className={`r-grid ${t === 1 ? "r-grid-one" : ""}`} style={{ left: pct(t) }} />
                ))}
                <span
                  className="r-bar"
                  style={{ clipPath: clipSpan(xFor(r.low, 100), xFor(r.high, 100), clampedLow || clampedHigh ? `${clampedLow ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedLow ? 0 : 4}px` : "4px") }}
                />
                <span className="r-dot-layer" style={{ transform: `translateX(${pct(r.central)})` }}>
                  <span className="r-dot" />
                </span>
              </div>

              <div className="r-value">
                <span className="r-central num">{formatMultiple(r.central)}</span>
                <span className="r-range small muted num">
                  {formatMultiple(r.low)}–{formatMultiple(r.high)}
                </span>
              </div>

              <div className="r-foot small">
                <span className="muted num">
                  {formatValue(r.native, Math.abs(r.native) < 0.1 ? "small" : "number")} {unit.short} per dollar
                </span>
                {warns.length > 0 && (
                  <span className="r-flags">
                    <AlertTriangle size={14} aria-hidden />
                    <a href={`/${m.id}#flags`}>
                      {warns.length} {warns.length === 1 ? "flag" : "flags"}: {warns.map((w) => w.short).join(", ")}
                    </a>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="r-notes small muted">
        {view === "evaluator" ? (
          <p>In the evaluator view each model's own assumptions are fixed; only the exchange rates between causes move the ranking.</p>
        ) : flips.length > 0 ? (
          <p>
            <strong className="ink">What could change this order:</strong>{" "}
            {flips.map((f, i) => (
              <span key={f.id}>
                {i > 0 && "; "}
                <a href={`#a-${f.id}`}>{f.label}</a>
                {" "}at its {f.atLow && f.atHigh ? "low or high" : f.atLow ? "low" : "high"} end
              </span>
            ))}
            .
          </p>
        ) : (
          <p>No single assumption, moved to the end of its range, changes this order.</p>
        )}
        <p>
          Source: charityevals re-implementations of GiveWell's GiveDirectly analysis (November 2024) and Animal Charity
          Evaluators' Sinergia Animal analysis (2025); each model page links its spreadsheet and model file.
        </p>
        <p>
          Joint low and joint high set every input to whichever end of its range lowers or raises the result. They are wider than a
          confidence interval and are not probabilities. Cross-cause multiples depend entirely on the exchange rates you set.
        </p>
      </div>
    </figure>
  );
}
