// Figures the way the site makes them: every one comes from src/engine/figures.ts, the module the pages
// (src/lib/use-results.ts), the data files and the audit tools call, so the answers can't differ from
// the pages.
import { headline, type Library, type ResolvedModel } from "../../src/engine/model";
import {
  charityFigure as engineCharityFigure,
  modelFigure as engineModelFigure,
  modelFlags,
  modelRange,
  rankings as engineRankings,
  type CharityFigure as EngineCharityFigure,
  type ModelFigure,
} from "../../src/engine/figures";

export type Figure = { central: number; low: number; high: number };
export type CharityFigure = EngineCharityFigure<ModelFigure>;

/** A model's headline (years of healthy life per $1,000, or its own unit per dollar where that doesn't
 * convert) and range, as its page and the rankings show them. */
export const modelFigure = (lib: Library, m: ResolvedModel, av: Record<string, number>): ModelFigure => engineModelFigure(lib, m, av);

/** A model's caveats, as the rankings show them beside it. */
export function caveats(lib: Library, m: ResolvedModel, av: Record<string, number>): string[] {
  return modelFlags(lib, m, modelRange(lib, m, headline(lib, m, av), av)).map((f) => f.text);
}

function memo(lib: Library, av: Record<string, number>) {
  const seen = new Map<ResolvedModel, ModelFigure>();
  return (m: ResolvedModel) => seen.get(m) ?? seen.set(m, engineModelFigure(lib, m, av)).get(m)!;
}

/** A charity's figure at values `av`: as the rankings count it, or (`rankings` false) as its own page
 * shows it, every programme counted. */
export function charityFigure(lib: Library, charity: string, av: Record<string, number>, rankings = true): CharityFigure | undefined {
  return engineCharityFigure(lib, charity, av, memo(lib, av), rankings);
}

/** Every charity on the rankings at values `av`, best first (the homepage's order). */
export function rankings(lib: Library, av: Record<string, number>): CharityFigure[] {
  return engineRankings(lib, av, memo(lib, av));
}
