// Countries and world regions (facts/countries.json): what the reader's distance weight reads
// ($home_country, $distance_discount; src/engine/model.ts distanceNode). A country is stored as its ISO
// 3166 numeric code, so it travels through the assumptions, the URL and the overrides like any number.
import data from "../../facts/countries.json";

export type Country = { iso3: string; m49: number; name: string; region: number; population: number };

export const COUNTRIES: Country[] = data.countries;
export const REGIONS: { m49: number; name: string }[] = data.regions;

export const byIso3 = new Map(COUNTRIES.map((c) => [c.iso3, c]));
export const byCode = new Map(COUNTRIES.map((c) => [c.m49, c]));
export const regionName = new Map(REGIONS.map((r) => [r.m49, r.name]));

const world = COUNTRIES.reduce((s, c) => s + c.population, 0);
const regionPopulation = new Map<number, number>();
for (const c of COUNTRIES) regionPopulation.set(c.region, (regionPopulation.get(c.region) ?? 0) + c.population);

/** The M49 code of a country's world region, by the country's numeric code; 0 for none. */
export const regionOf = (code: number): number => byCode.get(code)?.region ?? 0;
/** A country's share of the world's population; 0 for none. */
export const populationShare = (code: number): number => (byCode.get(code)?.population ?? 0) / world;
/** The share of the world's population living in a country's region (the country included); 0 for none. */
export const regionPopulationShare = (code: number): number => (regionPopulation.get(regionOf(code)) ?? 0) / world;

/** How many steps a country is from home: 0 the same country, 1 the same region, 2 elsewhere. */
export function steps(home: number, iso3: string): 0 | 1 | 2 {
  const c = byIso3.get(iso3);
  if (c?.m49 === home) return 0;
  return c && c.region === regionOf(home) ? 1 : 2;
}
