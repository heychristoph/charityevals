// The MCP server's tools: search, read, run, compare and rank charityevals' models, at the default
// values or the reader's own. Every answer is compact JSON in years of healthy life per $1,000 (a model
// in a unit nobody converts: its own unit per dollar), with the plausible range, the page and the terms
// the figures can be reused under (src/lib/licence.ts).
import { compute, headline, modelsOf, pickValue, usedAssumptions, type Library, type ResolvedModel } from "../../src/engine/model";
import { primaryModel } from "../../src/engine/ranking";
import { renderText } from "../../src/engine/prose";
import { sensitivity, type Swing } from "../../src/engine/sensitivity";
import { licenceOf, OWN_LICENCE, type Licence } from "../../src/lib/licence";
import { charityFigure, cheapFlags, comparable, modelFigure, rankings, type CharityFigure, type Figure } from "./figures";
import type { Loaded } from "./library";
import { parseValues, settable, ToolError, type Values } from "./values";

export const SITE = "https://charityevals.org";
const YEARS = "years of healthy life per $1,000";
const MAX_IDS = 10;
const MAX_RANK = 100;
const MAX_SEARCH = 25;
const MAX_TEXT = 600;
const DRIVERS = 8;

type Json = Record<string, unknown>;
type Args = Record<string, unknown>;

/** Three significant figures: the models aren't more precise than that. */
const r3 = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(3)) : null);
const short = (s: string | undefined, n = MAX_TEXT) => (s && s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const abs = (path: string) => `${SITE}${path}`;
const licence = (l: Licence) => ({ name: l.name, ...(l.url ? { url: l.url } : {}), attribution: l.attribution });

function unitOf(lib: Library, m: ResolvedModel): string {
  return comparable(lib, m) ? YEARS : `${lib.assumptions.units[m.output!.unit]?.label ?? m.output!.unit} per dollar`;
}

/** A model's page: the charity's page for its main model, else /<charity>/<model> (src/lib/data.ts modelUrl). */
function modelPath(lib: Library, m: ResolvedModel): string {
  return primaryModel(lib, m.charity)?.id === m.id ? `/${m.charity}` : `/${m.charity}/${m.id}`;
}

const ownerName = (lib: Library, id: string) => lib.owners.get(id)?.name ?? id;
const figure = (f: Figure) => ({ result: r3(f.central), low: r3(Math.min(f.low, f.high)), high: r3(Math.max(f.low, f.high)) });

/** A model's text rendered at the default values (`{{result}}` placeholders, docs/prose-numbers.md). Text
 * a variant inherits renders with its parent's values, as on the pages (prose.ts renderLibraryProse). */
function rendered(lib: Library, m: ResolvedModel, get: (x: ResolvedModel) => string | undefined): string | undefined {
  const text = get(m);
  if (!text) return text;
  let at = m;
  for (let p = at.extends ? lib.models.get(at.extends) : undefined; p && get(p) === text; p = p.extends ? lib.models.get(p.extends) : undefined) at = p;
  try {
    return renderText(lib, at, text);
  } catch {
    return text;
  }
}

const models = (lib: Library) => [...lib.models.values()].filter((m) => m.kind !== "template" && m.output);

/** A model by id, or a charity's main model by the charity's id. */
function findModel(lib: Library, id: string): ResolvedModel | undefined {
  const m = lib.models.get(id);
  if (m && m.kind !== "template" && m.output) return m;
  return lib.charities.has(id) ? primaryModel(lib, id) : undefined;
}

function unknownId(lib: Library, id: string): ToolError {
  const q = id.toLowerCase();
  const near = [...lib.charities.values()].filter((c) => c.id.includes(q) || q.includes(c.id) || c.name.toLowerCase().includes(q)).slice(0, 5).map((c) => c.id);
  return new ToolError(`No charity or model "${id}".${near.length ? ` Did you mean: ${near.join(", ")}?` : ""} search_charities finds ids.`);
}

const idArg = (args: Args, key = "id") => {
  const v = args[key];
  if (typeof v !== "string" || !v.trim()) throw new ToolError(`${key} is required: a charity id or a model id (search_charities finds them).`);
  return v.trim();
};

const valuesOut = (v: Values) => (v.set || Object.keys(v.applied).length ? { ...(v.set ? { set: v.set } : {}), applied: v.applied } : "defaults");

/** The licences an answer's figures carry, once each, and each item's by name. */
function licences(items: Licence[]) {
  const seen = new Map<string, Licence>();
  for (const l of items) seen.set(`${l.name}|${l.attribution}`, l);
  return [...seen.values()].map(licence);
}

// --- Items ---------------------------------------------------------------------------------------

/** One model's figure at the reader's values. */
function modelItem(lib: Library, m: ResolvedModel, v: Values): Json {
  return {
    type: "model",
    id: m.id,
    name: m.name,
    charity: { id: m.charity, name: lib.charities.get(m.charity)?.name ?? m.charity },
    evaluator: ownerName(lib, m.owner),
    ...figure(modelFigure(lib, m, v.av)),
    unit: unitOf(lib, m),
    url: abs(modelPath(lib, m) + v.query),
    licence: licenceOf(m).name,
  };
}

/** One charity's figure at the reader's values, as the rankings make it. */
function charityItem(lib: Library, f: CharityFigure, v: Values, ranked: boolean): Json {
  const lead = f.evaluators.find((e) => e.owner === f.primary)!;
  const parts = lead.programmes;
  return {
    type: "charity",
    id: f.charity.id,
    name: f.charity.name,
    cause: f.charity.cause,
    evaluator: ownerName(lib, f.primary),
    ...figure(f),
    unit: YEARS,
    on_rankings: ranked,
    // The models behind the figure, where it combines more than one.
    ...(parts.length > 1 || parts[0].locations > 1
      ? { combines: { how: lead.basis === "weighted" ? "funding-weighted" : lead.basis, programmes: parts.map((p) => ({ programme: p.programme || undefined, model: p.model.id, ...figure(p), ...(p.locations > 1 ? { locations: p.locations } : {}) })) } }
      : { model: parts[0].model.id }),
    ...(f.evaluators.length > 1 ? { other_evaluators: f.evaluators.filter((e) => e !== lead).map((e) => ({ evaluator: ownerName(lib, e.owner), ...figure(e) })) } : {}),
    url: abs(`/${f.charity.id}${v.query}`),
    licence: licenceOf(parts[0].model).name,
  };
}

/** A charity's figure at the reader's values: as ranked where it is on the rankings at them, else as its page shows it. */
function charityFigureAny(lib: Library, id: string, av: Record<string, number>) {
  const ranked = charityFigure(lib, id, av, true);
  return ranked ? { f: ranked, ranked: true } : { f: charityFigure(lib, id, av, false), ranked: false };
}

// --- search_charities ----------------------------------------------------------------------------

const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
type Entry = { id: string; name: string; text: string; models: ResolvedModel[] };
const indexes = new WeakMap<Library, Entry[]>();
function searchIndex(lib: Library): Entry[] {
  let ix = indexes.get(lib);
  if (!ix) {
    ix = [...lib.charities.values()].flatMap((c) => {
      const ms = modelsOf(lib, c.id);
      if (!ms.length) return [];
      return [{ id: c.id, name: norm(c.name), text: norm([c.id, c.name, c.cause, c.area ?? "", c.summary ?? "", ...ms.map((m) => `${m.name} ${ownerName(lib, m.owner)}`)].join(" ")), models: ms }];
    });
    indexes.set(lib, ix);
  }
  return ix;
}

function causes(lib: Library): string[] {
  return [...new Set([...lib.charities.values()].flatMap((c) => [c.cause, ...(c.area ? [c.area] : [])]))].sort();
}

function causeArg(lib: Library, args: Args): string | undefined {
  const cause = args.cause;
  if (cause === undefined || cause === null || cause === "") return undefined;
  const all = causes(lib);
  if (typeof cause !== "string" || !all.includes(cause)) throw new ToolError(`No cause "${String(cause)}". Causes: ${all.join(", ")}.`);
  return cause;
}

function limitArg(args: Args, fallback: number, max: number): number {
  const n = args.limit === undefined ? fallback : Number(args.limit);
  if (!Number.isInteger(n) || n < 1) throw new ToolError(`limit must be a whole number from 1 to ${max}.`);
  return Math.min(n, max);
}

function searchCharities({ lib, defaults }: Loaded, args: Args): Json {
  const query = typeof args.query === "string" ? norm(args.query) : "";
  const cause = causeArg(lib, args);
  const limit = limitArg(args, 10, MAX_SEARCH);
  const words = query.split(" ").filter(Boolean);
  const scored = searchIndex(lib).flatMap((e) => {
    const c = lib.charities.get(e.id)!;
    if (cause && c.cause !== cause && c.area !== cause) return [];
    if (!words.length) return [{ e, score: 0 }];
    if (!words.every((w) => e.text.includes(w))) return [];
    const score = e.id === query.replace(/ /g, "-") || e.name === query ? 4 : e.name.startsWith(query) ? 3 : words.every((w) => e.name.includes(w)) ? 2 : 1;
    return [{ e, score }];
  });
  scored.sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));
  const v: Values = { av: defaults, applied: {}, query: "" };
  const hits = scored.slice(0, limit).map(({ e }) => {
    const c = lib.charities.get(e.id)!;
    const { f, ranked } = charityFigureAny(lib, e.id, defaults);
    const main = primaryModel(lib, e.id) ?? e.models[0];
    const base = { id: c.id, name: c.name, cause: c.cause, ...(c.area ? { area: c.area } : {}), summary: short(c.summary, 300) };
    const fig = f
      ? charityItem(lib, f, v, ranked)
      : { ...figure(modelFigure(lib, main, defaults)), unit: unitOf(lib, main), on_rankings: false, url: abs(`/${c.id}`), licence: licenceOf(main).name };
    const { type: _t, id: _i, name: _n, cause: _c, combines: _x, model: _m, other_evaluators: _o, ...rest } = fig as Json;
    const l = licenceOf(f ? f.evaluators.find((x) => x.owner === f.primary)!.programmes[0].model : main);
    return { hit: { ...base, ...rest, models: e.models.slice(0, 8).map((m) => ({ id: m.id, name: m.name, evaluator: ownerName(lib, m.owner) })), ...(e.models.length > 8 ? { more_models: e.models.length - 8 } : {}) }, l };
  });
  return {
    query: args.query ?? "",
    ...(cause ? { cause } : {}),
    found: scored.length,
    results: hits.map((h) => h.hit),
    note: hits.length ? `Figures at the default values, in ${YEARS}.` : "Nothing matched. Try fewer or shorter words, or a cause alone.",
    licences: licences(hits.map((h) => h.l)),
  };
}

// --- get_model -----------------------------------------------------------------------------------

function driver(lib: Library, m: ResolvedModel, s: Swing, vals: Record<string, number>, av: Record<string, number>): Json {
  const value = s.scope === "row" ? vals[s.id] : s.scope === "assumption" ? av[s.id] : pickValue(lib.facts.get(s.id.slice(1))?.value);
  const explainer = s.scope === "row" ? rendered(lib, m, (x) => x.byId.get(s.id)?.explainer)
    : s.scope === "assumption" ? lib.assumptions.rows.find((r) => r.id === s.id)?.explainer
    : lib.facts.get(s.id.slice(1))?.explainer;
  return {
    id: s.id,
    label: s.label,
    what: s.scope === "row" ? "input" : s.scope === "assumption" ? "shared assumption" : "shared fact",
    ...(s.kind ? { kind: s.kind } : {}),
    value: r3(value),
    low: r3(s.low),
    high: r3(s.high),
    result_at_low: r3(s.atLow),
    result_at_high: r3(s.atHigh),
    explainer: short(explainer),
  };
}

function modelDetail(lib: Library, m: ResolvedModel, defaults: Record<string, number>): Json {
  const s = sensitivity(lib, m, defaults);
  const vals = compute(lib, m, defaults);
  const big = s.swings.some((x) => x.logSwing === Infinity);
  const top = [...s.swings].sort((a, b) => (big ? Math.abs(b.atHigh - b.atLow) - Math.abs(a.atHigh - a.atLow) : b.logSwing - a.logSwing)).slice(0, DRIVERS);
  const sets = settable(lib);
  const evaluatorView = m.owner !== "charityevals" && comparable(lib, m) ? r3(headline(lib, m, defaults, {}, "evaluator")) : undefined;
  return {
    type: "model",
    id: m.id,
    name: m.name,
    charity: { id: m.charity, name: lib.charities.get(m.charity)?.name ?? m.charity },
    evaluator: ownerName(lib, m.owner),
    cause: m.cause,
    ...figure(modelFigure(lib, m, defaults)),
    unit: unitOf(lib, m),
    at: "default values",
    ...(evaluatorView !== undefined ? { evaluator_view: { result: evaluatorView, note: "The evaluator's model as published, at its own values and conversions, in the same unit." } } : {}),
    summary: rendered(lib, m, (x) => x.summary),
    caveats: cheapFlags(lib, m),
    top_drivers: top.map((x) => driver(lib, m, x, vals, defaults)),
    assumptions_used: usedAssumptions(lib, m).filter((id) => sets.has(id)),
    ...(m.source ? { source: { publisher: m.source.publisher, title: m.source.title, url: m.source.url, ...(m.source.published ? { published: m.source.published } : {}) } } : {}),
    url: abs(modelPath(lib, m)),
    history: abs(`${modelPath(lib, m)}/history`),
    full_model: abs(`/data/models/${m.id}.json`),
    licence: licence(licenceOf(m)),
  };
}

function getModel({ lib, defaults }: Loaded, args: Args): Json {
  const id = idArg(args);
  const m = lib.models.get(id);
  if (m && m.kind !== "template" && m.output) return modelDetail(lib, m, defaults);
  const c = lib.charities.get(id);
  const main = c && primaryModel(lib, id);
  if (!c || !main) throw unknownId(lib, id);
  const { f, ranked } = charityFigureAny(lib, id, defaults);
  const v: Values = { av: defaults, applied: {}, query: "" };
  return {
    charity: f ? charityItem(lib, f, v, ranked) : { type: "charity", id, name: c.name, cause: c.cause, on_rankings: false, url: abs(`/${id}`) },
    models: modelsOf(lib, id).slice(0, 20).map((x) => ({ id: x.id, name: x.name, evaluator: ownerName(lib, x.owner), ...figure(modelFigure(lib, x, defaults)), unit: unitOf(lib, x) })),
    main_model: modelDetail(lib, main, defaults),
    licence: licence(licenceOf(main)),
  };
}

// --- run_model and compare -----------------------------------------------------------------------

/** An id as a figure: `prefer` says which reading wins where an id is both a model's and a charity's. */
function item(lib: Library, id: string, v: Values, prefer: "model" | "charity"): { json: Json; licence: Licence } {
  const m = lib.models.get(id);
  const isModel = !!m && m.kind !== "template" && !!m.output;
  if (lib.charities.has(id) && (prefer === "charity" || !isModel)) {
    const { f, ranked } = charityFigureAny(lib, id, v.av);
    if (f) return { json: charityItem(lib, f, v, ranked), licence: licenceOf(f.evaluators.find((e) => e.owner === f.primary)!.programmes[0].model) };
    const main = primaryModel(lib, id);
    if (main) return { json: modelItem(lib, main, v), licence: licenceOf(main) };
  }
  if (isModel) return { json: modelItem(lib, m!, v), licence: licenceOf(m!) };
  throw unknownId(lib, id);
}

function runModel({ lib, defaults }: Loaded, args: Args): Json {
  const id = idArg(args);
  const v = parseValues(lib, defaults, args.values);
  const { json, licence: l } = item(lib, id, v, "model");
  const at = item(lib, id, { av: defaults, applied: {}, query: "" }, "model").json;
  return { values: valuesOut(v), ...json, at_defaults: { result: at.result, low: at.low, high: at.high }, licence: licence(l) };
}

function compare({ lib, defaults }: Loaded, args: Args): Json {
  const ids = args.ids;
  if (!Array.isArray(ids) || !ids.length || ids.some((x) => typeof x !== "string")) throw new ToolError(`ids is required: a list of charity or model ids (1 to ${MAX_IDS}).`);
  if (ids.length > MAX_IDS) throw new ToolError(`Compare at most ${MAX_IDS} at once.`);
  const v = parseValues(lib, defaults, args.values);
  const items = [...new Set(ids as string[])].map((id) => item(lib, id.trim(), v, "charity"));
  return { values: valuesOut(v), items: items.map((x) => x.json), licences: licences(items.map((x) => x.licence)) };
}

// --- rank ----------------------------------------------------------------------------------------

const ranks = new WeakMap<Record<string, number>, CharityFigure[]>();

function rank({ lib, defaults }: Loaded, args: Args): Json {
  const cause = causeArg(lib, args);
  const limit = limitArg(args, 20, MAX_RANK);
  const v = parseValues(lib, defaults, args.values);
  let all = ranks.get(v.av);
  if (!all) ranks.set(v.av, (all = rankings(lib, v.av)));
  const list = cause ? all.filter((f) => f.charity.cause === cause || f.charity.area === cause) : all;
  const rows = list.slice(0, limit).map((f, i) => {
    const lead = f.evaluators.find((e) => e.owner === f.primary)!;
    const l = licenceOf(lead.programmes[0].model);
    return { row: { rank: i + 1, id: f.charity.id, name: f.charity.name, cause: f.charity.cause, ...figure(f), evaluator: ownerName(lib, f.primary), url: abs(`/${f.charity.id}${v.query}`), licence: l.name }, l };
  });
  return {
    values: valuesOut(v),
    ...(cause ? { cause } : {}),
    unit: YEARS,
    total: list.length,
    rankings: rows.map((r) => r.row),
    page: abs(`${cause ? `/causes/${cause}` : "/"}${v.query}`),
    licences: licences([OWN_LICENCE, ...rows.map((r) => r.l)]),
    note: "Each charity's figure is its primary evaluator's, its programmes combined by funding; low and high are the plausible range. The ranking itself is charityevals' (first licence); each figure keeps its model's licence.",
  };
}

// --- list_assumptions ----------------------------------------------------------------------------

function listAssumptions({ lib, defaults }: Loaded): Json {
  const groups = new Map(lib.assumptions.groups.map((g) => [g.id, g.title]));
  const sets = settable(lib);
  return {
    how: 'Pass values to run_model, compare or rank as { "<id>": <number>, ... }, or a value set as { "set": "<id>" } (single values on top of a set are allowed). Values outside a slider\'s ends move to the nearest end.',
    assumptions: lib.assumptions.rows.filter((r) => r.formula === undefined).map((r) => {
      const range = typeof r.value === "object" ? r.value : undefined;
      return {
        id: r.id,
        label: r.label,
        ...(r.technical ? { technical: r.technical } : {}),
        ...(r.section && groups.has(r.section) ? { group: groups.get(r.section) } : {}),
        format: r.control === "country" ? "country (ISO 3166 numeric code, 0 for none)" : r.format,
        default: defaults[r.id],
        ...(r.slider?.low !== undefined || range?.low !== undefined ? { low: r.slider?.low ?? range?.low } : {}),
        ...(r.slider?.high !== undefined || range?.high !== undefined ? { high: r.slider?.high ?? range?.high } : {}),
        settable: sets.has(r.id),
        explainer: short(r.explainer, 400),
      };
    }),
    value_sets: (lib.assumptions.presets ?? []).map((p) => ({ id: p.id, label: p.label, about: p.about, values: p.values })),
    url: abs("/assumptions"),
    licence: licence(OWN_LICENCE),
  };
}

// --- Definitions ---------------------------------------------------------------------------------

const VALUES_SCHEMA = {
  description: 'Your values: { "<assumption id>": <number>, ... } and/or { "set": "<value set id>" }. Omit for the defaults. list_assumptions lists both.',
  type: "object",
  properties: { set: { type: "string", description: "A value set's id (list_assumptions)." } },
  additionalProperties: { type: "number" },
};

export type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Json;
  run: (loaded: Loaded, args: Args) => Json;
};

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

export const TOOLS: Tool[] = [
  {
    name: "search_charities",
    title: "Search charities",
    description: `Find charities by name, programme or evaluator, optionally within a cause. Gives each charity's id, its figure at the default values (${YEARS}, with the plausible range), its models' ids and its page.`,
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Words to look for, e.g. 'malaria' or 'cage-free'. Empty lists every charity (in the cause, if given)." }, cause: { type: "string", description: "global-health, animal-welfare, climate or catastrophic-risk (or an area: ai, biosecurity, nuclear, democracy, livelihoods)." }, limit: { type: "integer", minimum: 1, maximum: MAX_SEARCH, default: 10 } } },
    run: searchCharities,
  },
  {
    name: "get_model",
    title: "Read a model",
    description: `A model's figure at the default values (${YEARS}, plausible range), summary, caveats, the inputs that move it most (with their ranges and explanations), its source and its page. Given a charity id: the charity's figure, its models and its main model.`,
    inputSchema: { type: "object", properties: { id: { type: "string", description: "A model id or a charity id (search_charities finds them)." } }, required: ["id"] },
    run: getModel,
  },
  {
    name: "run_model",
    title: "Run a model with your values",
    description: `A model's figure (${YEARS}, plausible range) at your values or a value set, beside its figure at the defaults, with a link to its page at those values. Given a charity id that isn't also a model's: the charity's figure as ranked.`,
    inputSchema: { type: "object", properties: { id: { type: "string", description: "A model id or a charity id." }, values: VALUES_SCHEMA }, required: ["id"] },
    run: runModel,
  },
  {
    name: "compare",
    title: "Compare charities or models",
    description: `Figures for up to ${MAX_IDS} charities or models side by side (${YEARS}, plausible ranges), at the defaults or your values. A charity id gives the charity's figure as ranked (its programmes combined); a model id, that model's.`,
    inputSchema: { type: "object", properties: { ids: { type: "array", items: { type: "string" }, minItems: 1, maxItems: MAX_IDS, description: "Charity or model ids." }, values: VALUES_SCHEMA }, required: ["ids"] },
    run: compare,
  },
  {
    name: "rank",
    title: "Rank charities",
    description: `The rankings, best first, as the site shows them: each charity's figure in ${YEARS} with its plausible range, at the defaults or your values, optionally within one cause.`,
    inputSchema: { type: "object", properties: { cause: { type: "string", description: "global-health, animal-welfare, climate or catastrophic-risk (or an area: ai, biosecurity, nuclear, democracy, livelihoods)." }, values: VALUES_SCHEMA, limit: { type: "integer", minimum: 1, maximum: MAX_RANK, default: 20 } } },
    run: rank,
  },
  {
    name: "list_assumptions",
    title: "List the shared assumptions",
    description: "The shared value judgments every model reads (moral weights, exchange rates between outcomes, the discount rate and others): ids, defaults, ranges and explanations, plus the ready-made value sets. Use the ids in values.",
    inputSchema: { type: "object", properties: {} },
    run: listAssumptions,
  },
];

/** tools/list's entries. */
export const toolList = () => TOOLS.map(({ name, title, description, inputSchema }) => ({ name, title, description, inputSchema, annotations: { title, ...READ_ONLY } }));

export { ToolError };
