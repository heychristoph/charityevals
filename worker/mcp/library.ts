// The library the MCP server answers from: /data/library.json (the build writes it from the same files
// the pages read: published models only), built once per isolate with src/engine, as the browser builds
// it. Every figure is computed from it, so the answers move with the reader's values like the site does.
import { assumptionValues, buildLibrary, type Distribution, type Library } from "../../src/engine/model";

/** /data/library.json (src/lib/open-data.ts libraryJson): buildLibrary's inputs in its order, the last
 * its options, carrying the simulations the plausible ranges and the risk setting read
 * (generated/distributions.json). Bulk imports are their browser stand-ins; text keeps its
 * `{{placeholders}}`, rendered here as an answer quotes it. */
export type LibraryInput = {
  models: unknown[];
  assumptions: unknown;
  facts: unknown[];
  charities: unknown[];
  owners: unknown[];
  options?: { distributions?: Record<string, Distribution> };
};

export type Loaded = {
  lib: Library;
  /** The default assumption values: one object, so the engine's caches keyed on it last the isolate. */
  defaults: Record<string, number>;
};

/** The library from its inputs. The data was validated by the build (npm run check), so it is trusted, as
 * in the browser. An evaluator who asked not to be published (owners.json `published: false`) stays out
 * whatever the file holds: buildLibrary drops its models, and so does this, by their own owner field. */
export function libraryFrom(input: LibraryInput): Loaded {
  const owners = (input.owners ?? []) as { id?: string; published?: boolean }[];
  const hidden = new Set(owners.filter((o) => o.published === false).map((o) => o.id));
  const models = (input.models ?? []).filter((m) => !hidden.has((m as { owner?: string }).owner));
  const lib = buildLibrary(models, input.assumptions, input.facts ?? [], input.charities ?? [], owners, { trusted: true, distributions: input.options?.distributions });
  if (lib.errors.length) console.error(`library: ${lib.errors.length} errors, first: ${lib.errors[0]}`);
  return { lib, defaults: assumptionValues(lib.assumptions) };
}

/** One library per isolate: loaded on the first call, shared by every later one. A failed load isn't
 * kept, so the next request tries again. */
export function cachedLoader(fetchInput: () => Promise<LibraryInput>): () => Promise<Loaded> {
  let loading: Promise<Loaded> | undefined;
  return () => {
    loading ??= fetchInput().then(libraryFrom).catch((e) => {
      loading = undefined;
      throw e;
    });
    return loading;
  };
}
