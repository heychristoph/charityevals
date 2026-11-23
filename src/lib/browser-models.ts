// Which models the browser carries only as a summary (scripts/summaries.ts: rows that move with the
// sliders stay live, the rest is folded into numbers, the text left out). Every page ships the whole
// library so the rankings can follow the reader's values; full model files would be tens of megabytes.
// A summarised model's own page fetches its full file before its islands hydrate (client:model).
//
// Summarised: bulk imports, and every standalone model with a result. Shipped in full: a variant family
// (a model other models extend, and those variants), as a variant inherits its parent's rows by id, which
// a summary renames; and a model whose simulation is unstable, as its range is every input at its worst
// and best end, worked out on its rows. Both are few and small.

type ModelLike = { id: string; extends?: string; output?: unknown; bulk?: boolean };

/** The ids of the models the browser carries as summaries, out of all the models (files or resolved),
 * given the stored simulations (generated/distributions.json). */
export function summarisedIds(models: ModelLike[], distributions: Record<string, object>): Set<string> {
  const parents = new Set(models.map((m) => m.extends).filter((x): x is string => !!x));
  return new Set(models.filter((m) => m.bulk || (!m.extends && !parents.has(m.id) && !!m.output && !(distributions[m.id] as { unstable?: boolean } | undefined)?.unstable)).map((m) => m.id));
}

/** The text of a shared fact that no computation reads: where it comes from and why. The browser's
 * copy of the facts leaves it out (generated/browser-facts.json); a model's page fetches it before its
 * tree hydrates (/fact-text.json, lib/model-directive.ts). */
export const FACT_TEXT = ["explainer", "source"] as const;

type FactFile = { rows?: Record<string, unknown>[]; source?: unknown } & Record<string, unknown>;

/** The facts as the browser carries them: every number, label and unit, without FACT_TEXT. */
export function browserFacts(files: FactFile[]): FactFile[] {
  return files.map(({ source: _source, rows, ...file }) => ({
    ...file,
    rows: (rows ?? []).map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !(FACT_TEXT as readonly string[]).includes(k)))),
  }));
}
