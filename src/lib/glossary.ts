// Special terms the site can't avoid (evaluators' units and jargon), each with a one-line meaning.
// Wherever one appears in a label or in prose, its first use gets an info tip (Glossed, glossary-tips).

export type Term = { id: string; match: RegExp; meaning: string };

export const TERMS: Term[] = [
  { id: "sad", match: /\bSADs?\b/, meaning: "Suffering-adjusted day: one day of an animal's disabling pain, milder pain counted as a fraction of a day, weighted by Ambitious Impact's estimate of how much the species can suffer. The unit ACE's animal analyses use." },
  { id: "ced", match: /\bchicken-equivalent pain days?\b/i, meaning: "One day of disabling pain in a chicken. Other animals' days are counted in chickens, by how much each species can suffer relative to a chicken. Every animal model here ends in this unit." },
  { id: "wellby", match: /\bWELLBYs?\b/, meaning: "Wellbeing-adjusted life year: one point of life satisfaction, on a 0–10 scale, for one person for one year. The Happier Lives Institute's unit." },
  { id: "daly", match: /\bDALYs?\b/, meaning: "Disability-adjusted life year: one year of healthy life lost to illness or early death. Averting one adds a year of healthy life, the unit this site ranks in." },
  { id: "uov", match: /\bunits? of value\b/i, meaning: "GiveWell's unit: one unit is the good of doubling one person's income for a year." },
  { id: "funging", match: /\bfung(?:ing|ibility)\b/i, meaning: "When a donation leads other funders, often governments, to spend less on the same thing, cancelling part of its effect." },
  { id: "leverage", match: /\bleverage\b/i, meaning: "When a donation draws in money from other funders, such as governments, adding to its effect." },
  { id: "counterfactual", match: /\bcounterfactual(?:ly)?\b/i, meaning: "Compared with what would have happened anyway, without this charity or donation." },
  { id: "moral-weight", match: /\bmoral weights?\b/i, meaning: "How much one kind of good counts against another, such as a saved life against higher income. A value judgment." },
  { id: "welfare-range", match: /\bwelfare range\b/i, meaning: "How intensely an animal can feel good or bad, compared with a person." },
  { id: "itn", match: /\bITNs?\b/, meaning: "Insecticide-treated bed net." },
  { id: "smc", match: /\bSMC\b/, meaning: "Seasonal malaria chemoprevention: antimalarial drugs given to young children each month of the rainy season." },
  { id: "vas", match: /\bVAS\b/, meaning: "Vitamin A supplementation." },
  { id: "ors", match: /\bORS\b/, meaning: "Oral rehydration salts, which treat dehydration from diarrhoea." },
];

export type Piece = string | { text: string; term: Term };

/** Text split around the first use of each term not already in `seen` (which it updates), so a term
 * explained once on a page isn't explained again. */
export function gloss(text: string, seen: Set<string> = new Set()): Piece[] {
  let pieces: Piece[] = [text];
  for (const term of TERMS) {
    if (seen.has(term.id)) continue;
    const at = pieces.findIndex((p) => typeof p === "string" && term.match.test(p));
    if (at < 0) continue;
    const s = pieces[at] as string;
    const m = s.match(term.match)!;
    const i = m.index!;
    pieces = [...pieces.slice(0, at), s.slice(0, i), { text: m[0], term }, s.slice(i + m[0].length), ...pieces.slice(at + 1)];
    seen.add(term.id);
  }
  return pieces.filter((p) => p !== "");
}
