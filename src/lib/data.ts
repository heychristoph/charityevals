// Loads every model and the shared assumptions at build time. Both the static pages and the
// React islands import this. Bulk imports (models/grants/) are the exception: the server loads them in
// full, the browser gets them partially evaluated (generated/bulk-summaries.json): rows that read a
// shared assumption stay live, the rest is folded into numbers. The islands compute identical results
// under any assumptions without shipping tens of megabytes. A bulk model's own page
// passes its full rows to the island (bulkRaw).
import { buildLibrary, comparable, currentModelsOf, modelsOf, type Library, type ResolvedModel } from "../engine/model";
import assumptions from "../../assumptions/default.json";
import bulkSummaries from "../../generated/bulk-summaries.json";

const files = import.meta.glob<{ default: unknown }>(["../../models/**/*.json", "!../../models/grants/**"], { eager: true });
const bulkFiles = import.meta.env.SSR ? import.meta.glob<{ default: { id: string } }>("../../models/grants/**/*.json", { eager: true }) : {};
const bulk: unknown[] = import.meta.env.SSR ? Object.values(bulkFiles).map((f) => f.default) : bulkSummaries;
const factFiles = import.meta.glob<{ default: unknown }>("../../facts/*.json", { eager: true });
const charityFiles = import.meta.glob<{ default: unknown }>("../../charities/*.json", { eager: true });
import owners from "../../owners.json";

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

/** A bulk model's full file, for its own page to hand to the browser. Server only. */
export function bulkRaw(id: string): unknown {
  return Object.values(bulkFiles).find((f) => f.default.id === id)?.default;
}

/** Models with a page: charities and their variants, not templates. */
export const rankable = [...lib.models.values()].filter((m) => m.kind !== "template" && m.output);

/** A charity's main model: the first owner's, in owners.json order. Its page is /<charity>. */
export function primaryOf(lib: Library, charity: string): ResolvedModel | undefined {
  return modelsOf(lib, charity)[0];
}

export function modelUrl(lib: Library, m: ResolvedModel): string {
  return primaryOf(lib, m.charity)?.id === m.id ? `/${m.charity}` : `/${m.charity}/${m.id}`;
}

/** The model's file in the repo: bulk imports live under models/grants/<owner>/. */
export function modelFile(m: ResolvedModel): string {
  return m.bulk ? `models/grants/${m.owner}/${m.id}.json` : `models/${m.cause}/${m.id}.json`;
}

export function historyUrl(lib: Library, m: ResolvedModel): string {
  return `${modelUrl(lib, m)}/history`;
}

/** Charities on the rankings: those with at least one model in a comparable unit. */
export const rankedCharities = [...lib.charities.values()].filter((c) => modelsOf(lib, c.id).some((m) => comparable(lib, m)));

/** Charities whose evaluators report only in units nobody can convert (e.g. people reached). */
export const unrankedCharities = [...lib.charities.values()].filter(
  (c) => modelsOf(lib, c.id).length > 0 && !modelsOf(lib, c.id).some((m) => comparable(lib, m)),
);

/** Each ranked charity's models that set its place on the rankings (one per evaluator), for
 * rank-flip checks. */
export const rankedGroups = rankedCharities.map((c) => currentModelsOf(lib, c.id).filter((m) => comparable(lib, m)).map((m) => m.id));
