import { lib, modelUrl } from "../lib/data";
import { comparable } from "../engine/model";
import { useResultsFor } from "../lib/use-results";
import { formatYears, plainModelName } from "../lib/format";
import InfoTip, { WithTip } from "./InfoTip";

const month = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "short", timeZone: "UTC" }) : "");

/** A charity's other countries or programs, each with its result, best first; `names` puts a shorter
 * name (the location) in place of a model's own. With `dated`, a
 * charity's models in the given order (by evaluator, newest first), each with its evaluator and date,
 * and a tip on which of them the rankings use. */
export default function VariantList({ ids, current, dated = false, names = {} }: { ids: string[]; current: string; dated?: boolean; names?: Record<string, string> }) {
  const models = ids.map((id) => lib.models.get(id)!);
  const results = useResultsFor(models);
  const rows = dated ? ids.map((id) => results.find((r) => r.model.id === id)!) : results;
  return (
    <>
      <ol className="variant-list">
        {rows.map(({ model, central }) => (
          <li key={model.id} className={model.id === current ? "current" : ""}>
            <a href={modelUrl(lib, model)}>{names[model.id] ?? plainModelName(model.name)}</a>
            {dated && <span className="muted small">{lib.owners.get(model.owner)?.short} · {month(model.source?.published)}</span>}
            <span className="num">{comparable(lib, model) ? formatYears(central) : "not ranked"}</span>
          </li>
        ))}
      </ol>
      {dated && (
        <div className="variant-note muted small">
          <WithTip text="Which of these rank">
            <InfoTip label="Which models the rankings use">
              The rankings use each evaluator's newest model of each program. Where a charity runs several programs or works in several places, they are weighted by how much GiveWell funds each.
            </InfoTip>
          </WithTip>
        </div>
      )}
    </>
  );
}
