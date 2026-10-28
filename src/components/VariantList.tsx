import { lib, modelUrl } from "../lib/data";
import { comparable } from "../engine/model";
import { useResultsFor } from "../lib/use-results";
import { formatMultiple } from "../lib/format";

const month = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "short", timeZone: "UTC" }) : "");

/** A charity's other countries or programs, each with its result, best first. With `dated`, a
 * charity's models in the given order (by evaluator, newest first), each with its evaluator and date. */
export default function VariantList({ ids, current, dated = false }: { ids: string[]; current: string; dated?: boolean }) {
  const models = ids.map((id) => lib.models.get(id)!);
  const results = useResultsFor(models);
  const rows = dated ? ids.map((id) => results.find((r) => r.model.id === id)!) : results;
  return (
    <ol className="variant-list">
      {rows.map(({ model, central }) => (
        <li key={model.id} className={model.id === current ? "current" : ""}>
          <a href={modelUrl(lib, model)}>{model.name}</a>
          {dated && <span className="muted small">{lib.owners.get(model.owner)?.short} · {month(model.source?.published)}</span>}
          <span className="num">{comparable(lib, model) ? formatMultiple(central) : "not ranked"}</span>
        </li>
      ))}
    </ol>
  );
}
