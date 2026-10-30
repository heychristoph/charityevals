// Every charity is ranked, so every unit a charity model reports in converts to the common unit.
// The animal exchange rates' defaults are derived from shared facts; these tests keep them in step.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, comparable, pickValue } from "../engine/model";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const fact = (k: string) => pickValue(lib.facts.get(k)!.value);

describe("exchange rates", () => {
  it("rank every charity model", () => {
    const unranked = [...lib.models.values()].filter((m) => m.kind === "charity" && m.output && !comparable(lib, m)).map((m) => m.id);
    expect(unranked).toEqual([]);
  });

  it("count an animal spared at the shared per-meal ratio, in every model that counts animals", () => {
    const ratio = fact("sad_factors.sads_per_meal_replaced") / fact("sad_factors.animals_spared_per_meal_replaced");
    const users = [...lib.models.values()].filter((m) => m.byId.has("sads_per_animal_spared"));
    expect(users.length).toBeGreaterThan(1);
    for (const m of users) expect(m.byId.get("sads_per_animal_spared")!.formula).toBe("@sad_factors.sads_per_meal_replaced / @sad_factors.animals_spared_per_meal_replaced");
    expect(ratio).toBeCloseTo(8.67, 1);
  });

  it("split a replaced meal's suffering into species shares that add up to the whole", () => {
    expect(fact("sad_factors.meal_sads_share_fish") + fact("sad_factors.meal_sads_share_chicken") + fact("sad_factors.meal_sads_share_pig")).toBeCloseTo(1, 9);
  });

  it("default animals spared per person reached to ACE's 2016 figures, weighted by Good Food Fund's reach", () => {
    const gff = lib.models.get("good-food-fund")!;
    const reach = (id: string) => pickValue(gff.byId.get(id)!.value);
    const engaged = reach("mk_people") / (reach("mk_people") + reach("summit_people") + reach("youth_people"));
    const weighted = engaged * fact("ace.ace2016_animals_spared_per_leaflet") + (1 - engaged) * fact("ace.ace2016_animals_spared_per_video_view");
    expect(pickValue(gff.byId.get("animals_spared_per_person_reached")!.value)).toBeCloseTo(weighted, 2);
  });
});
