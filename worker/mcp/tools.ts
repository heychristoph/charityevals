// The MCP server's tools: search, read, run, compare and rank charityevals' models, at the default
// values or the reader's own. Every answer is compact JSON in years of healthy life per $1,000 (a model
// in a unit nobody converts: its own unit per dollar), with the plausible range, the page and the terms
// the figures can be reused under (src/lib/licence.ts).
//
// What it costs: the defaults and every value set are answered from what the build computed
// (/data/mcp-results.json) and get_model from the build's answers (/data/mcp/<id>.json), with no engine.
// Only a reader's own values load the library and compute; those computations count against a global
// daily budget, and the last few are kept per isolate, so a repeated request is free.
import { assumptionValues } from "../../src/engine/model";
import { OWN_LICENCE } from "../../src/lib/licence";
import { catalogueOf, LiveFigures, StoredFigures, YEARS, type Catalogue, type Figures, type Precomputed } from "./catalogue";
import { getModelAnswer } from "./detail";
import { abs, charityItem, charityLicence, figure, item, licence, licences, modelItem, modelLicence, ownerName, short, unknownId, type Json } from "./items";
import type { Loaded } from "./library";
import { DEFAULTS, parseValues, settable, ToolError, type Values } from "./values";

const MAX_IDS = 10;
const MAX_RANK = 100;
const MAX_SEARCH = 25;
/** Computations with a reader's own values kept per isolate. */
const MEMO = 8;

type Args = Record<string, unknown>;

/** A global count of computations with readers' own values: false once today's are used up. */
export type Budget = { take(): Promise<boolean> };

export type Context = {
  /** The build's catalogue and figures (/data/mcp-results.json); undefined if it can't be read. */
  results(): Promise<Precomputed | undefined>;
  /** The library, for a reader's own values (/data/mcp-library.json). */
  library(): Promise<Loaded>;
  /** get_model's answer for an id, as the build wrote it (/data/mcp/<id>.json). */
  answer?(id: string): Promise<Json | undefined>;
  budget?: Budget;
};

// --- Where the figures come from -----------------------------------------------------------------

type Memo = { catalogue?: Catalogue; scenarios: Map<string, LiveFigures>; custom: Map<string, LiveFigures> };
const memos = new WeakMap<Loaded, Memo>();
const memoOf = (loaded: Loaded) => memos.get(loaded) ?? memos.set(loaded, { scenarios: new Map(), custom: new Map() }).get(loaded)!;

async function catalogue(ctx: Context): Promise<{ cat: Catalogue; pre?: Precomputed }> {
  const pre = await ctx.results().catch(() => undefined);
  if (pre) return { cat: pre.catalogue, pre };
  const loaded = await ctx.library();
  const memo = memoOf(loaded);
  return { cat: (memo.catalogue ??= catalogueOf(loaded.lib)) };
}

/** The figures under values `v`: stored for the defaults and the value sets, else computed (from the
 * isolate's last few, or counted against the daily budget). */
async function figuresFor(ctx: Context, v: Values, pre: Precomputed | undefined): Promise<Figures> {
  const stored = v.scenario !== "custom" && pre?.scenarios[v.scenario];
  if (stored) return new StoredFigures(stored);
  const loaded = await ctx.library();
  const memo = memoOf(loaded);
  const av = () => (v.scenario === "default" ? loaded.defaults : assumptionValues(loaded.lib.assumptions, v.applied));
  if (v.scenario !== "custom") {
    let f = memo.scenarios.get(v.scenario);
    if (!f) memo.scenarios.set(v.scenario, (f = new LiveFigures(loaded.lib, av())));
    return f;
  }
  const key = JSON.stringify(Object.entries(v.applied).sort(([a], [b]) => a.localeCompare(b)));
  const hit = memo.custom.get(key);
  if (hit) {
    // Most recently used last.
    memo.custom.delete(key);
    memo.custom.set(key, hit);
    return hit;
  }
  if (ctx.budget) {
    let ok: boolean;
    try {
      ok = await ctx.budget.take();
    } catch (e) {
      console.error("mcp: budget unavailable", (e as Error).message);
      ok = false;
    }
    if (!ok)
      throw new ToolError("Today's quota of calculations with custom values is used up (it resets at midnight UTC). The defaults and the value sets (list_assumptions) still work: pass { \"set\": \"<id>\" }, or no values.");
  }
  const f = new LiveFigures(loaded.lib, av());
  memo.custom.set(key, f);
  if (memo.custom.size > MEMO) memo.custom.delete(memo.custom.keys().next().value!);
  return f;
}

const idArg = (args: Args, key = "id") => {
  const v = args[key];
  if (typeof v !== "string" || !v.trim()) throw new ToolError(`${key} is required: a charity id or a model id (search_charities finds them).`);
  return v.trim();
};

const valuesOut = (v: Values) => (v.set || Object.keys(v.applied).length ? { ...(v.set ? { set: v.set } : {}), applied: v.applied } : "defaults");

function causeArg(cat: Catalogue, args: Args): string | undefined {
  const cause = args.cause;
  if (cause === undefined || cause === null || cause === "") return undefined;
  const all = [...new Set(Object.values(cat.charities).flatMap((c) => [c.cause, ...(c.area ? [c.area] : [])]))].sort();
  if (typeof cause !== "string" || !all.includes(cause)) throw new ToolError(`No cause "${String(cause)}". Causes: ${all.join(", ")}.`);
  return cause;
}

function limitArg(args: Args, fallback: number, max: number): number {
  const n = args.limit === undefined ? fallback : Number(args.limit);
  if (!Number.isInteger(n) || n < 1 || n > max) throw new ToolError(`limit must be a whole number from 1 to ${max}.`);
  return n;
}

// --- search_charities ----------------------------------------------------------------------------

const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
type Entry = { id: string; name: string; text: string };
const indexes = new WeakMap<Catalogue, Entry[]>();
function searchIndex(cat: Catalogue): Entry[] {
  let ix = indexes.get(cat);
  if (!ix) {
    ix = Object.entries(cat.charities).map(([id, c]) => ({
      id,
      name: norm(c.name),
      text: norm([id, c.name, c.cause, c.area ?? "", c.summary ?? "", ...c.models.map((m) => `${cat.models[m].name} ${ownerName(cat, cat.models[m].owner)}`)].join(" ")),
    }));
    indexes.set(cat, ix);
  }
  return ix;
}

async function searchCharities(ctx: Context, args: Args): Promise<Json> {
  const { cat, pre } = await catalogue(ctx);
  const query = typeof args.query === "string" ? norm(args.query) : "";
  const cause = causeArg(cat, args);
  const limit = limitArg(args, 10, MAX_SEARCH);
  const words = query.split(" ").filter(Boolean);
  const scored = searchIndex(cat).flatMap((e) => {
    const c = cat.charities[e.id];
    if (cause && c.cause !== cause && c.area !== cause) return [];
    if (!words.length) return [{ e, score: 0 }];
    if (!words.every((w) => e.text.includes(w))) return [];
    const score = e.id === query.replace(/ /g, "-") || e.name === query ? 4 : e.name.startsWith(query) ? 3 : words.every((w) => e.name.includes(w)) ? 2 : 1;
    return [{ e, score }];
  });
  scored.sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));
  const top = scored.slice(0, limit);
  const figs = top.length ? await figuresFor(ctx, DEFAULTS, pre) : undefined;
  const hits = top.map(({ e }) => {
    const c = cat.charities[e.id];
    const f = figs!.charity(e.id);
    const base = { id: e.id, name: c.name, cause: c.cause, ...(c.area ? { area: c.area } : {}), summary: short(c.summary, 300) };
    const fig = f
      ? charityItem(cat, e.id, f, DEFAULTS)
      : { ...figure(figs!.model(c.main) ?? { central: NaN, low: NaN, high: NaN }), unit: cat.models[c.main].unit, on_rankings: false, url: abs(`/${e.id}`), licence: modelLicence(cat, c.main).name };
    const { type: _t, id: _i, name: _n, cause: _c, combines: _x, model: _m, other_evaluators: _o, ...rest } = fig as Json;
    const l = f ? charityLicence(cat, f) : modelLicence(cat, c.main);
    return { hit: { ...base, ...rest, models: c.models.slice(0, 8).map((m) => ({ id: m, name: cat.models[m].name, evaluator: ownerName(cat, cat.models[m].owner) })), ...(c.models.length > 8 ? { more_models: c.models.length - 8 } : {}) }, l };
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

async function getModel(ctx: Context, args: Args): Promise<Json> {
  const id = idArg(args);
  // The build's answer (ids are lowercase letters, digits and hyphens: nothing else is looked up).
  if (/^[a-z0-9-]+$/.test(id) && ctx.answer) {
    const stored = await ctx.answer(id).catch(() => undefined);
    if (stored) return stored;
  }
  const { cat } = await catalogue(ctx);
  if (!(id in cat.models) && !(id in cat.charities)) throw unknownId(cat, id);
  const loaded = await ctx.library();
  const answer = getModelAnswer(loaded.lib, cat, await figuresFor(ctx, DEFAULTS, undefined), loaded.defaults, id);
  if (!answer) throw unknownId(cat, id);
  return answer;
}

// --- run_model and compare -----------------------------------------------------------------------

async function runModel(ctx: Context, args: Args): Promise<Json> {
  const id = idArg(args);
  const { cat, pre } = await catalogue(ctx);
  const v = parseValues(cat.assumptions, args.values);
  // An unknown id fails before anything is computed.
  const at = item(cat, id, await figuresFor(ctx, DEFAULTS, pre), DEFAULTS, "model").json;
  const { json, licence: l } = item(cat, id, await figuresFor(ctx, v, pre), v, "model");
  return { values: valuesOut(v), ...json, at_defaults: { result: at.result, low: at.low, high: at.high }, licence: licence(l) };
}

async function compare(ctx: Context, args: Args): Promise<Json> {
  const ids = args.ids;
  if (!Array.isArray(ids) || !ids.length || ids.some((x) => typeof x !== "string")) throw new ToolError(`ids is required: a list of charity or model ids (1 to ${MAX_IDS}).`);
  if (ids.length > MAX_IDS) throw new ToolError(`Compare at most ${MAX_IDS} at once.`);
  const { cat, pre } = await catalogue(ctx);
  const v = parseValues(cat.assumptions, args.values);
  const unique = [...new Set((ids as string[]).map((x) => x.trim()))];
  for (const id of unique) if (!(id in cat.models) && !(id in cat.charities)) throw unknownId(cat, id);
  const figs = await figuresFor(ctx, v, pre);
  const items = unique.map((id) => item(cat, id, figs, v, "charity"));
  return { values: valuesOut(v), items: items.map((x) => x.json), licences: licences(items.map((x) => x.licence)) };
}

// --- rank ----------------------------------------------------------------------------------------

async function rank(ctx: Context, args: Args): Promise<Json> {
  const { cat, pre } = await catalogue(ctx);
  const cause = causeArg(cat, args);
  const limit = limitArg(args, 20, MAX_RANK);
  const v = parseValues(cat.assumptions, args.values);
  const figs = await figuresFor(ctx, v, pre);
  const all = figs.rankings();
  const list = cause ? all.filter((id) => cat.charities[id].cause === cause || cat.charities[id].area === cause) : all;
  const rows = list.slice(0, limit).map((id, i) => {
    const f = figs.charity(id)!;
    const l = charityLicence(cat, f);
    const c = cat.charities[id];
    return { row: { rank: i + 1, id, name: c.name, cause: c.cause, ...figure(f), evaluator: ownerName(cat, f.primary), url: abs(`/${id}${v.query}`), licence: l.name }, l };
  });
  return {
    values: valuesOut(v),
    ...(cause ? { cause } : {}),
    unit: YEARS,
    total: list.length,
    rankings: rows.map((r) => r.row),
    page: abs(`${causePage(cat, cause, list)}${v.query}`),
    licences: licences([OWN_LICENCE, ...rows.map((r) => r.l)]),
    note: "Each charity's figure is its primary evaluator's, its programmes combined by funding; low and high are the plausible range. The ranking itself is charityevals' (first licence); each figure keeps its model's licence.",
  };
}

/** The page that shows a filtered ranking: /causes/<cause> for a cause, the area's own cause for an area
 * (the site has pages per cause only, src/pages/causes/[cause].astro), else the homepage. */
function causePage(cat: Awaited<ReturnType<typeof catalogue>>["cat"], cause: string | undefined, ranked: string[]): string {
  if (!cause) return "/";
  const causes = new Set(ranked.map((id) => cat.charities[id].cause));
  if (ranked.some((id) => cat.charities[id].cause === cause)) return `/causes/${cause}`;
  return causes.size === 1 ? `/causes/${[...causes][0]}` : "/";
}

// --- list_assumptions ----------------------------------------------------------------------------

async function listAssumptions(ctx: Context): Promise<Json> {
  const { cat } = await catalogue(ctx);
  const a = cat.assumptions;
  const defaults = assumptionValues(a);
  const groups = new Map(a.groups.map((g) => [g.id, g.title]));
  const sets = settable(a);
  return {
    how: 'Pass values to run_model, compare or rank as { "<id>": <number>, ... }, or a value set as { "set": "<id>" } (single values on top of a set are allowed). Any value the models can run on is taken, past low and high (the slider\'s ends) too; shares are fractions (0.04 is 4%).',
    assumptions: a.rows.filter((r) => r.formula === undefined).map((r) => {
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
    value_sets: (a.presets ?? []).map((p) => ({ id: p.id, label: p.label, about: p.about, values: p.values })),
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
  run: (ctx: Context, args: Args) => Promise<Json>;
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
