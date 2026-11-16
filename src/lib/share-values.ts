// Which values a reader may set for the shared assumptions, wherever they come from: the values panel,
// a share link (src/lib/assumption-state.ts) or an AI assistant's call to the MCP server
// (worker/mcp/values.ts). Any value the models can run on is kept, past a slider's ends too.
import { pickValue } from "../engine/model";
import { byCode } from "../engine/countries";
import type { Assumptions, Row } from "../engine/schema";

/** A slider's ends: its own where it has them, else the value's range (a tenth to ten times a bare
 * value). `zero`: on a log scale, 0 is a stop below `low`. */
export function sliderEnds(r: Pick<Row, "value" | "slider">): { low: number; high: number; zero: boolean } {
  const best = pickValue(r.value);
  const v = typeof r.value === "object" ? r.value : { best, low: undefined, high: undefined };
  let low = r.slider?.low ?? v.low ?? best / 10;
  let high = r.slider?.high ?? v.high ?? best * 10;
  if (low === high) {
    low = best / 10;
    high = best * 10;
  }
  return { low, high, zero: low > 0 && !r.slider?.linear && !!r.slider?.zero };
}

export const isDefault = (v: number, best: number) => Math.abs(v - best) <= Math.abs(best) * 1e-9;

/** Whether the models can run on a value, as typing it in the panel allows: not negative, not 0 on a log
 * slider without a zero stop, and a share, rate or probability shown as a percent at most 100%. Past the
 * slider's ends is fine. */
export function runnable(r: Row, v: number): boolean {
  const { low, zero } = sliderEnds(r);
  if (v < 0 || (v === 0 && low > 0 && !r.slider?.linear && !zero)) return false;
  return !(r.format === "percent" && !r.shown_as && v > 1);
}

/** Only values a reader can set (not fixed, not derived), each one the models can run on: a toggle is on
 * or off, a country one that exists (0 for none). Values at the default are dropped. */
export function sanitizeValues(a: Pick<Assumptions, "rows">, o: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [id, raw] of Object.entries(o)) {
    const r = a.rows.find((x) => x.id === id);
    if (!r || r.fixed || r.value === undefined || typeof raw !== "number" || !Number.isFinite(raw)) continue;
    let v = raw;
    if (r.control === "country") {
      if (v !== 0 && !byCode.has(v)) continue;
    } else if (r.format === "toggle") v = v >= 0.5 ? 1 : 0;
    else if (!runnable(r, v)) continue;
    if (!isDefault(v, pickValue(r.value))) out[id] = v;
  }
  return out;
}

/** A number in as few characters as read back to 6 significant figures: 0.04, 7.1e-5, 840. */
export function shortNumber(v: number): string {
  const n = Number(v.toPrecision(6));
  const plain = String(n);
  const exp = n.toExponential().replace("e+", "e");
  return exp.length < plain.length ? exp : plain;
}

type Preset = { id: string; values: Record<string, number> };

/** Which set the values are: "default" with none changed, a set's id when they are exactly its values,
 * else "custom". */
export function presetIn(presets: Preset[], o: Record<string, number>): string {
  const keys = Object.keys(o);
  if (!keys.length) return "default";
  const same = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 1e-6;
  return presets.find((p) => Object.keys(p.values).length === keys.length && keys.every((k) => k in p.values && same(o[k], p.values[k])))?.id ?? "custom";
}

/** A share link's query for a state (`?set=` / `?values=`): a value set's id when it is exactly one, else
 * the changed values. `explicitDefault`: the defaults as `set=default`, so a link someone shares (Copy link,
 * an MCP answer) shows the defaults even to a recipient with saved values of their own; the address bar,
 * which follows every change, leaves the defaults out. */
export function serialiseValues(presets: Preset[], o: Record<string, number>, { explicitDefault = false } = {}): { set?: string; values?: string } {
  const preset = presetIn(presets, o);
  if (preset === "default") return explicitDefault ? { set: "default" } : {};
  if (preset !== "custom") return { set: preset };
  return { values: Object.entries(o).map(([k, v]) => `${k}:${shortNumber(v)}`).join(",") };
}
