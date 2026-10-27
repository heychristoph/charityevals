// client:model="<id>": hydrates a bulk model's page island once its full file has arrived.
//
// The browser bundle carries bulk models only as summaries (see lib/data.ts), but the island renders
// the full model, and hydration needs the same data the server rendered with. Passing the file as an
// island prop serialised it into the page (up to megabytes of HTML per page); instead the page links
// to /models/<id>.json, fetched alongside the island's code, and bulkRaw() reads it from here.
// If the file can't be loaded, the server-rendered page stays as it is, without interaction.
import type { ClientDirective } from "astro";

const model: ClientDirective = async (load, opts) => {
  const id = String(opts.value);
  try {
    const [hydrate, raw] = await Promise.all([
      load(),
      fetch(`/models/${id}.json`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
    ]);
    (globalThis.__charityevalsModels ??= {})[id] = raw;
    await hydrate();
  } catch (e) {
    console.warn(`charityevals: model ${id} not loaded, the page stays static`, e);
  }
};

export default model;
