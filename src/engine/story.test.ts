// A story never contradicts its model (src/engine/story.ts): for every model with one, its steps chain
// to the model's result, at the defaults and at other values, for each location and the whole charity.
// A story whose steps don't multiply out fails.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assumptionValues, buildLibrary } from "./model";
import { chainErrors, checkStory, storyValueSets } from "./story";
import { compute, headline } from "./model";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});

describe("stories", () => {
  const lib = buildLibrary(
    walk(join(root, "models")).map(read),
    read(join(root, "assumptions/default.json")),
    walk(join(root, "facts")).map(read),
    walk(join(root, "charities")).map(read),
    read(join(root, "owners.json")),
  );
  const withStory = [...lib.models.values()].filter((m) => m.story && m.output);

  it("exist", () => expect(withStory.length).toBeGreaterThan(0));

  it("chain to the model's result at every set of values", () => {
    const sets = storyValueSets(lib, 8);
    expect(withStory.flatMap((m) => sets.flatMap((av) => checkStory(lib, m, av)))).toEqual([]);
  });

  it("catch a step that doesn't multiply out", () => {
    const m = withStory[0];
    const av = assumptionValues(lib.assumptions);
    const broken = { ...m.story!, steps: m.story!.steps.map((s, i) => (i === m.story!.steps.findIndex((x) => x.op) ? { ...s, op: s.op!.replace(/\{/, "{1.1 * ") } : s)) };
    expect(chainErrors(broken, compute(lib, m, av), headline(lib, m, av), m.id).length).toBeGreaterThan(0);
  });
});
