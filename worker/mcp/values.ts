// The reader's values in a tool call: a map of assumption id → number, a value set ({ set: <preset id> }),
// or both (the set first, single values on top), as the site's ?set= and ?values= links take them. The
// same values are accepted as in the panel and in share links (src/lib/share-values.ts): any value the
// models can run on, past a slider's ends too. Where the site would silently drop one, this says why.
import type { Assumptions } from "../../src/engine/schema";
import { byCode } from "../../src/engine/countries";
import { presetIn, runnable, sanitizeValues, serialiseValues, sliderEnds } from "../../src/lib/share-values";

export class ToolError extends Error {}

export type Values = {
  /** The value set picked, if any. */
  set?: string;
  /** The values that differ from the defaults (the set's and the reader's own): assumption id → value used. */
  applied: Record<string, number>;
  /** The share link's query string (?set=… or ?values=…, as the site writes it), "" at the defaults. */
  query: string;
  /** "default", a value set's id when the values are exactly its values, else "custom". */
  scenario: string;
};

export const DEFAULTS: Values = { applied: {}, query: "", scenario: "default" };

type AssumptionRow = Assumptions["rows"][number];

/** Assumptions a reader can set: neither derived from others nor fixed by evidence. */
export function settable(a: Assumptions): Map<string, AssumptionRow> {
  return new Map(a.rows.filter((r) => r.formula === undefined && !r.fixed && r.value !== undefined).map((r) => [r.id, r]));
}

/** "a:1,b:2" (a share link's ?values=) as a map. */
function fromString(s: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const part of s.split(",").map((x) => x.trim()).filter(Boolean)) {
    const at = part.lastIndexOf(":");
    if (at < 1) throw new ToolError(`values: "${part}" isn't id:number`);
    out[part.slice(0, at).trim()] = Number(part.slice(at + 1));
  }
  return out;
}

/** Why the models can't run on a value the share-link rules drop. */
function whyNot(r: AssumptionRow, v: number): string {
  if (r.format === "toggle") return `${r.id} is on or off: 1 or 0.`;
  if (r.control === "country") return `${r.id} is a country's ISO 3166 numeric code (0 for none), and ${v} is none.`;
  if (v < 0) return `${r.id} can't be negative.`;
  if (r.format === "percent" && v > 1) return `${r.id} is a share, given as a fraction: at most 1 (100%).`;
  return `${r.id} can't be 0 (its scale starts at ${sliderEnds(r).low}).`;
}

export function parseValues(a: Assumptions, raw: unknown): Values {
  if (raw === undefined || raw === null || (typeof raw === "object" && !Array.isArray(raw) && !Object.keys(raw).length)) return DEFAULTS;
  const given = typeof raw === "string" ? fromString(raw) : raw;
  if (typeof given !== "object" || Array.isArray(given) || given === null)
    throw new ToolError('values must be an object: { "<assumption id>": <number>, ... } or { "set": "<value set id>" }. list_assumptions gives the ids.');
  const { set, ...rest } = given as Record<string, unknown>;
  const presets = a.presets ?? [];
  const user: Record<string, number> = {};
  let preset: string | undefined;
  if (set !== undefined) {
    const p = presets.find((x) => x.id === set);
    if (!p) throw new ToolError(`No value set "${String(set)}". Value sets: ${presets.map((x) => x.id).join(", ")}.`);
    preset = p.id;
    Object.assign(user, p.values);
  }
  const rows = settable(a);
  for (const [id, v] of Object.entries(rest)) {
    const r = rows.get(id);
    if (!r) {
      const known = a.rows.find((x) => x.id === id);
      throw new ToolError(known
        ? `${id} can't be set: it is ${known.formula !== undefined ? "derived from other assumptions" : "a fixed rate taken from evidence"}.`
        : `No assumption "${id}". Assumptions you can set: ${[...rows.keys()].join(", ")} (list_assumptions describes them).`);
    }
    const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
    if (typeof n !== "number" || !Number.isFinite(n)) throw new ToolError(`${id} must be a number, got ${JSON.stringify(v)}.`);
    const ok = r.control === "country" ? n === 0 || byCode.has(n) : r.format === "toggle" ? n === 0 || n === 1 : runnable(r, n);
    if (!ok) throw new ToolError(whyNot(r, n));
    user[id] = n;
  }
  const applied = sanitizeValues(a, user);
  const { set: linkSet, values } = serialiseValues(presets, applied, { explicitDefault: true });
  const query = linkSet ? `?set=${encodeURIComponent(linkSet)}` : values ? `?values=${values}` : "";
  return { set: preset, applied, query, scenario: presetIn(presets, applied) };
}
