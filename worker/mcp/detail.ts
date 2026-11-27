// get_model's answers: a model at the default values with its summary, caveats, the inputs that move it
// most and its source; for a charity, its figure, its models and its main model. They read the models'
// text, so the build writes one per id (/data/mcp/<id>.json) from the full library; the worker computes
// one only if that file is missing.
import { compute, headline, pickValue, usedAssumptions, type Library, type ResolvedModel } from "../../src/engine/model";
import { renderText } from "../../src/engine/prose";
import { sensitivity, type Swing } from "../../src/engine/sensitivity";
import { caveats } from "./figures";
import { YEARS, type Catalogue, type Figures } from "./catalogue";
import { abs, charityItem, charityRef, figure, licence, modelLicence, modelPath, ownerName, r3, short, type Json } from "./items";
import { DEFAULTS, settable } from "./values";
import { plainModelName } from "../../src/lib/format";

const DRIVERS = 8;

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

/** What a model's page says beyond the figures (src/lib/page-text.ts: story, the page's questions, how the
 * evaluator's figure becomes ours, write-up, sources), which the build adds to the stored answers. */
export type PageText = (m: ResolvedModel) => { across_locations?: unknown; story?: unknown; depends_on: unknown[]; from_evaluator?: unknown; writeup?: string; sources: { title: string; url: string }[] } | undefined;

function modelDetail(lib: Library, cat: Catalogue, figs: Figures, m: ResolvedModel, av: Record<string, number>, page?: PageText): Json {
  const p = page?.(m);
  const s = sensitivity(lib, m, av);
  const vals = compute(lib, m, av);
  const big = s.swings.some((x) => x.logSwing === Infinity);
  const top = [...s.swings].sort((a, b) => (big ? Math.abs(b.atHigh - b.atLow) - Math.abs(a.atHigh - a.atLow) : b.logSwing - a.logSwing)).slice(0, DRIVERS);
  const sets = settable(lib.assumptions);
  const c = cat.models[m.id];
  const evaluatorView = m.owner !== "charityevals" && c.unit === YEARS ? r3(headline(lib, m, av, {}, "evaluator")) : undefined;
  return {
    type: "model",
    id: m.id,
    name: plainModelName(m.name),
    charity: charityRef(cat, figs, m.charity),
    evaluator: ownerName(cat, m.owner),
    cause: m.cause,
    ...figure(figs.model(m.id)!),
    unit: c.unit,
    at: "default values",
    ...(evaluatorView !== undefined ? { evaluator_view: { result: evaluatorView, note: "The evaluator's model as published, at its own values and conversions, in the same unit." } } : {}),
    summary: rendered(lib, m, (x) => x.summary),
    ...(p?.across_locations ? { across_locations: p.across_locations } : {}),
    ...(p?.story ? { story: p.story } : {}),
    caveats: caveats(lib, m, av),
    // The page's "What it depends on" where the build has it; else each input alone from its low to its high end.
    ...(p ? { depends_on: p.depends_on } : { top_drivers: top.map((x) => driver(lib, m, x, vals, av)) }),
    ...(p?.from_evaluator ? { from_evaluator: p.from_evaluator } : {}),
    assumptions_used: usedAssumptions(lib, m).filter((id) => sets.has(id)),
    ...(m.source ? { source: { publisher: m.source.publisher, title: m.source.title, url: m.source.url, ...(m.source.published ? { published: m.source.published } : {}) } } : {}),
    url: abs(modelPath(cat, m.id)),
    history: abs(`${modelPath(cat, m.id)}/history`),
    full_model: abs(`/data/models/${m.id}.json`),
    ...(p ? { sources: p.sources.map((x) => ({ title: x.title, url: x.url })) } : {}),
    ...(p?.writeup ? { writeup: p.writeup } : {}),
    licence: licence(modelLicence(cat, m.id)),
    // As the model page and /data/models/<id>.json show it: the evaluator's permission beside its licence.
    ...(lib.owners.get(m.owner)?.permission ? { permission: lib.owners.get(m.owner)!.permission } : {}),
  };
}

/** get_model's answer for an id (a model's, else a charity's), at the default values `av` with their
 * figures `figs`; undefined for an id that names neither. */
export function getModelAnswer(lib: Library, cat: Catalogue, figs: Figures, av: Record<string, number>, id: string, page?: PageText): Json | undefined {
  if (id in cat.models) return modelDetail(lib, cat, figs, lib.models.get(id)!, av, page);
  const c = cat.charities[id];
  if (!c) return undefined;
  const f = figs.charity(id);
  return {
    charity: f ? charityItem(cat, id, f, DEFAULTS) : { type: "charity", id, name: c.name, cause: c.cause, on_rankings: false, url: abs(`/${id}`) },
    models: c.models.slice(0, 20).map((x) => ({ id: x, name: cat.models[x].name, evaluator: ownerName(cat, cat.models[x].owner), ...figure(figs.model(x)!), unit: cat.models[x].unit })),
    main_model: modelDetail(lib, cat, figs, lib.models.get(c.main)!, av, page),
    licence: licence(modelLicence(cat, c.main)),
  };
}

/** Every id get_model answers for: models first (an id that is both is the model's), then charities. */
export const answerIds = (cat: Catalogue) => [...new Set([...Object.keys(cat.models), ...Object.keys(cat.charities)])];
