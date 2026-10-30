import { useLayoutEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { lib } from "../lib/data";
import { useResults } from "../lib/use-results";
import type { Basis } from "../engine/ranking";
import { formatYears } from "../lib/format";
import { DOMAIN, TICKS, xFor, tickLabel, clipSpan, pctStr } from "./scale";
import CharityLogo from "./CharityLogo";
import InfoTip from "./InfoTip";
import "./rankings.css";

const CAUSE_LABEL: Record<string, string> = {
  "global-health": "Global health",
  "animal-welfare": "Animal welfare",
  "ai-safety": "AI safety",
};

const pct = (v: number) => pctStr(xFor(v, 100));

/** Narrowest range bar, in % of the track: a range narrower than the dot would hide behind it. */
const MIN_SPAN = 4;

/** The range bar's ends in % of the track, widened around the row's figure to at least MIN_SPAN. */
function barSpan(low: number, high: number, central: number): [number, number] {
  let lo = xFor(Math.min(low, high), 100);
  let hi = xFor(Math.max(low, high), 100);
  if (hi - lo < MIN_SPAN) {
    const mid = Math.min(Math.max(xFor(central, 100), MIN_SPAN / 2), 100 - MIN_SPAN / 2);
    lo = Math.min(lo, mid - MIN_SPAN / 2);
    hi = Math.max(hi, mid + MIN_SPAN / 2);
  }
  return [lo, hi];
}

/** Vertical offset of each evaluator's dot on a row with several, so they never sit on each other. */
const LANE = 11;

/** How an evaluator's figure was formed, for its dot's tooltip (src/engine/ranking.ts). */
const BASIS: Record<Basis, (n: number) => string> = {
  single: () => "",
  weighted: (n) => `, ${n} programs weighted by funding`,
  median: (n) => `, median of ${n} programs`,
};

/** Most a row slides when it changes rank: long moves start this far away, so a row that jumps
 * many places doesn't fly across the page. */
const MAX_SLIDE = 160;

/** Rows slide to their new rank when assumptions change (FLIP), so the visitor sees the reorder.
 * Positions come from layout (offsetTop), which ignores a slide still running: measuring on screen
 * while dragging a slider added each new slide onto the last and threw rows out of the list. */
function useFlip(order: string) {
  const refs = useRef(new Map<string, HTMLElement>());
  const last = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [id, el] of refs.current) {
      const top = el.offsetTop;
      const prev = last.current.get(id);
      if (prev !== undefined && prev !== top && !reduce) {
        for (const a of el.getAnimations()) a.cancel();
        const from = Math.max(-MAX_SLIDE, Math.min(MAX_SLIDE, prev - top));
        el.animate([{ transform: `translateY(${from}px)` }, { transform: "none" }], {
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
  const { results } = useResults();
  const flipRef = useFlip(results.map((r) => r.charity.id).join());

  return (
    <figure className="rankings" aria-labelledby="rankings-caption">
      <div className="r-axis">
        <div className="r-unit tip-host">
          <span id="rankings-caption">Healthy years per $1,000</span>{"\u00a0"}<InfoTip label="What's a healthy year?">
            One person living one more year in full health, what researchers call a DALY. Preventing a death or an illness adds
            these years; so does lifting a family out of poverty or sparing animals from suffering, converted at exchange rates
            you can change. <a href="/method#healthy-years">More</a>
          </InfoTip>
        </div>
        <div className="r-track" aria-hidden>
          {TICKS.map((t, k) => (
            <span key={t} className={`r-tick num ${k % 2 ? "r-tick-minor" : ""}`} style={{ left: pct(t) }}>{tickLabel(t)}</span>
          ))}
        </div>
        <div />
      </div>

      <ol className="r-list">
        {results.map((r, i) => {
          const c = r.charity;
          const multi = r.evaluators.length > 1;
          const warns = [...new Map(r.evaluators.flatMap((x) => x.flags.filter((f) => f.level === "warn")).map((f) => [f.short, f])).values()];
          const owners = r.evaluators.map((x) => lib.owners.get(x.owner)!);
          const clampedLow = r.low < DOMAIN[0];
          const clampedHigh = r.high > DOMAIN[1];
          const [lo, hi] = barSpan(r.low, r.high, r.central);
          return (
            <li key={c.id} ref={flipRef(c.id)} className="r-row" style={{ ["--cause" as string]: `var(--cause-${c.cause})` }}>
              <div className="r-name tip-host">
                <span className="r-rank num">{i + 1}</span>
                <CharityLogo id={c.id} name={c.name} size={32} lazy={i >= 6} className="r-logo" />
                <div>
                  <a href={`/${c.id}`} className="r-link">{c.name}</a>
                  <div className="r-meta small">
                    <span className="r-cause">{CAUSE_LABEL[c.cause]}</span>
                    <span className="muted"> · {owners.map((o) => o.short).join(", ")}</span>
                    {warns.length > 0 && (
                      <InfoTip
                        className="r-flags"
                        label={`${warns.length} ${warns.length === 1 ? "caveat" : "caveats"} on this estimate`}
                        icon={<AlertTriangle size={13} aria-hidden />}
                      >
                        <p className="r-flag-lead">
                          <strong>Read with care.</strong> The warning sign marks an estimate with{" "}
                          {warns.length === 1 ? "a reason" : "reasons"} to trust it less:
                        </p>
                        <ul className="r-flag-list">
                          {warns.map((f) => <li key={f.short}>{f.text}.</li>)}
                        </ul>
                      </InfoTip>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`r-track ${multi ? "r-track-multi" : ""}`}
                role="img"
                aria-label={`${c.name}: ${r.evaluators.map((x, k) => `${owners[k].name} ${formatYears(x.central)}`).join(", ")} years of healthy life per $1,000; range ${formatYears(r.low)} to ${formatYears(r.high)}`}
              >
                {TICKS.map((t) => (
                  <span key={t} className="r-grid" style={{ left: pct(t) }} />
                ))}
                <span
                  className="r-bar"
                  style={{ clipPath: clipSpan(lo, hi, clampedLow || clampedHigh ? `${clampedLow ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedHigh ? 0 : 4}px ${clampedLow ? 0 : 4}px` : "4px") }}
                />
                {r.evaluators.map((x, k) => (
                  <span key={x.owner} className="r-dot-layer" style={{ transform: `translateX(${pct(x.central)})`, ["--lane" as string]: multi ? `${k % 2 ? LANE : -LANE}px` : undefined }}>
                    <span className={`r-dot ${multi ? "r-dot-owner" : ""} ${multi && x.owner !== r.primary ? "r-dot-other" : ""}`} title={`${owners[k].name}: ${formatYears(x.central)}${BASIS[x.basis](x.programs.length)}`}>
                      {multi && <span className="r-dot-label">{owners[k].short}</span>}
                    </span>
                  </span>
                ))}
              </div>

              <div className="r-value">
                <span className="r-central num">{formatYears(r.central)}</span>
              </div>

            </li>
          );
        })}
      </ol>

      <p className="r-notes small muted">
        <a href="/method">How we compare charities</a>
      </p>
    </figure>
  );
}
