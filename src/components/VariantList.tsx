import { lib, modelUrl } from "../lib/data";
import { useResultsFor } from "../lib/use-results";
import { formatMultiple } from "../lib/format";

/** A charity's other countries or programs, each with its result, best first. */
export default function VariantList({ ids, current }: { ids: string[]; current: string }) {
  const models = ids.map((id) => lib.models.get(id)!);
  const rows = useResultsFor(models);
  return (
    <ol className="variant-list">
      {rows.map(({ model, central }) => (
        <li key={model.id} className={model.id === current ? "current" : ""}>
          <a href={modelUrl(lib, model)}>{model.name}</a>
          <span className="num">{formatMultiple(central)}</span>
        </li>
      ))}
    </ol>
  );
}
