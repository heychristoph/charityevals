import { useResults } from "../lib/use-results";
import { lib } from "../lib/data";
import { useFigure } from "../lib/metric";

/** On narrow screens the panel stacks below the chart, so this pins a one-line-per-charity
 * ranking to the top of the panel: the visitor sees the order change while dragging. */
export default function MiniRanking() {
  const { results, av } = useResults();
  const fig = useFigure(lib, av);
  return (
    <ol className="mini-ranking small" aria-label="Current ranking">
      {results.map((r, i) => (
        <li key={r.charity.id} style={{ ["--cause" as string]: `var(--cause-${r.charity.cause})` }}>
          <span className="num muted">{i + 1}</span>
          <span className="mini-name">{r.charity.name}</span>
          <span className="num mini-value">{fig.format(r.central)}</span>
        </li>
      ))}
    </ol>
  );
}
