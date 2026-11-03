// Bridges between outcome units (docs/normalization.md 2.6), shared by the invariants
// (src/engine/invariants.ts INV-2b, INV-10, INV-17) and the lint (src/engine/lint.ts).
import type { Library, ResolvedModel } from "./model";

/** Units the design ranks in: tco2e is climate's, converted through the deaths a tonne causes. */
export const RANKED_UNITS = ["uov", "daly", "wellby", "ced", "tco2e"];
const squash = (f: string) => f.replace(/\s+/g, "");

/** Bridges (docs/normalization.md 2.6): a model whose work has outcomes in several units (a social
 * service's WELLBYs, income and health; a conservation programme's tonnes and illness) counts each
 * in its own unit, sums it in a row `<input>`, and puts it into the output unit in one row whose
 * formula is exactly `<input> * (<to_common of its unit>) / (<to_common of the output unit>)`, in an
 * ours section. The output unit's conversion multiplies it back, so each outcome reaches the headline
 * through its own unit's shared conversion, and moves with its own sliders only. wellbys_from_uov is
 * the bridge from uov into WELLBYs. */
export function bridgeFormula(input: string, from: string, to: string, units: Record<string, { to_common?: string }>): string {
  const tf = units[from]?.to_common, tt = units[to]?.to_common;
  return `${input}${tf === "1" ? "" : ` * (${tf})`}${tt === "1" ? "" : ` / (${tt})`}`;
}
export type Bridge = { row: string; input: string; from: string };
/** The bridges a model has: rows of one of its ours sections whose formula is a bridge into its output unit. */
export function bridgesOf(lib: Library, m: ResolvedModel): Bridge[] {
  const to = m.output?.unit;
  if (!to || !lib.assumptions.units[to]?.to_common) return [];
  const out: Bridge[] = [];
  for (const r of m.rows) {
    const input = r.formula && /^\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(r.formula)?.[1];
    if (!input || !m.byId.has(input)) continue;
    for (const from of RANKED_UNITS)
      if (from !== to && lib.assumptions.units[from]?.to_common && squash(r.formula!) === squash(bridgeFormula(input, from, to, lib.assumptions.units))) { out.push({ row: r.id, input, from }); break; }
  }
  return out;
}
/** Rows a bridge's formula reads besides its input (a tco2e bridge: air_pollution_weight, extra_deaths_per_tco2e). */
export const bridgeRows = (m: ResolvedModel, b: Bridge) => (m.byId.get(b.row)?.deps ?? []).filter((d) => d !== b.input);

