// Every page ships generated/browser-models.json (src/lib/browser-models.ts): a stand-in for each
// standalone model. The rankings and every headline in the browser come from these, so they must give
// exactly the full models' results, whatever the visitor's assumptions, or the rankings would drift from
// the pages.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, assumptionValues, bottomLine, headline } from "../engine/model";
import { summarisedIds } from "./browser-models";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const own = walk(join(root, "models")).filter((p) => !p.includes("/models/grants/")).map(read);
const bulk = read(join(root, "generated/bulk-summaries.json"));
const distributions = read(join(root, "generated/distributions.json"));
const library = (models: unknown[]) => buildLibrary([...models, ...bulk], read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")), { distributions });

describe("browser models", () => {
  const full = library(own);
  // An unpublished owner's models (owners.json `published: false`) leave the library and never ship.
  const shipped = own.filter((m) => full.models.has(m.id));
  const browser = library(read(join(root, "generated/browser-models.json")));
  const ids = summarisedIds(shipped, distributions);

  it("are valid models, the same set as the full library", () => {
    expect(browser.errors).toEqual([]);
    expect([...browser.models.keys()].sort()).toEqual([...full.models.keys()].sort());
  });

  it("are summaries for standalone models and the files as written for variant families", () => {
    expect(ids.size).toBeGreaterThan(100);
    for (const m of shipped) if (!ids.has(m.id)) expect(m.extends || shipped.some((x) => x.extends === m.id) || distributions[m.id]?.unstable).toBeTruthy();
  });

  it("match the full models under other assumptions, in both views and on the headline", () => {
    const over = { daly_per_child_death: 80, discount_rate: 0.01, uov_per_daly: 4, chicken_vs_person: 0.3, risk_quantile: 0.2, missing_data_discount: 0.8 };
    const avF = assumptionValues(full.assumptions, over), avB = assumptionValues(browser.assumptions, over);
    const diffs: string[] = [];
    const close = (a: number, b: number) => (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
    for (const id of ids) {
      const f = full.models.get(id)!, b = browser.models.get(id)!;
      for (const view of ["charityevals", "evaluator"] as const) {
        const x = bottomLine(full, f, avF, {}, view).native, y = bottomLine(browser, b, avB, {}, view).native;
        if (!close(x, y)) diffs.push(`${id} (${view}): ${x} vs ${y}`);
      }
      const x = headline(full, f, avF), y = headline(browser, b, avB);
      if (!close(x, y)) diffs.push(`${id} headline: ${x} vs ${y}`);
    }
    expect(diffs).toEqual([]);
  });
}, 300_000);
