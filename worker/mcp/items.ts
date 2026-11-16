// The pieces of the MCP answers: a model's or a charity's figure as JSON, from the catalogue and a set of
// figures, whether the build stored them or the worker computed them. One builder for both, so a stored
// answer is the computed one.
import type { Licence } from "../../src/lib/licence";
import { val, YEARS, type Catalogue, type CharityFig, type Figures } from "./catalogue";
import { ToolError, type Values } from "./values";

export const SITE = "https://charityevals.org";
export type Json = Record<string, unknown>;

/** Three significant figures: the models aren't more precise than that. */
export const r3 = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(3)) : null);
export const short = (s: string | undefined, n = 600) => (s && s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
export const abs = (path: string) => `${SITE}${path}`;
export const licence = (l: Licence) => ({ name: l.name, ...(l.url ? { url: l.url } : {}), attribution: l.attribution });
export const ownerName = (cat: Catalogue, id: string) => cat.owners[id] ?? id;

type Numbers = { central: number | null; low: number | null; high: number | null };
export const figure = (f: Numbers) => {
  const c = val(f.central), l = val(f.low), h = val(f.high);
  return { result: r3(c), low: r3(Math.min(l, h)), high: r3(Math.max(l, h)) };
};

/** A model's page: the charity's page for its main model, else /<charity>/<model> (src/lib/data.ts modelUrl). */
export function modelPath(cat: Catalogue, id: string): string {
  const m = cat.models[id];
  return m.main ? `/${m.charity}` : `/${m.charity}/${id}`;
}

export const modelLicence = (cat: Catalogue, id: string) => cat.licences[cat.models[id].licence];
/** A charity figure's licence: its primary evaluator's first programme's model's. */
export const charityLicence = (cat: Catalogue, f: CharityFig) => modelLicence(cat, f.evaluators.find((e) => e.owner === f.primary)!.programmes[0].model);

/** The licences an answer's figures carry, once each. */
export function licences(items: Licence[]) {
  const seen = new Map<string, Licence>();
  for (const l of items) seen.set(`${l.name}|${l.attribution}`, l);
  return [...seen.values()].map(licence);
}

export function unknownId(cat: Catalogue, id: string): ToolError {
  const q = id.toLowerCase();
  const near = Object.entries(cat.charities).filter(([cid, c]) => cid.includes(q) || q.includes(cid) || c.name.toLowerCase().includes(q)).slice(0, 5).map(([cid]) => cid);
  return new ToolError(`No charity or model "${id}".${near.length ? ` Did you mean: ${near.join(", ")}?` : ""} search_charities finds ids.`);
}

/** One model's figure at the reader's values. */
export function modelItem(cat: Catalogue, id: string, figs: Figures, v: Values): Json {
  const m = cat.models[id];
  return {
    type: "model",
    id,
    name: m.name,
    charity: { id: m.charity, name: cat.charities[m.charity]?.name ?? m.charity },
    evaluator: ownerName(cat, m.owner),
    ...figure(figs.model(id) ?? { central: NaN, low: NaN, high: NaN }),
    unit: m.unit,
    url: abs(modelPath(cat, id) + v.query),
    licence: modelLicence(cat, id).name,
  };
}

/** One charity's figure at the reader's values, as the rankings make it. */
export function charityItem(cat: Catalogue, id: string, f: CharityFig, v: Values): Json {
  const c = cat.charities[id];
  const lead = f.evaluators.find((e) => e.owner === f.primary)!;
  const parts = lead.programmes;
  return {
    type: "charity",
    id,
    name: c.name,
    cause: c.cause,
    evaluator: ownerName(cat, f.primary),
    ...figure(f),
    unit: YEARS,
    on_rankings: f.ranked,
    // The models behind the figure, where it combines more than one.
    ...(parts.length > 1 || parts[0].locations > 1
      ? { combines: { how: lead.basis === "weighted" ? "funding-weighted" : lead.basis, programmes: parts.map((p) => ({ programme: p.programme || undefined, model: p.model, ...figure(p), ...(p.locations > 1 ? { locations: p.locations } : {}) })) } }
      : { model: parts[0].model }),
    ...(f.evaluators.length > 1 ? { other_evaluators: f.evaluators.filter((e) => e !== lead).map((e) => ({ evaluator: ownerName(cat, e.owner), ...figure(e) })) } : {}),
    url: abs(`/${id}${v.query}`),
    licence: charityLicence(cat, f).name,
  };
}

/** An id as a figure: `prefer` says which reading wins where an id is both a model's and a charity's. A
 * charity without a figure in healthy years reads as its main model. */
export function item(cat: Catalogue, id: string, figs: Figures, v: Values, prefer: "model" | "charity"): { json: Json; licence: Licence } {
  const isModel = id in cat.models;
  const c = cat.charities[id];
  if (c && (prefer === "charity" || !isModel)) {
    const f = figs.charity(id);
    if (f) return { json: charityItem(cat, id, f, v), licence: charityLicence(cat, f) };
    return { json: modelItem(cat, c.main, figs, v), licence: modelLicence(cat, c.main) };
  }
  if (isModel) return { json: modelItem(cat, id, figs, v), licence: modelLicence(cat, id) };
  throw unknownId(cat, id);
}
