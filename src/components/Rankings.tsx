import { useLayoutEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { lib } from "../lib/data";
import { useResults } from "../lib/use-results";
import { formatMultiple } from "../lib/format";
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
  const { results, view } = useResults();
  const flipRef = useFlip(results.map((r) => r.charity.id).join());
  const label = lib.assumptions.common.benchmark_label;

  return (
    <figure className="rankings" aria-labelledby="rankings-caption">
      <div className="view-bar">
        <ViewToggle />
        <p className="view-note">
          {view === "evaluator" ? "As the evaluators published them." : "The evaluators' analyses, with your assumptions."}
        </p>
      </div>
      <figcaption id="rankings-caption" className="rankings-caption">
        <strong>Good done per dollar, × GiveDirectly</strong>
        <span className="muted"> · dot: best estimate, bar: plausible range</span>
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
                {c.donate && <a href={c.donate} rel="noopener" className="r-donate" data-track="donate" data-charity={c.id}>Donate</a>}
                {warns.length > 0 && (
                  <a className="r-flags" href={`/${c.id}#flags`} title={warns.join(", ")}>
                    <AlertTriangle size={14} aria-hidden />
                    {warns.length} {warns.length === 1 ? "caveat" : "caveats"}
                    <span className="visually-hidden">: {warns.join(", ")}</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="r-notes small muted">
        Bars run from joint low to joint high: every input at the end of its range that lowers or raises the result.{" "}
        <a href="/method">How we compare charities</a>
      </p>
    </figure>
  );
}
