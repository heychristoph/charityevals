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
  const flipRef = useFlip(results.map((r) => r.charity.id).join());
  const label = lib.assumptions.common.benchmark_label;

  return (
    <figure className="rankings" aria-labelledby="rankings-caption">
      <div className="view-bar">
        <ViewToggle />
        <p className="view-note">
          {view === "evaluator"
            ? "Each charity as its evaluators published it (GiveWell, ACE, HLI), compared with our exchange rates between causes."
            : "Our models: the evaluators' analyses plus your assumptions and our accounting adjustments."}
        </p>
      </div>
      <figcaption id="rankings-caption" className="rankings-caption">
        <strong>Good done per dollar, as a multiple of GiveDirectly</strong>
        <span className="muted"> · each evaluator's central estimate (dot) with joint low to joint high (bar), log scale. Where several evaluators model a charity, the row sits at their geometric mean.</span>
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
          const c = r.charity;
          const multi = r.models.length > 1;
          const warns = [...new Set(r.models.flatMap((x) => x.flags.filter((f) => f.level === "warn").map((f) => f.short)))];
          const owners = r.models.map((x) => lib.owners.get(x.model.owner)!);
          const clampedLow = r.low < DOMAIN[0];
          const clampedHigh = r.high > DOMAIN[1];
          return (
            <li key={c.id} ref={flipRef(c.id)} className="r-row" style={{ ["--cause" as string]: `var(--cause-${c.cause})` }}>
              <div className="r-name">
                <span className="r-rank num">{i + 1}</span>
                <div>
                  <a href={`/${c.id}`} className="r-link">{c.name}</a>
                  <div className="r-meta small">
                    <span className="r-cause">{CAUSE_LABEL[c.cause]}</span>
                    <span className="muted"> · {owners.map((o) => o.short).join(", ")}</span>
                  </div>
                </div>
              </div>

              <div
                className="r-track"
                role="img"
                aria-label={`${c.name}: ${r.models.map((x, k) => `${owners[k].name} ${formatMultiple(x.central)}`).join(", ")}${label}; range ${formatMultiple(r.low)} to ${formatMultiple(r.high)}`}
              >
                {TICKS.map((t) => (
                  <span key={t} className={`r-grid ${t === 1 ? "r-grid-one" : ""}`} style={{ left: pct(t) }} />
                ))}
                <span
                  className="r-bar"
                  style={{ clipPath: clipSpan(xFor(r.low, 100), xFor(r.high, 100), clampedLow || clampedHigh ? `${clampedLow ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedLow ? 0 : 4}px` : "4px") }}
                />
                {r.models.map((x, k) => (
                  <span key={x.model.id} className="r-dot-layer" style={{ transform: `translateX(${pct(x.central)})`, top: multi ? `${k % 2 ? 9 : -9}px` : undefined }}>
                    <span className={`r-dot ${multi ? "r-dot-owner" : ""}`} title={`${owners[k].name}: ${formatMultiple(x.central)}`}>
                      {multi && <span className="r-dot-label">{owners[k].short}</span>}
                    </span>
                  </span>
                ))}
              </div>

              <div className="r-value">
                <span className="r-central num">{formatMultiple(r.central)}</span>
                <span className="r-range small muted num">
                  {multi ? `${r.models.length} evaluators` : `${formatMultiple(r.low)}–${formatMultiple(r.high)}`}
                </span>
              </div>

              <div className="r-foot small">
                <span className="muted num">
                  {r.models.map((x, k) => {
                    const unit = lib.assumptions.units[x.model.output!.unit];
                    return `${multi ? owners[k].short + ": " : ""}${formatValue(x.native, Math.abs(x.native) < 0.1 ? "small" : "number")} ${unit.short} per dollar`;
                  }).join(" · ")}
                </span>
                {c.donate && <a href={c.donate} rel="noopener" className="r-donate">Donate</a>}
                {warns.length > 0 && (
                  <span className="r-flags">
                    <AlertTriangle size={14} aria-hidden />
                    <a href={`/${c.id}#flags`}>
                      {warns.length} {warns.length === 1 ? "flag" : "flags"}: {warns.join(", ")}
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
