// The reader's values in a tool call: a map of assumption id → number, a value set ({ set: <preset id> }),
// or both (the set first, single values on top), as the site's ?set= and ?values= links take them.
import { assumptionValues, type Library } from "../../src/engine/model";

export class ToolError extends Error {}

export type Values = {
  /** Every assumption's value for the engine: one object per call. */
  av: Record<string, number>;
  /** The value set picked, if any. */
  set?: string;
  /** What the reader set (the set's values and their own), after moving any value outside a slider's
   * ends to the nearest end: assumption id → value used. */
  applied: Record<string, number>;
  /** The share link's query string (?set=…&values=…), "" at the defaults. */
  query: string;
};

/** Assumptions a reader can set: neither derived from others nor fixed by evidence. */
export function settable(lib: Library): Map<string, Library["assumptions"]["rows"][number]> {
  return new Map(lib.assumptions.rows.filter((r) => r.formula === undefined && !r.fixed).map((r) => [r.id, r]));
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

export function parseValues(lib: Library, defaults: Record<string, number>, raw: unknown): Values {
  if (raw === undefined || raw === null || (typeof raw === "object" && !Array.isArray(raw) && !Object.keys(raw).length))
    return { av: defaults, applied: {}, query: "" };
  const given = typeof raw === "string" ? fromString(raw) : raw;
  if (typeof given !== "object" || Array.isArray(given) || given === null)
    throw new ToolError('values must be an object: { "<assumption id>": <number>, ... } or { "set": "<value set id>" }. list_assumptions gives the ids.');
  const { set, ...rest } = given as Record<string, unknown>;
  const user: Record<string, number> = {};
  let preset: string | undefined;
  if (set !== undefined) {
    const p = lib.assumptions.presets?.find((x) => x.id === set);
    if (!p) throw new ToolError(`No value set "${String(set)}". Value sets: ${(lib.assumptions.presets ?? []).map((x) => x.id).join(", ")}.`);
    preset = p.id;
    Object.assign(user, p.values);
  }
  const rows = settable(lib);
  const own: Record<string, number> = {};
  for (const [id, v] of Object.entries(rest)) {
    const r = rows.get(id);
    if (!r) {
      const known = lib.assumptions.rows.find((x) => x.id === id);
      throw new ToolError(known
        ? `${id} can't be set: it is ${known.formula !== undefined ? "derived from other assumptions" : "a fixed rate taken from evidence"}.`
        : `No assumption "${id}". Assumptions you can set: ${[...rows.keys()].join(", ")} (list_assumptions describes them).`);
    }
    const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
    if (typeof n !== "number" || !Number.isFinite(n)) throw new ToolError(`${id} must be a number, got ${JSON.stringify(v)}.`);
    own[id] = n;
  }
  Object.assign(user, own);
  const av = assumptionValues(lib.assumptions, user);
  const applied = Object.fromEntries(Object.keys(user).map((id) => [id, av[id]]));
  const params: string[] = [];
  if (preset) params.push(`set=${encodeURIComponent(preset)}`);
  const ownIds = Object.keys(own);
  if (ownIds.length) params.push(`values=${ownIds.map((id) => `${id}:${av[id]}`).join(",")}`);
  return { av, set: preset, applied, query: params.length ? `?${params.join("&")}` : "" };
}
