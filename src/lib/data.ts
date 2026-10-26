// Loads every model and the shared assumptions at build time. Both the static pages and the
// React islands import this, so the library is identical on server and client.
import { buildLibrary, comparable } from "../engine/model";
import assumptions from "../../assumptions/default.json";

const files = import.meta.glob<{ default: unknown }>("../../models/**/*.json", { eager: true });
const factFiles = import.meta.glob<{ default: unknown }>("../../facts/*.json", { eager: true });

export const lib = buildLibrary(
  Object.values(files).map((f) => f.default),
  assumptions,
  Object.values(factFiles).map((f) => f.default),
);

if (lib.errors.length) throw new Error(`Model errors (run npm run check):\n${lib.errors.join("\n")}`);

/** Models with a page: charities and their variants, not templates. */
export const rankable = [...lib.models.values()].filter((m) => m.kind !== "template" && m.output);

/** Models on the rankings: one row per charity; variants (other countries) live on its page. */
export const ranked = rankable.filter((m) => m.kind === "charity" && comparable(lib, m));

/** Charities whose evaluator reports results in a unit nobody can convert (e.g. people reached). */
export const unranked = rankable.filter((m) => m.kind === "charity" && !comparable(lib, m));
