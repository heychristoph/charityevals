// Loads every model and the shared assumptions at build time. Both the static pages and the
// React islands import this. Bulk imports (models/grants/) are the exception: the server loads them in
// full, the browser gets them partially evaluated (generated/bulk-summaries.json): rows that read a
// shared assumption stay live, the rest is folded into numbers. The islands compute identical results
// under any assumptions without shipping tens of megabytes. A bulk model's own page
// passes its full rows to the island (bulkRaw).
import { buildLibrary, modelsOf, type Library, type ResolvedModel } from "../engine/model";
import { primaryModel, rankingPlan } from "../engine/ranking";
import assumptions from "../../assumptions/default.json";
import bulkSummaries from "../../generated/bulk-summaries.json";

const files = import.meta.glob<{ default: unknown }>(["../../models/**/*.json", "!../../models/grants/**"], { eager: true });
const bulkFiles = import.meta.env.SSR ? import.meta.glob<{ default: { id: string } }>("../../models/grants/**/*.json", { eager: true }) : {};
const bulk: unknown[] = import.meta.env.SSR ? Object.values(bulkFiles).map((f) => f.default) : bulkSummaries;
const factFiles = import.meta.glob<{ default: unknown }>("../../facts/*.json", { eager: true });
const charityFiles = import.meta.glob<{ default: unknown }>("../../charities/*.json", { eager: true });
import owners from "../../owners.json";
import { repo } from "./site";

/** The facts files as written, for rebuilding a single model in the browser (see ModelView). */
export const rawFacts = Object.values(factFiles).map((f) => f.default);

export const lib = buildLibrary(
  [...Object.values(files).map((f) => f.default), ...bulk],
  assumptions,
  rawFacts,
  Object.values(charityFiles).map((f) => f.default),
  owners,
);

if (lib.errors.length) throw new Error(`Model errors (run npm run check):\n${lib.errors.join("\n")}`);

/** A bulk model's full file. On the server, from models/grants/; in the browser, the copy the page's
 * client:model directive fetched before hydrating (lib/model-directive.ts). */
export function bulkRaw(id: string): unknown {
  if (!import.meta.env.SSR) return globalThis.__charityevalsModels?.[id];
  return Object.values(bulkFiles).find((f) => f.default.id === id)?.default;
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
