// The terms a model, write-up or figure can be reused under: one place, read by the pages, the data
// files (/data/*), llms.txt and the MCP server. charityevals' own work is CC BY 4.0; a model rebuilt from an
// evaluator's analysis keeps that evaluator's terms (its source.license, else the source's own terms).

export type Licence = { name: string; url?: string; attribution: string };

export const CC_BY_4 = "CC BY 4.0";
const URLS: Record<string, string> = {
  [CC_BY_4]: "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-NC-SA 3.0 US": "https://creativecommons.org/licenses/by-nc-sa/3.0/us/",
  "CC BY-NC 4.0": "https://creativecommons.org/licenses/by-nc/4.0/",
};
// "CC BY 4.0 (Zenodo record …)" is CC BY 4.0 too; "EA Forum posts: CC BY 4.0; the sheet …" is not one licence.
export const licenceUrl = (name: string) => Object.entries(URLS).find(([k]) => name === k || name.startsWith(`${k} (`))?.[1];

/** Our own work (models we built, write-ups, shared facts and assumptions, the site's figures). */
export const OWN_LICENCE: Licence = {
  name: CC_BY_4,
  url: URLS[CC_BY_4],
  attribution: "charityevals (charityevals.org)",
};

type Licensed = { owner: string; source?: { license?: string; publisher?: string } };

/** The licence of one model: ours for charityevals' own models, else the source's. */
export function licenceOf(m: Licensed): Licence {
  if (m.owner === "charityevals") return OWN_LICENCE;
  const name = m.source?.license;
  const by = m.source?.publisher ?? m.owner;
  if (!name) return { name: `${by}'s terms (not stated; ask them before reusing)`, attribution: `${by}, rebuilt by charityevals (charityevals.org)` };
  return { name, url: licenceUrl(name), attribution: `${by}, rebuilt by charityevals (charityevals.org)` };
}

/** How a page names a licence: "Licence: CC BY 4.0", or a copyright notice as it is. */
export const licenceLabel = (l: Licence) => (l.name.startsWith("©") ? l.name : `Licence: ${l.name}`);

/** A one-line citation of a model page: who made it, its name, its address, the day it was read. */
export function citation(m: Licensed & { name: string }, url: string, accessed: Date): string {
  const by = m.owner === "charityevals" ? "charityevals" : `${m.source?.publisher ?? m.owner}, rebuilt by charityevals`;
  const day = accessed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `${by}, "${m.name}", ${url}, accessed ${day}.`;
}
