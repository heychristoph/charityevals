// Every page ships generated/browser-models.json (src/lib/browser-models.ts): a stand-in for each
// standalone model. The rankings and every headline in the browser come from these, so they must give
// exactly the full models' results, whatever the visitor's assumptions, or the rankings would drift from
// the pages.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, assumptionValues, bottomLine, headline } from "../engine/model";
import { FACT_TEXT, summarisedIds } from "./browser-models";

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
  const browser = library(read(join(root, "generated/browser-models.json")));
  const ids = summarisedIds(own, distributions);

  it("are valid models, the same set as the full library", () => {
    expect(browser.errors).toEqual([]);
    expect([...browser.models.keys()].sort()).toEqual([...full.models.keys()].sort());
  });

  it("are summaries for standalone models and the files as written for variant families", () => {
    expect(ids.size).toBeGreaterThan(100);
    for (const m of own) if (!ids.has(m.id)) expect(m.extends || own.some((x) => x.extends === m.id) || distributions[m.id]?.unstable).toBeTruthy();
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

  it("ship the facts without their text and give the same results with them", () => {
    const facts = walk(join(root, "facts")).map(read);
    const slim = read(join(root, "generated/browser-facts.json"));
    const text = JSON.stringify(slim);
    for (const k of FACT_TEXT) expect(text.includes(`"${k}":`)).toBe(false);
    const withSlim = buildLibrary([...read(join(root, "generated/browser-models.json")), ...bulk], read(join(root, "assumptions/default.json")),
      slim, walk(join(root, "charities")).map(read), read(join(root, "owners.json")), { distributions, trusted: true });
    const av = assumptionValues(full.assumptions, { daly_per_child_death: 80, discount_rate: 0.01 });
    const diffs: string[] = [];
    for (const [id, m] of full.models) {
      if (m.kind === "template" || !m.output) continue;
      const x = headline(full, m, av), y = headline(withSlim, withSlim.models.get(id)!, av);
      if (!((Number.isNaN(x) && Number.isNaN(y)) || Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x)))) diffs.push(`${id}: ${x} vs ${y}`);
    }
    expect(diffs).toEqual([]);
    // What the page fetches back (/fact-text.json) is every stripped field.
    const stripped = facts.flatMap((f: { id: string; rows: Record<string, unknown>[] }) => f.rows.flatMap((r) => FACT_TEXT.filter((k) => r[k] !== undefined).map((k) => `${f.id}.${r.id}:${k}`)));
    const served = [...full.facts].flatMap(([key, f]) => FACT_TEXT.filter((k) => (f as Record<string, unknown>)[k] !== undefined).map((k) => `${key}:${k}`));
    expect(new Set(served)).toEqual(new Set(stripped));
  });
}, 300_000);
