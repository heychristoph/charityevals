// client:model="<id>": hydrates a model's page island once its full file and the facts' text have arrived.
// Several ids, comma-separated ("a,b"): a page showing several models in full (a charity's programmes).
//
// The browser bundle carries most models only as summaries (lib/browser-models.ts), but the island renders
// the full model, and hydration needs the same data the server rendered with. Passing the file as an
// island prop serialised it into the page (up to megabytes of HTML per page); instead the page links
// to /models/<id>.json, fetched alongside the island's code, and fullRaw() reads it from here.
// If the file can't be loaded, the server-rendered page stays as it is, without interaction.
import type { ClientDirective } from "astro";

const model: ClientDirective = async (load, opts) => {
  const ids = String(opts.value).split(",").map((x) => x.trim()).filter(Boolean);
  const id = ids.join(", ");
  try {
    const json = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));
    const g = globalThis as { __charityevalsFactTextLoad?: Promise<Record<string, Record<string, unknown>>>; __charityevalsAddFactText?: (t: Record<string, Record<string, unknown>>) => void };
    // The facts' text (explainers, sources), once per page for every island that shows a tree.
    const text = (g.__charityevalsFactTextLoad ??= json("/fact-text.json"));
    const [hydrate, raws, facts] = await Promise.all([load(), Promise.all(ids.map((x) => json(`/models/${x}.json`))), text]);
    ids.forEach((x, i) => ((globalThis.__charityevalsModels ??= {})[x] = raws[i]));
    g.__charityevalsAddFactText?.(facts);
    await hydrate();
  } catch (e) {
    console.warn(`charityevals: model ${id} not loaded, the page stays static`, e);
  }
};

export default model;
