import { lib, modelUrl } from "../lib/data";
import { useResults } from "../lib/use-results";
import { formatYears, plainModelName } from "../lib/format";

const pct = (x: number) => `${x >= 0.995 ? 100 : x < 0.01 ? (x * 100).toPrecision(1) : Math.round(x * 100)}%`;

/** The charity as a whole, on its main page, when its figure combines several programs: the total at
 * the top and each program's model as a part, with its share of the spending and what it adds to the
 * total (the funding-weighted mean of src/engine/ranking.ts: combine, so the parts add up to it). The
 * model shown below the section is the main one; the others link to their own pages. */
export default function WholeCharity({ id }: { id: string }) {
  const model = lib.models.get(id)!;
  const { results } = useResults();
  const ev = results.find((r) => r.charity.id === model.charity)?.evaluators.find((e) => e.owner === model.owner);
  if (!ev || ev.programs.length < 2) return null;
  const charity = lib.charities.get(model.charity)!;
  const weighted = ev.basis === "weighted";
  const total = ev.programs.reduce((s, p) => s + (p.weight ?? 0), 0);
  const by = ev.owner === "charityevals" ? "the charity's spending" : `${lib.owners.get(ev.owner)?.name ?? "the evaluator"}'s funding`;
  const rows = ev.programs
    .map((p) => {
      const share = weighted ? (p.weight ?? 0) / total : undefined;
      return {
        p,
        label: charity.programs?.find((x) => x.id === p.program)?.label ?? plainModelName(p.result.model.name),
        share,
        adds: share !== undefined ? share * p.central : undefined,
      };
    })
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0) || b.p.central - a.p.central);

  return (
    <section className="whole" aria-labelledby="whole-title">
      <h2 id="whole-title" className="whole-title">The whole charity</h2>
      <p className="whole-lede">
        {weighted
          ? <>The figure above is the charity as a whole: each programme's own model, weighted by its share of {by}. Each part's figure moves with your values like the total.</>
          : <>The figure above is the median of the charity's programmes: not every programme has a share of the funding to weigh it by.</>}
      </p>
      <table className="whole-table">
        <thead>
          <tr>
            <th scope="col">Programme</th>
            {weighted && <th scope="col" className="num">Share of spending</th>}
            <th scope="col" className="num">Years of healthy life per $1,000</th>
            {weighted && <th scope="col" className="num">Adds to the total</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ p, label, share, adds }) => {
            const here = p.result.model.id === model.id;
            return (
              <tr key={p.program} className={here ? "here" : undefined}>
                <th scope="row">
                  {here ? <span>{label} <span className="muted small">(its model is below)</span></span> : <a href={modelUrl(lib, p.result.model)}>{label}</a>}
                </th>
                {weighted && <td className="num">{pct(share!)}</td>}
                <td className="num">{formatYears(p.central)}</td>
                {weighted && <td className="num">{formatYears(adds!)}{ev.central > 0 && <span className="muted small"> ({pct(adds! / ev.central)})</span>}</td>}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">The whole charity</th>
            {weighted && <td className="num">100%</td>}
            <td className="num">{formatYears(ev.central)}</td>
            {weighted && <td />}
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
