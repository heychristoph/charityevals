// "What it depends on": the numbers a model's page asks the reader about, the ones that make up most of
// the uncertainty in its result (src/engine/uncertainty.ts). One choice for the page (ModelLayers,
// WholeLayers) and for the readers that don't run it (src/lib/page-text.ts: the MCP server, the data
// files, llms-full.txt).
import { compute, type ResolvedModel } from "../engine/model";
import { uncertainty, type Driver, type Uncertainty } from "../engine/uncertainty";
import { lib } from "./data";
import type { Charity, ProgramFigure } from "./whole";

/** Questions shown: enough to cover this share of the uncertainty, at most MAX. */
export const COVER = 0.8;
export const MAX = 5;

/** A model's questions, most uncertainty first. */
export function pickDrivers(u: Uncertainty, model: ResolvedModel): Driver[] {
  const ranked = u.drivers.filter((d) => d.scope !== "model" && (d.scope !== "row" || model.byId.has(d.id))).sort((a, b) => b.share - a.share);
  const out: Driver[] = [];
  let covered = 0;
  for (const d of ranked) {
    if (out.length >= MAX || covered >= COVER || d.share < 0.01) break;
    out.push(d);
    covered += d.share;
  }
  return out;
}

export type Ask = { d: Driver; p: ProgramFigure; weight: number };

/** A charity of several programmes: each programme's drivers, weighted by how much of the charity's
 * result it gives. A number that two programmes name alike is left out (an edit to it would land in both). */
export function charityDrivers(c: Charity, av: Record<string, number>): Ask[] {
  const seen = new Map<string, Ask>();
  for (const p of c.programs) {
    const values = compute(lib, p.model, av, p.edits);
    const u = uncertainty(lib, p.model, values, av, "charityevals", p.edits);
    const part = c.result ? (p.share * p.whole.result) / c.result : p.share;
    for (const d of u.drivers) {
      if (d.scope === "model" || (d.scope === "row" && (!p.model.byId.has(d.id) || c.programs.some((o) => o !== p && o.model.byId.has(d.id))))) continue;
      const prev = seen.get(d.key);
      const weight = (prev?.weight ?? 0) + part * d.share;
      seen.set(d.key, { d, p: prev && prev.p.share > p.share ? prev.p : p, weight });
    }
  }
  const out: Ask[] = [];
  let covered = 0;
  for (const a of [...seen.values()].sort((x, y) => y.weight - x.weight)) {
    if (out.length >= MAX || covered >= COVER || a.weight < 0.01) break;
    out.push(a);
    covered += a.weight;
  }
  return out;
}
