// Loads every model and the shared assumptions at build time. Both the static pages and the
// React islands import this. Bulk imports (models/grants/) are the exception: the server loads them in
// full, the browser gets one-row stand-ins with the same bottom line (generated/bulk-summaries.json),
// so the islands compute identical numbers without shipping tens of megabytes. A bulk model's own page
// passes its full rows to the island (bulkRaw).
import { buildLibrary, comparable, modelsOf, type Library, type ResolvedModel } from "../engine/model";
import assumptions from "../../assumptions/default.json";
import bulkSummaries from "../../generated/bulk-summaries.json";

const files = import.meta.glob<{ default: unknown }>(["../../models/**/*.json", "!../../models/grants/**"], { eager: true });
const bulkFiles = import.meta.env.SSR ? import.meta.glob<{ default: { id: string } }>("../../models/grants/**/*.json", { eager: true }) : {};
const bulk: unknown[] = import.meta.env.SSR ? Object.values(bulkFiles).map((f) => f.default) : bulkSummaries;
const factFiles = import.meta.glob<{ default: unknown }>("../../facts/*.json", { eager: true });
const charityFiles = import.meta.glob<{ default: unknown }>("../../charities/*.json", { eager: true });
import owners from "../../owners.json";

export const lib = buildLibrary(
  [...Object.values(files).map((f) => f.default), ...bulk],
  assumptions,
  Object.values(factFiles).map((f) => f.default),
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

export function historyUrl(lib: Library, m: ResolvedModel): string {
  return `${modelUrl(lib, m)}/history`;
}

/** Charities on the rankings: those with at least one model in a comparable unit. */
export const rankedCharities = [...lib.charities.values()].filter((c) => modelsOf(lib, c.id).some((m) => comparable(lib, m)));

/** Charities whose evaluators report only in units nobody can convert (e.g. people reached). */
export const unrankedCharities = [...lib.charities.values()].filter(
  (c) => modelsOf(lib, c.id).length > 0 && !modelsOf(lib, c.id).some((m) => comparable(lib, m)),
);

/** One comparable main model per ranked charity, for rank-flip checks. */
export const ranked = rankedCharities.map((c) => modelsOf(lib, c.id).find((m) => comparable(lib, m))!);
