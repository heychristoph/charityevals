import { useEffect, useMemo } from "react";
import { lib, rawFacts, bulkRaw } from "../lib/data";
import { buildLibrary, comparable, headline, type ResolvedModel } from "../engine/model";
import { combine, declaredLocations, locationsOf } from "../engine/ranking";
import { sensitivity } from "../engine/sensitivity";
import { useAssumptionValues, useResults, type EvaluatorResult } from "../lib/use-results";
import { editsFor, useEdits } from "../lib/edit-state";
import { formatYears } from "../lib/format";
import InfoTip, { WithTip } from "./InfoTip";

const built = new Map<string, ResolvedModel>();
/** A bulk model in full (its page loads the file before hydrating); any other model as the library has it. */
function modelOf(id: string, bulk: boolean): ResolvedModel {
  if (!bulk) return lib.models.get(id)!;
  const raw = bulkRaw(id);
  if (!raw) return lib.models.get(id)!;
  let m = built.get(id);
  if (!m) built.set(id, (m = buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()]).models.get(id)!));
  return m;
}

const rangeNote = (low: number, high: number) => (
  <p>
    Plausible range <span className="num">{formatYears(low)} to {formatYears(high)}</span>: every uncertain input at
    the end that lowers the result, then at the end that raises it. Deliberately wide.
  </p>
);

/** The plausible range, computed only when the tip is opened: it varies every input in turn. */
function Range({ model, av, edits }: { model: ResolvedModel; av: Record<string, number>; edits: Record<string, number> }) {
  const s = useMemo(() => sensitivity(lib, model, av, "charityevals", edits), [model, av, edits]);
  return rangeNote(s.jointLow, s.jointHigh);
}

type Part = { label: string; central: number; share?: number };
/** How an evaluator's figure is made: its parts (funded locations or programs), and the words for it. */
type Combined = { ev: EvaluatorResult; parts: Part[]; what: string; qualifier: string };

const point = (v: number) => ({ central: v, low: v, high: v });
const placeName = (m: ResolvedModel, charity: string) => m.name.replace(charity, "").trim().replace(/^\((.*)\)$/, "$1") || m.name;
const share = (s: number) => (s < 0.005 ? "<1%" : `${Math.round(s * 100)}%`);

/** The evaluator's figure as the rankings combine it (src/engine/ranking.ts, via useResults), when it is
 * more than this one model's own figure: several locations by funding, or several programs. */
function combinedOf(ev: EvaluatorResult | undefined, model: ResolvedModel, av: Record<string, number>): Combined | undefined {
  if (!ev) return undefined;
  const funder = `${lib.owners.get(ev.owner)?.name ?? "the evaluator"}'s funding`;
  const charity = lib.charities.get(model.charity)!;
  if (ev.programs.length > 1) {
    const total = ev.programs.reduce((s, p) => s + (p.weight ?? 0), 0);
    const parts = ev.programs
      .filter((p) => ev.basis !== "weighted" || p.weight! > 0)
      .map((p) => ({
        label: charity.programs?.find((x) => x.id === p.program)?.label ?? p.program,
        central: p.central,
        share: ev.basis === "weighted" ? p.weight! / total : undefined,
      }));
    const n = `${parts.length} programs`;
    return { ev, parts, what: "program", qualifier: ev.basis === "weighted" ? `weighted by ${funder} across ${n}` : `the median of ${n}` };
  }
  const [p] = ev.programs;
  if (p.locationBasis !== "weighted") return undefined;
  const family = locationsOf(lib, p.result.model);
  const declared = declaredLocations(charity, family);
  const headlineOf = (m: ResolvedModel) => point(headline(lib, m, av));
  let parts: Part[];
  let by = funder;
  if (declared) {
    const total = declared.reduce((s, d) => s + d.weight, 0);
    parts = declared.filter((d) => d.weight > 0).map((d) => ({ label: d.label, central: combine(d.models.map(headlineOf)).central, share: d.weight / total }));
  } else {
    // The sheet's own grant sizes per location (ranking.ts: locationWeights): every location counts.
    by = "grant size";
    parts = family.map((m) => ({ label: placeName(m, charity.name), central: headline(lib, m, av) }));
  }
  return { ev, parts, what: "location", qualifier: `weighted by ${by} across ${parts.length} locations` };
}

function Breakdown({ parts, what }: { parts: Part[]; what: string }) {
  const rows = [...parts].sort((a, b) => (b.share ?? 0) - (a.share ?? 0) || b.central - a.central);
  return (
    <>
      <p>Each {what}{rows.some((r) => r.share !== undefined) ? ", its share of the funding," : ""} and its figure:</p>
      <table className="m-parts">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.share !== undefined && <td className="num">{share(r.share)}</td>}
              <td className="num">{formatYears(r.central)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** The result under the page title: "24 years of healthy life per $1,000", on the reader's values and
 * edits, with its range in a tip. On a charity's main page (`main`), the evaluator's figure exactly as
 * the rankings show it, where that combines several funded locations or programs; their breakdown is
 * in the tip. It also keeps any figure a write-up quotes (<span data-figure="headline"
 * data-model="id">) in step with the model's own numbers. */
export default function Headline({ id, bulk = false, place, main = false }: { id: string; bulk?: boolean; place?: string; main?: boolean }) {
  const model = useMemo(() => modelOf(id, bulk), [id, bulk]);
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const edits = useMemo(() => editsFor(model, urlEdits), [model, urlEdits]);
  const value = useMemo(() => headline(lib, model, av, edits), [model, av, edits]);
  const years = comparable(lib, model);
  const { results } = useResults();
  const ev = main ? results.find((r) => r.charity.id === model.charity)?.evaluators.find((e) => e.owner === model.owner) : undefined;
  const combined = useMemo(() => combinedOf(ev, model, av), [ev, model, av]);

  useEffect(() => {
    for (const el of document.querySelectorAll<HTMLElement>("[data-figure=headline]")) {
      const m = lib.models.get(el.dataset.model ?? id);
      if (!m) continue;
      const v = m.id === model.id ? value : headline(lib, m, av);
      if (Number.isFinite(v)) el.textContent = formatYears(v);
    }
  }, [value, av, id, model.id]);

  const figure = combined ? combined.ev.central : value;
  if (!Number.isFinite(figure)) return null;
  const unit = years ? "years of healthy life per $1,000" : `${lib.assumptions.units[model.output!.unit]?.label ?? "per dollar"} per dollar`;
  const text = combined ? `${unit}, ${combined.qualifier}` : place ? `${unit}, ${place}` : unit;
  return (
    <div className="m-headline tip-host">
      <span className="m-figure num">{formatYears(figure)}</span>{" "}
      <span className="m-unit">
        <WithTip text={text}>
          <InfoTip label={combined ? "How this figure is made" : "How sure is this"}>
            {combined ? (
              <>
                {rangeNote(combined.ev.low, combined.ev.high)}
                <Breakdown parts={combined.parts} what={combined.what} />
              </>
            ) : (
              <Range model={model} av={av} edits={edits} />
            )}
            {!years && <p>This unit has no exchange rate yet, so it isn't in the rankings.</p>}
          </InfoTip>
        </WithTip>
      </span>
    </div>
  );
}
