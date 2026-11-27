// Loads every model and the shared assumptions at build time. Both the static pages and the
// React islands import this. The server loads every model in full; the browser gets most of them
// partially evaluated (src/lib/browser-models.ts: generated/browser-models.json and, for bulk imports,
// generated/bulk-summaries.json): rows that read a shared assumption stay live, the rest is folded into
// numbers, the text left out. The islands compute identical results under any assumptions without
// shipping tens of megabytes. A summarised model's own page fetches its full file (fullRaw).
import { buildLibrary, modelsOf, type Library, type ResolvedModel } from "../engine/model";
import { primaryModel, rankingPlan } from "../engine/ranking";
import { renderLibraryProse, renderRaw } from "../engine/prose";
import assumptions from "../../assumptions/default.json";
import bulkSummaries from "../../generated/bulk-summaries.json";
import browserModels from "../../generated/browser-models.json";
import browserFactFiles from "../../generated/browser-facts.json";
import { summarisedIds } from "./browser-models";
import distributions from "../../generated/distributions.json";

const files = import.meta.env.SSR ? import.meta.glob<{ default: { id: string } }>(["../../models/**/*.json", "!../../models/grants/**"], { eager: true }) : {};
const own: unknown[] = import.meta.env.SSR ? Object.values(files).map((f) => f.default) : browserModels;
const bulkFiles = import.meta.env.SSR ? import.meta.glob<{ default: { id: string } }>("../../models/grants/**/*.json", { eager: true }) : {};
const bulk: unknown[] = import.meta.env.SSR ? Object.values(bulkFiles).map((f) => f.default) : bulkSummaries;
const factFiles = import.meta.env.SSR ? import.meta.glob<{ default: unknown }>("../../facts/*.json", { eager: true }) : {};
const charityFiles = import.meta.glob<{ default: unknown }>("../../charities/*.json", { eager: true });
import owners from "../../owners.json";
import { repo } from "./site";

/** The facts files, for rebuilding a single model in the browser (see ModelView): as written on the server;
 * in the browser without their text (lib/browser-models.ts FACT_TEXT), which addFactText puts back. */
export const rawFacts: unknown[] = import.meta.env.SSR ? Object.values(factFiles).map((f) => f.default) : browserFactFiles;

export const lib = buildLibrary(
  [...own, ...bulk],
  assumptions,
  rawFacts,
  Object.values(charityFiles).map((f) => f.default),
  owners,
  // The server validates every file (and npm run check before it); the browser trusts what it built.
  { trusted: !import.meta.env.SSR, distributions },
);

if (lib.errors.length) throw new Error(`Model errors (run npm run check):\n${lib.errors.join("\n")}`);

// Numbers in the models' text come from the models (`{{result}}`, docs/prose-numbers.md): rendered once,
// at the default assumptions, before any page reads a summary or an explainer.
const proseErrors = renderLibraryProse(lib);
if (proseErrors.length) throw new Error(`Placeholders that name nothing (docs/prose-numbers.md):\n${proseErrors.join("\n")}`);

/** The facts' text the browser's copy leaves out (explainers, sources), merged back in by a model's page
 * before its tree hydrates (lib/model-directive.ts fetches /fact-text.json). */
export function addFactText(text: Record<string, Record<string, unknown>>) {
  for (const [key, t] of Object.entries(text)) {
    const f = lib.facts.get(key);
    if (f) Object.assign(f, t);
  }
}
if (!import.meta.env.SSR) (globalThis as { __charityevalsAddFactText?: typeof addFactText }).__charityevalsAddFactText = addFactText;

/** The models the browser has only as summaries (src/lib/browser-models.ts); the same set on the server. */
const summarisedSet = summarisedIds([...lib.models.values()], distributions);
export const summarised = (m: ResolvedModel | undefined) => !!m && summarisedSet.has(m.id);

const rendered = new Map<string, unknown>();
/** A summarised model's full file, its text rendered. On the server, from models/; in the browser, the
 * copy the page's client:model directive fetched before hydrating (lib/model-directive.ts), which the
 * server rendered (pages/models/[id].json.ts). */
export function fullRaw(id: string): unknown {
  if (!import.meta.env.SSR) return globalThis.__charityevalsModels?.[id];
  if (!rendered.has(id)) {
    const raw = [...Object.values(bulkFiles), ...Object.values(files)].find((f) => f.default.id === id)?.default;
    rendered.set(id, raw && renderRaw(lib, raw));
  }
  return rendered.get(id);
}

/** Models with a page: charities and their variants, not templates. */
export const rankable = [...lib.models.values()].filter((m) => m.kind !== "template" && m.output);

const primaries = new WeakMap<Library, Map<string, ResolvedModel | undefined>>();

/** A charity's main model; its page is /<charity>. The first evaluator's (owners.json order) newest
 * model that counts on the rankings (src/engine/ranking.ts), so the page's model is the one behind
 * its headline and the homepage row, never a skeleton, VOI sheet or partial pilot sheet. A charity
 * off the rankings: its first model in modelsOf order. */
export function primaryOf(lib: Library, charity: string): ResolvedModel | undefined {
  const cache = primaries.get(lib) ?? new Map<string, ResolvedModel | undefined>();
  primaries.set(lib, cache);
  if (!cache.has(charity)) cache.set(charity, primaryModel(lib, charity));
  return cache.get(charity);
}

export function modelUrl(lib: Library, m: ResolvedModel): string {
  return primaryOf(lib, m.charity)?.id === m.id ? `/${m.charity}` : `/${m.charity}/${m.id}`;
}

/** The model's file in the repo: bulk imports live under models/grants/<owner>/. */
export function modelFile(m: ResolvedModel): string {
  return m.bulk ? `models/grants/${m.owner}/${m.id}.json` : `models/${m.cause}/${m.id}.json`;
}

/** The model's history page on this site: every version's result, charted, and what changed. */
export function historyUrl(m: ResolvedModel): string {
  return `${modelUrl(lib, m)}/history`;
}

/** Charities on the rankings: those with at least one model that counts (src/engine/ranking.ts): in a
 * comparable unit, and a program's own estimate rather than a skeleton, breakeven or VOI sheet. */
export const rankedCharities = [...lib.charities.values()].filter((c) => rankingPlan(lib, c.id).length > 0);
