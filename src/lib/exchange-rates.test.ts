// Every charity is ranked, so every unit a charity model reports in converts to the common unit.
// The animal exchange rates' defaults are derived from shared facts; these tests keep them in step.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLibrary, assumptionValues, comparable, pickValue, toCommon } from "../engine/model";

const root = join(import.meta.dirname, "../..");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : f.endsWith(".json") ? [p] : [];
});
const lib = buildLibrary(walk(join(root, "models")).map(read), read(join(root, "assumptions/default.json")),
  walk(join(root, "facts")).map(read), walk(join(root, "charities")).map(read), read(join(root, "owners.json")));
const fact = (k: string) => pickValue(lib.facts.get(k)!.value);
const best = (id: string) => pickValue(lib.assumptions.rows.find((r) => r.id === id)!.value);

describe("exchange rates", () => {
  it("rank every charity model", () => {
    const unranked = [...lib.models.values()].filter((m) => m.kind === "charity" && m.output && !comparable(lib, m)).map((m) => m.id);
    expect(unranked).toEqual([]);
  });

  it("convert animals spared through SADs", () => {
    const av = assumptionValues(lib.assumptions, { sads_per_animal_spared: 7, daly_per_sad: 0.002 });
    const sad = toCommon(lib, "sad", av);
    expect(toCommon(lib, "animals_spared", av)).toBeCloseTo(7 * sad, 12);
  });

  it("default SADs per animal spared to ACE's per-meal ratio", () => {
    const ratio = fact("ace.dvf_sads_per_meal") / fact("ace.dvf_animals_spared_per_meal");
    expect(best("sads_per_animal_spared")).toBeCloseTo(ratio, 1);
  });

  it("default animals spared per person reached to ACE's 2016 figures, weighted by Good Food Fund's reach", () => {
    const gff = lib.models.get("good-food-fund")!;
    const reach = (id: string) => pickValue(gff.byId.get(id)!.value);
    const engaged = reach("mk_people") / (reach("mk_people") + reach("summit_people") + reach("youth_people"));
    const weighted = engaged * fact("ace.ace2016_animals_spared_per_leaflet") + (1 - engaged) * fact("ace.ace2016_animals_spared_per_video_view");
    expect(pickValue(gff.byId.get("animals_spared_per_person_reached")!.value)).toBeCloseTo(weighted, 2);
  });
});
