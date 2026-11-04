import type React from "react";
import { useMemo, useState } from "react";
import { bulkRaw, lib, modelUrl, rawFacts } from "../lib/data";
import { buildLibrary, headline, type ResolvedModel } from "../engine/model";
import { combine, declaredLocations, locationWeights, locationsOf } from "../engine/ranking";
import { clearEdits, editsFor, readEdits, setPageModels, useEdits } from "../lib/edit-state";
import { useAssumptionValues, useResults } from "../lib/use-results";
import { formatYears, plainModelName } from "../lib/format";
import ModelView from "./ModelView";
import { WaterfallInSlot } from "./Waterfall";

const pct = (x: number) => `${x >= 0.995 ? 100 : x < 0.01 ? (x * 100).toPrecision(1) : Math.round(x * 100)}%`;

/** A charity whose figure combines several programs, as one tree: the whole charity at the top (the
 * funding-weighted mean of src/engine/ranking.ts: combine, so the parts add up to it), each program's
 * model a branch that opens into that model's own tree. One branch is open at a time (each tree has
 * its own search and anchors); the main model's first. A bulk import's full file is fetched when its
 * branch opens, as its own page does (lib/model-directive.ts); the page hydrates this island with
 * client:model when the main model is one. `children`: the evaluation's write-up. */
export default function WholeCharity({ id, children }: { id: string; children?: React.ReactNode }) {
  const model = lib.models.get(id)!;
  const { results } = useResults();
  const [open, setOpen] = useState<string | undefined>(id);
  const [loading, setLoading] = useState<string | undefined>();
  const toggle = async (mid: string) => {
    if (open === mid) return setOpen(undefined);
    // An edit belongs to the programme it was made in: switching programmes starts from its own numbers
    // (two programmes can share a row id, and one's edit must not carry over to the other).
    if (open && Object.keys(readEdits()).length) clearEdits();
    if (lib.models.get(mid)?.bulk && !bulkRaw(mid)) {
      setLoading(mid);
      try {
        const r = await fetch(`/models/${mid}.json`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        (globalThis.__charityevalsModels ??= {})[mid] = await r.json();
      } catch (e) {
        console.warn(`charityevals: model ${mid} not loaded`, e);
        return setLoading(undefined);
      }
      setLoading(undefined);
    }
    setOpen(mid);
  };
  const evAll = results.find((r) => r.charity.id === model.charity)?.evaluators.find((e) => e.owner === model.owner);
  // The rankings ignore page edits; here the open programme's figure follows them, and the whole
  // charity is recombined from the parts shown (the rankings themselves don't move).
  const av = useAssumptionValues();
  const urlEdits = useEdits();
  const ev = useMemo(() => {
    if (!evAll || !open || !Object.keys(urlEdits).length) return evAll;
    const part = evAll.programs.find((p) => p.result.model.id === open);
    if (!part) return evAll;
    const raw = part.result.model.bulk ? bulkRaw(open) : undefined;
    const full: ResolvedModel | undefined = raw
      ? buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models }).models.get(open)
      : part.result.model.bulk ? undefined : part.result.model;
    if (!full) return evAll;
    const edits = editsFor(full, urlEdits, lib);
    if (!Object.keys(edits).length) return evAll;
    // A program of several locations moves by its edited model's own change.
    const r = headline(lib, full, av, edits) / headline(lib, full, av);
    if (!Number.isFinite(r)) return evAll;
    const programs = evAll.programs.map((p) => (p === part ? { ...p, central: p.central * r } : p));
    const w = programs.reduce((s, p) => s + (p.weight ?? 0), 0);
    const central = evAll.basis === "weighted" && w > 0 ? programs.reduce((s, p) => s + (p.weight ?? 0) * p.central, 0) / w : evAll.central;
    return { ...evAll, programs, central };
  }, [evAll, open, urlEdits, av]);
  // Every programme on the page keeps its own edits in the URL (edit-state: setPageModels); set while
  // rendering, as the headline's island may filter the edits before this one's effects run.
  if (ev && ev.programs.length > 1) setPageModels(ev.programs.map((p) => p.result.model), lib);
  if (!ev || ev.programs.length < 2) return <ModelView id={id} bulk={!!model.bulk}>{children}</ModelView>;
  const charity = lib.charities.get(model.charity)!;
  const mainRaw = model.bulk ? bulkRaw(id) : undefined;
  const mainModel: ResolvedModel | undefined = model.bulk
    ? mainRaw ? buildLibrary([mainRaw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models }).models.get(id) : undefined
    : model;
  const weighted = ev.basis === "weighted";
  const total = ev.programs.reduce((s, p) => s + (p.weight ?? 0), 0);
  const by = ev.owner === "charityevals" ? "the charity's spending" : `${lib.owners.get(ev.owner)?.name ?? "the evaluator"}'s funding`;
  const rows = ev.programs
    .map((p) => {
      const share = weighted ? (p.weight ?? 0) / total : undefined;
      return { p, label: charity.programs?.find((x) => x.id === p.program)?.label ?? plainModelName(p.result.model.name), share };
    })
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0) || b.p.central - a.p.central);

  return (
    <div className="whole" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <div className="whole-root">
        <span className="whole-root-label">Years of healthy life per $1,000, the whole charity</span>
        <span className="whole-root-value num">{formatYears(ev.central)}</span>
      </div>
      <p className="whole-lede small">
        {weighted
          ? <>Each programme's own model, weighted by its share of {by}. Open one to see its whole model.</>
          : <>The median of the charity's programmes: not every programme has a share of the funding to weigh it by.</>}
      </p>
      <ul className="whole-parts">
        {rows.map(({ p, label, share }) => {
          const mid = p.result.model.id;
          const here = open === mid;
          const adds = share !== undefined ? share * p.central : undefined;
          return (
            <li key={p.program} className={here ? "open" : undefined}>
              <button type="button" className="whole-part" aria-expanded={here} onClick={() => toggle(mid)} aria-busy={loading === mid}>
                <span className="whole-chev" aria-hidden>{here ? "▾" : "▸"}</span>
                <span className="whole-part-label">{label}</span>
                <span className="whole-part-math num">
                  {share !== undefined && <>{pct(share)} × </>}
                  {formatYears(p.central)}
                  {adds !== undefined && <> = <strong>{formatYears(adds)}</strong>{ev.central > 0 && <span className="muted"> ({pct(adds / ev.central)} of the total)</span>}</>}
                </span>
              </button>
              {here && (
                <div className="whole-model">
                  <ModelView
                    id={mid}
                    bulk={!!p.result.model.bulk}
                    about={
                      <p>
                        <strong>{plainModelName(p.result.model.name)}</strong> by <a href={`/evaluators/${p.result.model.owner}`}>{lib.owners.get(p.result.model.owner)?.name ?? p.result.model.owner}</a>
                        {p.result.model.source?.published && <>, {new Date(p.result.model.source.published).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</>}.{" "}
                        {modelUrl(lib, p.result.model) !== `/${charity.id}` && <><a href={modelUrl(lib, p.result.model)}>Its own page</a>, with the model file and history.</>}
                      </p>
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {children}
      {/* The main model's waterfall fills the evaluation section; its own branch does it while open. */}
      {open !== id && mainModel && <WaterfallInSlot model={mainModel} av={av} edits={{}} />}
    </div>
  );
}

/** A programme's funded locations, each with its share of the funding and its own figure, the way the
 * rankings weigh them (use-results.ts: programResult). */
function locationParts(m: ResolvedModel, av: Record<string, number>): { label: string; share?: number; central: number }[] | undefined {
  const family = locationsOf(lib, m);
  const figure = (x: ResolvedModel) => headline(lib, x, av);
  const declared = declaredLocations(lib.charities.get(m.charity), family);
  const named = (x: ResolvedModel) => x.name.replace(lib.charities.get(m.charity)?.name ?? "", "").trim().replace(/^\((.*)\)$/, "$1") || x.name;
  const parts = declared
    ? declared.map((d) => ({ label: d.label, weight: d.weight, central: combine(d.models.map((x) => { const v = figure(x); return { central: v, low: v, high: v }; })).central }))
    : (() => {
        const ws = locationWeights(lib, family);
        return ws ? family.map((x, i) => ({ label: named(x), weight: ws[i], central: figure(x) })) : undefined;
      })();
  if (!parts) return undefined;
  const total = parts.reduce((t, x) => t + x.weight, 0);
  return parts
    .filter((x) => x.weight > 0)
    .map((x) => ({ label: x.label, share: total > 0 ? x.weight / total : undefined, central: x.central }))
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0));
}

/** On the main page of a charity whose one programme is funded in several locations: the
 * funding-weighted figure the rankings show for the whole charity, and each location's share and
 * figure, above the model of the location the page is about. */
export function Locations({ id }: { id: string }) {
  const model = lib.models.get(id)!;
  const { results } = useResults();
  const av = useAssumptionValues();
  const ev = results.find((r) => r.charity.id === model.charity)?.evaluators.find((e) => e.owner === model.owner);
  const p = ev?.programs.length === 1 ? ev.programs[0] : undefined;
  const locations = useMemo(() => (p?.locationBasis === "weighted" ? locationParts(p.result.model, av) : undefined), [p, av]);
  if (!ev || !locations) return null;
  return (
    <div className="whole whole-locations" style={{ ["--cause" as string]: `var(--cause-${model.cause})` }}>
      <div className="whole-root">
        <span className="whole-root-label">Years of healthy life per $1,000, the whole charity</span>
        <span className="whole-root-value num">{formatYears(ev.central)}</span>
      </div>
      <ul className="whole-parts">
        {locations.map((l) => (
          <li key={l.label}>
            <div className="whole-part">
              <span className="whole-part-label">{l.label}</span>
              <span className="whole-part-math num">
                {l.share !== undefined && <>{pct(l.share)} × </>}
                {formatYears(l.central)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
