// "Similar charities" on each charity's pages: a few others doing similar work, to explore from. Computed at
// build time from what is already in the data, so a new charity gets its list with no editing:
//   - what the charity does: the words of its summary and programme lines (TF-IDF, cosine similarity);
//   - the same cause (required while enough remain), the same area, the same template, the same measure
//     (the main model's unit: wellbeing, health, income, animals);
//   - where it works: the overlap of its main model's beneficiary countries.
// Only charities with a page of their own are candidates. The list carries names and links only, no figures:
// the site never compares charities in its text.
import type { Library, ResolvedModel } from "../engine/model";

type Charity = { id: string; name: string; cause: string; area?: string; summary?: string; lines?: { label?: string }[] };

const STOP = new Set(
  ("a an and are as at be by for from has have in into is it its of on or that the their them they this to was were which with " +
    "charity charities organisation organization programme program programmes programs work works year years people").split(" "),
);
const words = (s: string) => (s.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []).filter((w) => !STOP.has(w));

function vectors(docs: Map<string, string[]>): Map<string, Map<string, number>> {
  const df = new Map<string, number>();
  for (const ws of docs.values()) for (const w of new Set(ws)) df.set(w, (df.get(w) ?? 0) + 1);
  const n = docs.size;
  const out = new Map<string, Map<string, number>>();
  for (const [id, ws] of docs) {
    const tf = new Map<string, number>();
    for (const w of ws) tf.set(w, (tf.get(w) ?? 0) + 1);
    const v = new Map<string, number>();
    let norm = 0;
    for (const [w, c] of tf) {
      const x = (1 + Math.log(c)) * Math.log(1 + n / (df.get(w) ?? 1));
      v.set(w, x);
      norm += x * x;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [w, x] of v) v.set(w, x / norm);
    out.set(id, v);
  }
  return out;
}

const cosine = (a: Map<string, number>, b: Map<string, number>) => {
  let s = 0;
  for (const [w, x] of a) s += x * (b.get(w) ?? 0);
  return s;
};

const countries = (m: ResolvedModel | undefined): Set<string> => {
  const b = m?.beneficiaries;
  return b && typeof b === "object" ? new Set(Object.keys(b).filter((k) => k !== "world")) : new Set();
};

const jaccard = (a: Set<string>, b: Set<string>) => {
  if (!a.size || !b.size) return 0;
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i);
};

const memo = new WeakMap<Library, Map<string, string[]>>();
/** A charity's similar charities, computed once per build for all charities. */
export function similarTo(lib: Library, primaryOf: (lib: Library, id: string) => ResolvedModel | undefined, charity: string): string[] {
  let all = memo.get(lib);
  if (!all) memo.set(lib, (all = similarCharities(lib, primaryOf)));
  return all.get(charity) ?? [];
}

/** For every charity with a page, the ids of up to `k` similar ones, most similar first. */
export function similarCharities(lib: Library, primaryOf: (lib: Library, id: string) => ResolvedModel | undefined, k = 4): Map<string, string[]> {
  const charities = ([...lib.charities.values()] as unknown as Charity[]).filter((c) => primaryOf(lib, c.id));
  const primary = new Map(charities.map((c) => [c.id, primaryOf(lib, c.id)]));
  const docs = new Map(charities.map((c) => [c.id, words([c.name, c.summary ?? "", ...(c.lines ?? []).map((l) => l.label ?? "")].join(" "))]));
  const vec = vectors(docs);
  const where = new Map(charities.map((c) => [c.id, countries(primary.get(c.id))]));
  const out = new Map<string, string[]>();
  for (const c of charities) {
    const scored = charities
      .filter((o) => o.id !== c.id)
      .map((o) => {
        const text = cosine(vec.get(c.id)!, vec.get(o.id)!);
        const area = c.area && o.area && c.area === o.area ? 1 : 0;
        const template = primary.get(c.id)?.template && primary.get(c.id)?.template === primary.get(o.id)?.template ? 1 : 0;
        const unit = primary.get(c.id)?.output?.unit && primary.get(c.id)?.output?.unit === primary.get(o.id)?.output?.unit ? 1 : 0;
        const place = jaccard(where.get(c.id)!, where.get(o.id)!);
        return { id: o.id, sameCause: o.cause === c.cause, score: 0.55 * text + 0.15 * area + 0.1 * template + 0.15 * unit + 0.05 * place, name: o.name };
      })
      .sort((a, b) => Number(b.sameCause) - Number(a.sameCause) || b.score - a.score || a.name.localeCompare(b.name));
    out.set(c.id, scored.slice(0, k).map((s) => s.id));
  }
  return out;
}
