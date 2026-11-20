import { lib } from "../lib/data";
import { useResults } from "../lib/use-results";
import { ZONE, clipSpan, pctStr, xFor } from "./scale";
import { barSpan } from "./Rankings";
import CharityLogo from "./CharityLogo";
import "./rankings.css";
import "./similar.css";

type Item = { id: string; name: string; summary?: string; url: string };

/** "Similar charities" on a charity's page: a tile each, with its figure and range as the rankings show
 * them, at the reader's values. */
export default function SimilarCharities({ items }: { items: Item[] }) {
  const { results } = useResults();
  const byId = new Map(results.map((r) => [r.charity.id, r]));
  return (
    <ul className="sim-list">
      {items.map((s) => {
        const r = byId.get(s.id);
        const cause = lib.charities.get(s.id)?.cause;
        const span = r && barSpan(r.low, r.high, r.central, r.barLow);
        return (
          <li key={s.id} style={cause ? { ["--cause" as string]: `var(--cause-${cause})` } : undefined}>
            <a href={s.url} className="sim-tile" data-track-kind="similar">
              <span className="sim-head"><CharityLogo id={s.id} name={s.name} size={36} /><strong>{s.name}</strong></span>
              {s.summary && <span className="sim-sub">{s.summary}</span>}
              {/* The bar alone: where it sits on the rankings' scale, without numbers to set side by side. */}
              {r && (
                <span className="sim-fig">
                  <span className="r-track sim-track" role="img" aria-label="Where it sits on the rankings, with its range">
                    {/* A range reaching zero or harm: a stub across the scale's ≤0 zone, as on the rankings. */}
                    {Math.min(r.low, r.high) <= 0 && <span className="r-bar" style={{ clipPath: clipSpan(0, ZONE, "4px") }} />}
                    {span && <span className="r-bar" style={{ clipPath: clipSpan(span[0], span[1], "4px") }} />}
                    <span className="r-dot-layer" style={{ transform: `translateX(${pctStr(xFor(r.central, 100))})` }}><span className="r-dot" /></span>
                  </span>
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
