// The site's data as files (/data/*) and plain text (/llms-full.txt), for other tools and for language
// models. Built from the same library as the pages, so every figure here is the page's own: the headline
// at the default assumptions and the plausible range the page shows. Published models only (lib already
// leaves out the evaluators who asked us not to publish, owners.json `published: false`).
import { lib, modelUrl, primaryOf, rankable, rawFacts } from "./data";
import { assumptionValues, comparable, headline, plausibleRange, compute, type ResolvedModel } from "../engine/model";
import { sensitivity, type Swing } from "../engine/sensitivity";
import { modelRange } from "../engine/figures";
import { licenceOf, OWN_LICENCE } from "./licence";
import { abs } from "./seo";
import { formatYears, plainModelName } from "./format";
import rawAssumptions from "../../assumptions/default.json";
import rawOwners from "../../owners.json";
import bulkSummaries from "../../generated/bulk-summaries.json";
import distributions from "../../generated/distributions.json";

const modelFiles = import.meta.glob<{ default: { id: string } }>(["../../models/**/*.json", "!../../models/grants/**"], { eager: true });
const charityFiles = import.meta.glob<{ default: { id: string } }>("../../charities/*.json", { eager: true });

export const HEALTHY_YEARS = "years of healthy life per $1,000";

export const dataUrl = (id: string) => `/data/models/${id}.json`;

/** What a model's headline is counted in: healthy years per $1,000, or its own unit per dollar. */
export function unitOf(m: ResolvedModel): string {
  return comparable(lib, m) ? HEALTHY_YEARS : `${lib.assumptions.units[m.output!.unit]?.label ?? m.output!.unit} per dollar`;
}

export type Figure = { headline: number; low: number; high: number; drivers: Swing[] };

const figures = new Map<string, Figure>();
/** A model's figure as its page shows it at the default assumptions: the headline, its range
 * (src/engine/figures.ts modelRange) and what drives it most. */
export function figureOf(m: ResolvedModel): Figure {
  let f = figures.get(m.id);
  if (!f) {
    const av = assumptionValues(lib.assumptions);
    const s = sensitivity(lib, m, av);
    const range = modelRange(lib, m, s.central, av);
    figures.set(m.id, (f = { headline: s.central, low: range.low, high: range.high, drivers: s.swings.slice(0, 5) }));
  }
  return f;
}

/** A number for the files: finite to 6 significant figures, else null. */
const num = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(6)) : null);

/** Charities with at least one published model. */
export const publishedCharities = () => [...lib.charities.values()].filter((c) => primaryOf(lib, c.id)).sort((a, b) => a.name.localeCompare(b.name));

export function charitiesJson() {
  return {
    licence: OWN_LICENCE,
    charities: publishedCharities().map((c) => ({
      id: c.id,
      name: c.name,
      cause: c.cause,
      ...(c.area && { area: c.area }),
      ...(c.website && { website: c.website }),
      ...(c.donate && { donate: c.donate }),
      ...(c.summary && { summary: c.summary }),
      page: abs(`/${c.id}`),
      primary_model: primaryOf(lib, c.id)!.id,
      models: rankable.filter((m) => m.charity === c.id).map((m) => m.id),
    })),
  };
}

function indexEntry(m: ResolvedModel) {
  const f = figureOf(m);
  return {
    id: m.id,
    name: plainModelName(m.name),
    charity: m.charity,
    owner: m.owner,
    cause: m.cause,
    primary: primaryOf(lib, m.charity)?.id === m.id,
    unit: unitOf(m),
    headline: num(f.headline),
    low: num(f.low),
    high: num(f.high),
    licence: licenceOf(m),
    page: abs(modelUrl(lib, m)),
    json: abs(dataUrl(m.id)),
  };
}

export function modelsJson() {
  return { models: rankable.map(indexEntry) };
}

export function modelJson(m: ResolvedModel) {
  const f = figureOf(m);
  const values = compute(lib, m, assumptionValues(lib.assumptions));
  const owner = lib.owners.get(m.owner)!;
  return {
    ...indexEntry(m),
    charity_name: lib.charities.get(m.charity)?.name,
    owner_name: owner.name,
    ...(owner.permission && { permission: owner.permission }),
    kind: m.kind,
    ...(m.extends && { extends: m.extends }),
    ...(m.summary && { summary: m.summary }),
    ...(m.theoretical && { theoretical: m.theoretical }),
    ...(m.source && { source: m.source }),
    ...(m.estimate_basis && { estimate_basis: m.estimate_basis }),
    output: m.output,
    drivers: f.drivers.map((s) => ({ id: s.id, label: s.label, scope: s.scope, low: s.low, high: s.high, at_low: num(s.atLow), at_high: num(s.atHigh) })),
    sections: m.sections,
    rows: m.rows.map(({ node: _n, deps: _d, assumptionDeps: _a, factDeps: _f, modelDeps: _m, livesAdded: _l, livesFacts: _lf, inheritedFrom: _i, overridden: _o, expected: _e, ...r }) => ({ ...r, computed: num(values[r.id]) })),
    resources: m.resources,
  };
}

export function assumptionsJson() {
  return { licence: OWN_LICENCE, ...rawAssumptions };
}

export function factsJson() {
  return { licence: OWN_LICENCE, facts: [...lib.facts.values()] };
}

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function resultsCsv(): string {
  const head = ["id", "name", "charity", "charity_name", "owner", "cause", "primary", "unit", "headline", "low", "high", "licence", "page", "json"];
  const lines = rankable.map((m) => {
    const e = indexEntry(m);
    return [e.id, e.name, e.charity, lib.charities.get(m.charity)?.name, e.owner, e.cause, e.primary, e.unit, e.headline, e.low, e.high, e.licence.name, e.page, e.json].map(csvCell).join(",");
  });
  return [head.join(","), ...lines].join("\n") + "\n";
}

/** The inputs of buildLibrary, in its order, for rebuilding the site's library elsewhere (the MCP
 * server): `buildLibrary(...Object.values(file))`. Published models only; bulk imports as the browser
 * gets them (generated/bulk-summaries.json: the same results, in a fraction of the size); the last entry
 * is buildLibrary's options, carrying the simulations the headlines' risk step and the ranges read.
 * Model text still holds its `{{placeholders}}`: renderLibraryProse fills them. */
export function libraryJson() {
  const keep = (x: { id: string }) => lib.models.has(x.id);
  const owners = (rawOwners as { id: string; published?: boolean }[]).filter((o) => o.published !== false);
  const used = new Set([...lib.models.values()].map((m) => m.charity));
  return {
    models: [...Object.values(modelFiles).map((f) => f.default), ...(bulkSummaries as { id: string }[])].filter(keep),
    assumptions: rawAssumptions,
    facts: rawFacts,
    charities: Object.values(charityFiles).map((f) => f.default).filter((c) => used.has(c.id)),
    owners,
    options: { distributions: Object.fromEntries(Object.entries(distributions).filter(([id]) => lib.models.has(id))) },
  };
}

/** A figure in the model's unit, for reading. */
const show = (m: ResolvedModel, x: number) => (comparable(lib, m) ? formatYears(x) : Number.isFinite(x) ? String(Number(x.toPrecision(2))) : "—");

/** `seen`: the source URLs already listed under the charity's earlier models, listed once. */
function modelText(m: ResolvedModel, seen: Set<string>): string {
  const f = figureOf(m);
  const owner = lib.owners.get(m.owner)!;
  const out = [`### ${plainModelName(m.name)}`, "", `By ${owner.name}. ${abs(modelUrl(lib, m))} (data: ${abs(dataUrl(m.id))})`];
  if (m.theoretical) out.push("Purely theoretical: an estimate of the idea from before the charity existed.");
  out.push(`Result: ${show(m, f.headline)} ${unitOf(m)} (plausible range ${show(m, f.low)} to ${show(m, f.high)}), default assumptions.`);
  if (m.summary) out.push("", m.summary.trim());
  if (f.drivers.length) {
    out.push("", "Top drivers (each input alone from its low to its high end):");
    for (const s of f.drivers) out.push(`- ${s.label}: ${show(m, s.atLow)} to ${show(m, s.atHigh)}`);
  }
  const sources = [
    ...(m.source ? [{ title: m.source.title.startsWith(m.source.publisher) ? m.source.title : `${m.source.publisher}, ${m.source.title}`, url: m.source.url }] : []),
    ...m.resources,
  ].filter((r) => !seen.has(r.url) && seen.add(r.url));
  if (sources.length) out.push("", "Sources:", ...sources.map((r) => `- ${r.title === r.url ? r.url : `${r.title}: ${r.url}`}`));
  out.push("", `Licence: ${licenceOf(m).name}.`);
  return out.join("\n");
}

const CAUSES = [["global-health", "Global health"], ["animal-welfare", "Animal welfare"], ["catastrophic-risk", "Catastrophic risk"], ["climate", "Climate"]] as const;

export function llmsFull(): string {
  const parts = [
    "# charityevals: every model in full",
    "",
    `> Open cost-effectiveness models of charities. Results are ${HEALTHY_YEARS} donated on the site's default assumptions, with the plausible range each page shows. The same data as JSON: ${abs("/data/models.json")}. Our own work is ${OWN_LICENCE.name}; models rebuilt from an evaluator's analysis keep that evaluator's terms (given per model).`,
  ];
  for (const [cause, title] of CAUSES) {
    const charities = publishedCharities().filter((c) => c.cause === cause);
    if (!charities.length) continue;
    parts.push("", `# ${title}`);
    for (const c of charities) {
      const primary = primaryOf(lib, c.id)!;
      const models = [primary, ...rankable.filter((m) => m.charity === c.id && m !== primary)];
      parts.push("", `## ${c.name}`, "", abs(`/${c.id}`));
      if (c.summary) parts.push("", c.summary.trim());
      const seen = new Set<string>();
      for (const m of models) parts.push("", modelText(m, seen));
    }
  }
  return parts.join("\n") + "\n";
}

export const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json; charset=utf-8" } });
