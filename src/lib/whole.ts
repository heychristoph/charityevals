// A model's page for the whole charity: every location the charity funds, weighted by its money as the
// rankings weigh them (src/engine/ranking.ts: declaredLocations, combine). A reader's edit, made on the
// page's own model, moves every location by the same proportion, since locations differ (malaria deaths
// in Chad are not DRC's).
import { buildLibrary, compute, headline, type Library, type ResolvedModel } from "../engine/model";
import { modelRange } from "../engine/figures";
import { declaredLocations, locationsOf, rankingPlan } from "../engine/ranking";
import { fullRaw, lib, rawFacts, summarised } from "./data";
import { editsFor } from "./edit-state";
import { fillStory, storyValue } from "./story";
import { charityStoryNumbers, charityStoryValue } from "../engine/story";
import { formatValue } from "./format";

export type Place = { label: string; share: number; model: ResolvedModel };
export type PlaceFigure = Place & { values: Record<string, number>; base: Record<string, number>; result: number; low: number; high: number };
export type Whole = {
  places: PlaceFigure[];
  /** Each row of the page's model, as the funding-weighted mean over the places that have it. */
  values: Record<string, number>;
  /** The same before the reader's edits. */
  base: Record<string, number>;
  result: number;
  low: number;
  high: number;
};

/** The places a model's money goes to, with their shares of it; a model without declared locations is
 * one place. */
export function placesOf(model: ResolvedModel): Place[] {
  const parts = declaredLocations(lib.charities.get(model.charity), locationsOf(lib, model))?.filter((p) => p.weight > 0);
  if (!parts?.length) return [{ label: "", share: 1, model }];
  const total = parts.reduce((s, p) => s + p.weight, 0);
  return parts
    .flatMap((p) => p.models.map((m) => ({ label: p.models.length > 1 ? `${p.label}: ${m.name}` : p.label, share: p.weight / total / p.models.length, model: m })))
    .sort((a, b) => b.share - a.share);
}

/** `edits` are the page model's (editsFor). `engine` computes the page's own model (its live simulation). */
export function wholeOf(model: ResolvedModel, av: Record<string, number>, edits: Record<string, number>, engine: Library = lib): Whole {
  const pageBase = compute(engine, model, av);
  const places: PlaceFigure[] = placesOf(model).map((p) => {
    const own = p.model.id === model.id;
    const L = own ? engine : lib;
    const base = own ? pageBase : compute(L, p.model, av);
    const e: Record<string, number> = {};
    for (const [k, v] of Object.entries(edits)) {
      if (own || k.startsWith("@")) e[k] = v;
      else if (p.model.byId.has(k) && Number.isFinite(pageBase[k]) && pageBase[k] !== 0) e[k] = (base[k] * v) / pageBase[k];
    }
    const values = Object.keys(e).length ? compute(L, p.model, av, e) : base;
    const result = headline(L, p.model, av, e);
    const r = modelRange(L, p.model, result, av, undefined, e);
    return { ...p, values, base, result, low: Math.min(r.low, r.high), high: Math.max(r.low, r.high) };
  });
  const mean = (f: (p: PlaceFigure) => number) => places.reduce((s, p) => s + p.share * f(p), 0);
  const rowMean = (pick: (p: PlaceFigure) => Record<string, number>, page: Record<string, number>) => {
    const out: Record<string, number> = {};
    for (const r of model.rows) {
      const xs = places.map((p) => pick(p)[r.id]);
      out[r.id] = xs.every(Number.isFinite) ? mean((p) => pick(p)[r.id]) : page[r.id];
    }
    return out;
  };
  const pageValues = places.find((p) => p.model.id === model.id)?.values ?? pageBase;
  return {
    places,
    values: rowMean((p) => p.values, pageValues),
    base: rowMean((p) => p.base, pageBase),
    result: mean((p) => p.result),
    low: mean((p) => p.low),
    high: mean((p) => p.high),
  };
}

// A charity of several programmes (src/engine/ranking.ts: rankingPlan): $1,000 given is split across
// them by what each gets of the money, as the rankings weigh them, and each programme's own story and
// range are worked out as above, across its locations.

export type Program = { program: string; label: string; share: number; model: ResolvedModel };
export type ProgramFigure = Program & { edits: Record<string, number>; whole: Whole };
export type Charity = { programs: ProgramFigure[]; places: PlaceFigure[]; result: number; low: number; high: number };

const built = new Map<unknown, ResolvedModel>();
/** A model in full: the browser has only a summary of some (lib/browser-models.ts), and the page
 * fetches their files before it hydrates (client:model, lib/model-directive.ts). */
export function fullModel(m: ResolvedModel): ResolvedModel {
  if (!summarised(m)) return m;
  const raw = fullRaw(m.id);
  if (!raw) return m;
  let full = built.get(raw);
  if (!full) {
    full = buildLibrary([raw], lib.assumptions, rawFacts, [...lib.charities.values()], [...lib.owners.values()], { models: lib.models, trusted: !import.meta.env.SSR }).models.get(m.id)!;
    built.set(raw, full);
  }
  return full;
}

/** The programmes a charity's figure combines for this model's evaluator, with their shares of the money;
 * undefined for a charity of one programme, or one whose programmes have no shares to split $1,000 by. */
export function programsOf(model: ResolvedModel): Program[] | undefined {
  const c = lib.charities.get(model.charity);
  const parts = rankingPlan(lib, model.charity).find((e) => e.owner === model.owner)?.parts ?? [];
  if (parts.length < 2 || parts.some((p) => !(p.weight! > 0))) return undefined;
  const total = parts.reduce((s, p) => s + p.weight!, 0);
  return parts
    .map((p) => ({ program: p.program, label: c?.lines?.find((l) => l.id === p.program)?.label ?? p.model.name, share: p.weight! / total, model: p.model }))
    .sort((a, b) => b.share - a.share);
}

/** Every programme across its locations, at the reader's values and edits, and the charity as their sum. */
export function charityOf(programs: Program[], av: Record<string, number>, urlEdits: Record<string, number>): Charity {
  const figs = programs.map((p) => {
    const model = fullModel(p.model);
    const edits = editsFor(model, urlEdits, lib);
    return { ...p, model, edits, whole: wholeOf(model, av, edits) };
  });
  const sum = (f: (p: ProgramFigure) => number) => figs.reduce((s, p) => s + p.share * f(p), 0);
  return {
    programs: figs,
    places: figs.flatMap((p) => p.whole.places.map((x) => ({ ...x, share: x.share * p.share }))),
    result: sum((p) => p.whole.result),
    low: sum((p) => p.whole.low),
    high: sum((p) => p.whole.high),
  };
}

/** The charity's sentence: what $1,000 pays for in each programme, at its share of the money, from the
 * first thing each programme's story counts after the money ("$1,000 pays for **96 children protected
 * for a year**, **41 bed nets** and …"). The three largest programmes; undefined if none counts one. */
export function charitySentence(c: Charity, charity = lib.charities.get(c.programs[0]?.model.charity ?? "")): string | undefined {
  // The charity's own sentence, when its file has one and this split has every programme it names.
  const own = charity?.story;
  if (own && charityStoryNumbers(own).every((n) => c.programs.some((p) => p.program === n.program))) {
    return own.replace(/\{([a-z0-9-]+):\s*([^}|]+?)\s*(?:\|\s*([^}]+?)\s*)?\}/g, (_, program: string, expr: string, fmt?: string) => {
      const p = c.programs.find((x) => x.program === program)!;
      const x = charityStoryValue(expr, p.whole.values, p.whole.result, p.share);
      return formatValue(x, fmt === "$" ? "usd" : fmt === "%" ? "percent" : "number");
    });
  }
  const items = c.programs.flatMap((p) => {
    const steps = p.model.story?.steps ?? [];
    const i = steps.findIndex((s, j) => j > 0 && j < steps.length - 1 && s.total !== undefined);
    if (i < 0) return [];
    const [src, fmt] = steps[i].total!.split("|").map((x) => x.trim());
    if (fmt === "y") return [];
    const x = storyValue(src, p.whole.values, p.whole.result) * p.share;
    if (!Number.isFinite(x) || x <= 0) return [];
    const text = fillStory(steps[i].text, p.whole.values, p.whole.result, (y) => formatValue(y));
    return [`**${formatValue(x, fmt === "$" ? "usd" : fmt === "%" ? "percent" : "number")} ${text}**`];
  }).slice(0, 3);
  if (!items.length) return undefined;
  const list = items.length === 1 ? items[0] : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  return `$1,000 pays for ${list}.`;
}
